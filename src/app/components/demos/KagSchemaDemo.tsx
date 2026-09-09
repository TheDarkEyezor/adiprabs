'use client';
import React, { useMemo, useState } from 'react';
import { DemoFrame } from './DemoFrame';

/* ---------------------------------------------------------------------------
 * KAG's SPG schema DSL, with the error reporting I contributed upstream.
 *
 * KAG is OpenSPG's framework, not mine. What is mine is the diagnostics in
 * knext/schema/marklang/schema_ml.py: before, a bad schema gave you
 * "Line# 7: <message>" and nothing else. My change threads the source line and
 * a highlight term through error_msg, so the parser points at the token that
 * actually broke, and adds the missing-identifier and duplicate-identifier
 * checks that previously failed further downstream with a confusing message.
 *
 * The validation rules, keyword set and message strings below are the ones in
 * that file. Parsing here covers namespace and type declarations, which is
 * where those checks live.
 * ------------------------------------------------------------------------- */

// schema_ml.py: SPGSchemaMarkLang.reset()
const KEYWORD_TYPE = new Set(['EntityType', 'ConceptType', 'EventType', 'StandardType', 'BasicType']);

const NAMESPACE_RE = /^namespace\s+([a-zA-Z0-9]+)$/;
// The widened capture is part of the same change: \(\w+\) could not match an
// empty identifier, so "Chunk():EntityType" failed with a generic parse error
// instead of "missing identifier".
const TYPE_RE = /^([a-zA-Z0-9.]+)\((.*?)\):\s*?([a-zA-Z0-9,]+)$/;

type Diag = { line: number; msg: string; source: string; term?: string; col?: number };

function parseSchema(src: string): { diags: Diag[]; types: { name: string; id: string; cls: string }[]; namespace?: string } {
  const diags: Diag[] = [];
  const types: { name: string; id: string; cls: string }[] = [];
  const definedIds = new Set<string>();
  const seenTypes = new Set<string>();
  let namespace: string | undefined;

  const err = (line: number, source: string, msg: string, term?: string) => {
    const display = source.replace(/\t/g, '  ');
    const col = term && display.includes(term) ? display.indexOf(term) : undefined;
    diags.push({ line, msg, source: display, term, col });
  };

  src.split('\n').forEach((raw, i) => {
    const lineNo = i + 1;
    const expr = raw.trim();
    if (!expr || expr.startsWith('#')) return;

    const ns = NAMESPACE_RE.exec(expr);
    if (ns) {
      if (namespace !== undefined) {
        err(lineNo, raw, 'Duplicated namespace define, please ensure define it only once', 'namespace');
        return;
      }
      namespace = ns[1];
      return;
    }

    const m = TYPE_RE.exec(expr);
    if (!m) {
      // Indented lines are properties/relations; this demo stops at type level.
      if (/^\s/.test(raw)) return;
      err(lineNo, raw, 'Unparsable declaration, expected `Name(identifier): TypeClass`');
      return;
    }

    const [, typeName, idRaw, clsRaw] = m;
    const id = idRaw.trim();
    const cls = clsRaw.trim();

    if (namespace === undefined) {
      err(lineNo, raw, 'Missing namespace, please define namespace at the first', 'namespace');
      return;
    }
    if (!id) {
      err(lineNo, raw, `Missing identifier within parentheses for type '${typeName}'`, `${typeName}()`);
      return;
    }
    if (definedIds.has(id)) {
      err(lineNo, raw, `Identifier '${id}' is not unique. It was already defined.`, id);
      return;
    }
    definedIds.add(id);

    if (!KEYWORD_TYPE.has(cls)) {
      err(lineNo, raw, `${cls} is illegal, please define it before current line`, cls);
      return;
    }
    if (!(typeName.startsWith('STD.') || !typeName.includes('.') || typeName.startsWith(`${namespace}.`))) {
      err(lineNo, raw, `The name space of ${typeName} does not belong to current project.`, typeName);
      return;
    }
    if (cls === 'StandardType' && !typeName.startsWith('STD.')) {
      err(lineNo, raw, 'The name of standard type must start with STD.', typeName);
      return;
    }
    const nsName = typeName.includes('.') ? typeName : `${namespace}.${typeName}`;
    if (seenTypes.has(nsName)) {
      err(lineNo, raw, `Type "${typeName}" is duplicated in the schema`, typeName);
      return;
    }
    seenTypes.add(nsName);
    types.push({ name: typeName, id, cls });
  });

  return { diags, types, namespace };
}

const SAMPLES: { name: string; src: string }[] = [
  {
    name: 'valid',
    src: `namespace Legal

Case(case): EntityType
Statute(statute): EntityType
Court(court): EntityType
Ruling(ruling): EventType
Doctrine(doctrine): ConceptType
STD.CaseNumber(caseNumber): StandardType`,
  },
  {
    name: 'missing id',
    src: `namespace Legal

Case(case): EntityType
Chunk(): EntityType
Statute(statute): EntityType`,
  },
  {
    name: 'duplicate id',
    src: `namespace Legal

Case(case): EntityType
Appeal(case): EventType
Statute(statute): EntityType`,
  },
  {
    name: 'bad type class',
    src: `namespace Legal

Case(case): EntityType
Judge(judge): PersonType
Statute(statute): EntityType`,
  },
  {
    name: 'no namespace',
    src: `Case(case): EntityType
Statute(statute): EntityType`,
  },
  {
    name: 'std prefix',
    src: `namespace Legal

CaseNumber(caseNumber): StandardType`,
  },
];

/** Renders the error the way error_msg formats it: message, source, caret row. */
function Diagnostic({ d }: { d: Diag }) {
  const pos =
    d.col !== undefined && d.term ? `, position ${d.col + 1}-${d.col + d.term.length}` : '';
  return (
    <div className="font-mono text-[11px] leading-5 mb-3 last:mb-0">
      <div className="text-amber-live">
        Line {d.line}{pos}: {d.msg}
      </div>
      <div className="text-ink-fg2 whitespace-pre">
        {'  │ '}{d.source.replace(/\t/g, '  ')}
      </div>
      {d.col !== undefined && d.term && (
        <div className="text-teal whitespace-pre">
          {'  │ '}{' '.repeat(d.col)}{'^'.repeat(d.term.length)}
        </div>
      )}
    </div>
  );
}

export default function KagSchemaDemo() {
  const [src, setSrc] = useState(SAMPLES[1].src);
  const [active, setActive] = useState(SAMPLES[1].name);
  const { diags, types, namespace } = useMemo(() => parseSchema(src), [src]);

  return (
    <DemoFrame
      title="kag · spg schema diagnostics"
      note="my upstream contribution to OpenSPG/KAG, not the framework itself"
    >
      <div className="flex flex-wrap gap-2 mb-3">
        {SAMPLES.map((s) => (
          <button
            key={s.name}
            type="button"
            onClick={() => { setSrc(s.src); setActive(s.name); }}
            className={`px-2.5 py-1 border rounded-sm font-mono text-[11px] transition-colors ${
              active === s.name
                ? 'border-teal-dim text-teal bg-teal/5'
                : 'border-ink-line text-ink-muted hover:text-ink-fg2 hover:border-ink-line2'
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-5">
          <div className="font-mono text-[10px] tracking-wide2 uppercase text-ink-muted mb-2">
            schema.spg
          </div>
          <textarea
            value={src}
            onChange={(e) => { setSrc(e.target.value); setActive(''); }}
            spellCheck={false}
            rows={12}
            className="w-full resize-y rounded-sm border border-ink-line bg-ink-bg p-3 font-mono text-[12px] leading-5 text-ink-fg2 outline-none focus:border-teal-dim"
          />
        </div>

        <div className="col-span-12 lg:col-span-7 space-y-4">
          <div>
            <div className="flex items-baseline justify-between font-mono text-[10px] tracking-wide2 uppercase text-ink-muted mb-2">
              <span>parser output</span>
              <span className={diags.length ? 'text-amber-live' : 'text-teal'}>
                {diags.length ? `${diags.length} error${diags.length > 1 ? 's' : ''}` : 'ok'}
              </span>
            </div>
            <div className="min-h-[7rem] max-h-64 overflow-auto rounded-sm border border-ink-line bg-ink-bg p-3">
              {diags.length ? (
                <>
                  {diags.map((d, i) => <Diagnostic key={i} d={d} />)}
                  <div className="font-mono text-[10px] text-ink-muted mt-1">
                    (Please refer to https://spg.openkg.cn/tutorial/schema/dsl for details)
                  </div>
                </>
              ) : (
                <div className="font-mono text-[11px] text-ink-fg2">
                  <div className="text-ink-muted">namespace {namespace ?? '(none)'}</div>
                  {types.map((t) => (
                    <div key={t.name}>
                      <span className="text-teal">{t.name}</span>
                      <span className="text-ink-muted">({t.id})</span>: {t.cls}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-sm border border-ink-line p-3">
            <div className="font-mono text-[10px] tracking-wide2 uppercase text-ink-muted mb-1.5">
              before this change
            </div>
            <div className="font-mono text-[11px] text-ink-dim">
              Line# {diags[0]?.line ?? 4}: {diags[0]?.msg ?? 'schema parse failed'}
            </div>
            <p className="mt-2 text-[12px] text-ink-fg2/80 leading-relaxed">
              One line, no source context, no column. On a schema of any size that means
              re-reading the file to find which token the parser meant. The missing- and
              duplicate-identifier cases did not even report here: they slipped through and
              failed later with an unrelated message.
            </p>
          </div>
        </div>
      </div>
    </DemoFrame>
  );
}
