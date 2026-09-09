'use client';
import React, { useMemo, useState } from 'react';
import { DemoFrame } from './DemoFrame';

/* ---------------------------------------------------------------------------
 * The WACC compiler's front end, ported to the browser.
 *
 * Keyword and operator sets are lifted from front_end/lexer.scala; the
 * precedence ladder and AST node names from front_end/ops.scala and
 * front_end/syntax.scala. Parsley's combinators become a Pratt parser here,
 * but the grammar it accepts and the tree it produces are the same shape.
 *
 * This is lex + parse only. The real compiler carries on through renaming,
 * semantic analysis and LLVM codegen, none of which runs here.
 * ------------------------------------------------------------------------- */

// lexer.scala: hardKeywords
const KEYWORDS = new Set([
  'read', 'exit', 'begin', 'end', 'if', 'then', 'else', 'fi', 'skip', 'true', 'false',
  'free', 'while', 'do', 'done', 'fst', 'snd', 'newpair', 'print', 'println', 'call',
  'int', 'bool', 'char', 'null', 'string', 'pair', 'return', 'len', 'ord', 'chr',
]);

// lexer.scala: hardOperators, longest-match first
const OPERATORS = ['>=', '<=', '==', '!=', '&&', '||', '*', '/', '%', '+', '-', '>', '<', '!'];
const PUNCT = ['[', ']', '(', ')', ',', ';', '='];

type Tok = { kind: 'keyword' | 'ident' | 'int' | 'string' | 'char' | 'op' | 'punct'; text: string; pos: number };

const isLetter = (c: string) => /[A-Za-z_]/.test(c);       // lexer.scala isEnglishLetter
const isLetterOrDigit = (c: string) => /[A-Za-z_0-9]/.test(c);

function tokenize(src: string): { tokens: Tok[]; error?: string } {
  const toks: Tok[] = [];
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (/\s/.test(c)) { i++; continue; }
    if (c === '#') { while (i < src.length && src[i] !== '\n') i++; continue; }  // lineCommentStart

    if (isLetter(c)) {
      const start = i;
      while (i < src.length && isLetterOrDigit(src[i])) i++;
      const text = src.slice(start, i);
      toks.push({ kind: KEYWORDS.has(text) ? 'keyword' : 'ident', text, pos: start });
      continue;
    }
    if (/[0-9]/.test(c)) {
      const start = i;
      while (i < src.length && /[0-9]/.test(src[i])) i++;
      toks.push({ kind: 'int', text: src.slice(start, i), pos: start });
      continue;
    }
    if (c === '"' || c === "'") {
      const quote = c;
      const start = i;
      i++;
      while (i < src.length && src[i] !== quote) {
        if (src[i] === '\\') i++;   // escapeSequences
        i++;
      }
      if (i >= src.length) return { tokens: toks, error: `unterminated ${quote === '"' ? 'string' : 'char'} literal` };
      i++;
      toks.push({ kind: quote === '"' ? 'string' : 'char', text: src.slice(start, i), pos: start });
      continue;
    }
    const op = OPERATORS.find((o) => src.startsWith(o, i));
    if (op) { toks.push({ kind: 'op', text: op, pos: i }); i += op.length; continue; }
    if (PUNCT.includes(c)) { toks.push({ kind: 'punct', text: c, pos: i }); i++; continue; }
    return { tokens: toks, error: `unexpected character '${c}'` };
  }
  return { tokens: toks };
}

type Node = { node: string; text?: string; kids?: Node[] };

class Parser {
  private i = 0;
  constructor(private t: Tok[]) {}

  private peek(k = 0) { return this.t[this.i + k]; }
  private at(text: string) { return this.peek()?.text === text; }
  private eat(text: string) {
    if (!this.at(text)) {
      const got = this.peek() ? `'${this.peek().text}'` : 'end of input';
      throw new Error(`expected '${text}', got ${got}`);
    }
    return this.t[this.i++];
  }
  private next() {
    const t = this.t[this.i++];
    if (!t) throw new Error('unexpected end of input');
    return t;
  }

  // Prog(funcs, main) -- syntax.scala
  parseProg(): Node {
    this.eat('begin');
    const funcs: Node[] = [];
    while (this.looksLikeFunc()) funcs.push(this.parseFunc());
    const main = this.parseStmts();
    this.eat('end');
    if (this.peek()) throw new Error(`trailing input after 'end': '${this.peek()!.text}'`);
    const kids: Node[] = [];
    if (funcs.length) kids.push({ node: 'funcs', kids: funcs });
    kids.push({ node: 'main', kids: main });
    return { node: 'Prog', kids };
  }

  // A function starts <type> <ident> '(' -- the only place that shape appears.
  private looksLikeFunc(): boolean {
    const save = this.i;
    try {
      this.parseType();
      if (this.peek()?.kind !== 'ident') return false;
      this.i++;
      return this.at('(');
    } catch { return false; } finally { this.i = save; }
  }

  private parseFunc(): Node {
    const t = this.parseType();
    const name = this.next().text;
    this.eat('(');
    const params: Node[] = [];
    if (!this.at(')')) {
      do {
        const pt = this.parseType();
        const pn = this.next().text;
        params.push({ node: 'Param', text: pn, kids: [pt] });
      } while (this.at(',') && this.eat(','));
    }
    this.eat(')');
    this.eat('is');
    const body = this.parseStmts();
    this.eat('end');
    return {
      node: 'Func',
      text: name,
      kids: [t, { node: 'params', kids: params }, { node: 'body', kids: body }],
    };
  }

  // Types: base, array suffixes, pair(t1, t2) -- syntax.scala
  private parseType(): Node {
    let base: Node;
    const t = this.peek();
    if (!t) throw new Error('expected a type');
    if (['int', 'bool', 'char', 'string'].includes(t.text)) {
      this.i++;
      base = { node: `${t.text[0].toUpperCase()}${t.text.slice(1)}Type` };
    } else if (t.text === 'pair') {
      this.i++;
      if (this.at('(')) {
        this.eat('(');
        const a = this.parseType();
        this.eat(',');
        const b = this.parseType();
        this.eat(')');
        base = { node: 'PairType', kids: [a, b] };
      } else base = { node: 'Pair' };
    } else throw new Error(`expected a type, got '${t.text}'`);

    let dims = 0;
    while (this.at('[') && this.peek(1)?.text === ']') { this.eat('['); this.eat(']'); dims++; }
    return dims ? { node: `ArrayType(${dims})`, kids: [base] } : base;
  }

  private parseStmts(): Node[] {
    const out = [this.parseStmt()];
    while (this.at(';')) { this.eat(';'); out.push(this.parseStmt()); }
    return out;
  }

  private parseStmt(): Node {
    const t = this.peek();
    if (!t) throw new Error('expected a statement');

    if (t.text === 'skip') { this.i++; return { node: 'Skip' }; }

    for (const [kw, node] of [['free', 'Free'], ['return', 'Return'], ['exit', 'Exit'],
                              ['print', 'Print'], ['println', 'Println']] as const) {
      if (t.text === kw) { this.i++; return { node, kids: [this.parseExpr()] }; }
    }
    if (t.text === 'read') { this.i++; return { node: 'Read', kids: [this.parseLValue()] }; }

    if (t.text === 'if') {
      this.i++;
      const cond = this.parseExpr();
      this.eat('then');
      const thenS = this.parseStmts();
      this.eat('else');
      const elseS = this.parseStmts();
      this.eat('fi');
      return { node: 'IfElse', kids: [cond, { node: 'then', kids: thenS }, { node: 'else', kids: elseS }] };
    }
    if (t.text === 'while') {
      this.i++;
      const cond = this.parseExpr();
      this.eat('do');
      const body = this.parseStmts();
      this.eat('done');
      return { node: 'WhileDo', kids: [cond, { node: 'do', kids: body }] };
    }
    if (t.text === 'begin') {
      this.i++;
      const body = this.parseStmts();
      this.eat('end');
      return { node: 'Scope', kids: body };
    }

    // Assgn(t, ident, rvalue) when it starts with a type, else ReAssgn.
    if (['int', 'bool', 'char', 'string', 'pair'].includes(t.text)) {
      const ty = this.parseType();
      const name = this.next().text;
      this.eat('=');
      return { node: 'Assgn', text: name, kids: [ty, this.parseRValue()] };
    }
    const lv = this.parseLValue();
    this.eat('=');
    return { node: 'ReAssgn', kids: [lv, this.parseRValue()] };
  }

  private parseLValue(): Node {
    const t = this.peek();
    if (!t) throw new Error('expected an assignment target');
    if (t.text === 'fst' || t.text === 'snd') {
      this.i++;
      return { node: t.text === 'fst' ? 'Fst' : 'Snd', kids: [this.parseLValue()] };
    }
    if (t.kind !== 'ident') throw new Error(`expected an identifier, got '${t.text}'`);
    this.i++;
    return this.arraySuffix({ node: 'Ident', text: t.text });
  }

  private arraySuffix(base: Node): Node {
    const idx: Node[] = [];
    while (this.at('[')) { this.eat('['); idx.push(this.parseExpr()); this.eat(']'); }
    return idx.length ? { node: 'ArrayElem', text: base.text, kids: idx } : base;
  }

  private parseRValue(): Node {
    const t = this.peek();
    if (!t) throw new Error('expected a value');
    if (t.text === 'newpair') {
      this.i++; this.eat('(');
      const a = this.parseExpr(); this.eat(',');
      const b = this.parseExpr(); this.eat(')');
      return { node: 'NewPair', kids: [a, b] };
    }
    if (t.text === 'call') {
      this.i++;
      const name = this.next().text;
      this.eat('(');
      const args: Node[] = [];
      if (!this.at(')')) { do { args.push(this.parseExpr()); } while (this.at(',') && this.eat(',')); }
      this.eat(')');
      return { node: 'Call', text: name, kids: args };
    }
    if (t.text === 'fst' || t.text === 'snd') return this.parseLValue();
    if (t.text === '[') {
      this.eat('[');
      const elems: Node[] = [];
      if (!this.at(']')) { do { elems.push(this.parseExpr()); } while (this.at(',') && this.eat(',')); }
      this.eat(']');
      return { node: 'ArrayLiter', kids: elems };
    }
    return this.parseExpr();
  }

  /* ops.scala precedence, loosest first:
   *   orOp (InfixR) < andOp (InfixR) < equalOps (InfixL) < comparisonOps (InfixN)
   *   < addSubOps (InfixL) < mulDivModOps (InfixL) < unaryOps (Prefix)          */
  parseExpr(): Node { return this.parseOr(); }

  private parseOr(): Node {
    const l = this.parseAnd();
    if (this.at('||')) { this.eat('||'); return { node: 'Or', kids: [l, this.parseOr()] }; } // right assoc
    return l;
  }
  private parseAnd(): Node {
    const l = this.parseEquality();
    if (this.at('&&')) { this.eat('&&'); return { node: 'And', kids: [l, this.parseAnd()] }; }
    return l;
  }
  private parseEquality(): Node {
    let l = this.parseComparison();
    while (this.at('==') || this.at('!=')) {
      const op = this.next().text;
      l = { node: op === '==' ? 'Eq' : 'NotEq', kids: [l, this.parseComparison()] };
    }
    return l;
  }
  private parseComparison(): Node {
    const l = this.parseAddSub();
    const names: Record<string, string> = { '<': 'Less', '<=': 'LessE', '>': 'Greater', '>=': 'GreaterE' };
    const t = this.peek();
    if (t && names[t.text]) {
      this.i++;
      // InfixN: non-associative, so exactly one comparison here.
      return { node: names[t.text], kids: [l, this.parseAddSub()] };
    }
    return l;
  }
  private parseAddSub(): Node {
    let l = this.parseMulDiv();
    while (this.at('+') || this.at('-')) {
      const op = this.next().text;
      l = { node: op === '+' ? 'Add' : 'Sub', kids: [l, this.parseMulDiv()] };
    }
    return l;
  }
  private parseMulDiv(): Node {
    let l = this.parseUnary();
    const names: Record<string, string> = { '*': 'Mul', '/': 'Div', '%': 'Mod' };
    while (this.peek() && names[this.peek()!.text]) {
      const op = this.next().text;
      l = { node: names[op], kids: [l, this.parseUnary()] };
    }
    return l;
  }
  private parseUnary(): Node {
    const t = this.peek();
    if (!t) throw new Error('expected an expression');
    const names: Record<string, string> = { '!': 'Not', '-': 'Neg', len: 'Len', ord: 'Ord', chr: 'Chr' };
    if (names[t.text]) {
      // ops.scala: '-' immediately before an int literal is part of the literal.
      if (t.text === '-' && this.peek(1)?.kind === 'int') {
        this.i += 2;
        return { node: 'IntLiteral', text: `-${this.t[this.i - 1].text}` };
      }
      this.i++;
      return { node: names[t.text], kids: [this.parseUnary()] };
    }
    return this.parseAtom();
  }
  private parseAtom(): Node {
    const t = this.next();
    if (t.kind === 'int') return { node: 'IntLiteral', text: t.text };
    if (t.kind === 'string') return { node: 'StringLiteral', text: t.text };
    if (t.kind === 'char') return { node: 'CharLiteral', text: t.text };
    if (t.text === 'true' || t.text === 'false') return { node: 'BoolLiteral', text: t.text };
    if (t.text === 'null') return { node: 'NullLiteral' };
    if (t.text === '(') { const e = this.parseExpr(); this.eat(')'); return e; }
    if (t.kind === 'ident') return this.arraySuffix({ node: 'Ident', text: t.text });
    throw new Error(`unexpected '${t.text}' in expression`);
  }
}

const SAMPLES: { name: string; src: string }[] = [
  {
    name: 'if1',
    src: `# Simple conditional statement with int comparison test
begin
  int a = 13;
  if a == 13
  then
    println "correct"
  else
    println "incorrect"
  fi
end`,
  },
  {
    name: 'fibonacciFullIt',
    src: `begin
  int n = 0;
  read n ;
  int f0 = 0 ;
  int f1 = 1 ;
  int save = 0;
  while n > 0 do
    save = f0 ;
    f0 = f1 ;
    f1 = save + f1 ;
    n = n - 1
  done ;
  println f0
end`,
  },
  {
    name: 'functionSimple',
    src: `begin
  int f() is
    return 0
  end
  int x = call f() ;
  println x
end`,
  },
  {
    name: 'precedence',
    src: `begin
  int x = 2 + 3 * 4 - 1 ;
  bool b = x > 10 && x != 13 || false ;
  println b
end`,
  },
  {
    name: 'arrayLength',
    src: `begin
  int[] a = [43, 2, 18, 1] ;
  println len a
end`,
  },
  {
    name: 'syntaxErr',
    src: `begin
  int x = 5 ;
  if x == 5
  then
    println "missing the fi"
end`,
  },
];

function Tree({ n, depth = 0, last = true, prefix = '' }: { n: Node; depth?: number; last?: boolean; prefix?: string }) {
  const kids = n.kids ?? [];
  const branch = depth === 0 ? '' : last ? '└─ ' : '├─ ';
  return (
    <>
      <div className="whitespace-pre font-mono text-[11px] leading-5">
        <span className="text-ink-muted">{prefix}{branch}</span>
        <span className="text-teal">{n.node}</span>
        {n.text !== undefined && <span className="text-ink-fg2"> {n.text}</span>}
      </div>
      {kids.map((k, i) => (
        <Tree
          key={i}
          n={k}
          depth={depth + 1}
          last={i === kids.length - 1}
          prefix={depth === 0 ? '' : prefix + (last ? '   ' : '│  ')}
        />
      ))}
    </>
  );
}

const TOK_COLOR: Record<Tok['kind'], string> = {
  keyword: 'text-teal',
  ident: 'text-ink-fg',
  int: 'text-amber-live',
  string: 'text-amber-live',
  char: 'text-amber-live',
  op: 'text-ink-fg2',
  punct: 'text-ink-muted',
};

export default function WaccDemo() {
  const [src, setSrc] = useState(SAMPLES[0].src);
  const [active, setActive] = useState(SAMPLES[0].name);

  const result = useMemo(() => {
    const { tokens, error } = tokenize(src);
    if (error) return { tokens, error, ast: null };
    try {
      return { tokens, error: undefined, ast: new Parser(tokens).parseProg() };
    } catch (e) {
      return { tokens, error: e instanceof Error ? e.message : String(e), ast: null };
    }
  }, [src]);

  const count = (n: Node | null): number => (n ? 1 + (n.kids ?? []).reduce((s, k) => s + count(k), 0) : 0);

  return (
    <DemoFrame title="wacc · front end" note="lex + parse only, no codegen">
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
          <div className="font-mono text-[10px] tracking-wide2 uppercase text-ink-muted mb-2">source</div>
          <textarea
            value={src}
            onChange={(e) => { setSrc(e.target.value); setActive(''); }}
            spellCheck={false}
            rows={16}
            className="w-full resize-y rounded-sm border border-ink-line bg-ink-bg p-3 font-mono text-[12px] leading-5 text-ink-fg2 outline-none focus:border-teal-dim"
          />
        </div>

        <div className="col-span-12 lg:col-span-7 space-y-4">
          <div>
            <div className="flex items-baseline justify-between font-mono text-[10px] tracking-wide2 uppercase text-ink-muted mb-2">
              <span>tokens</span>
              <span>{result.tokens.length}</span>
            </div>
            <div className="max-h-28 overflow-y-auto rounded-sm border border-ink-line bg-ink-bg p-2 flex flex-wrap gap-1">
              {result.tokens.map((t, i) => (
                <span
                  key={i}
                  title={t.kind}
                  className={`font-mono text-[11px] px-1 rounded-sm bg-ink-surface/70 ${TOK_COLOR[t.kind]}`}
                >
                  {t.text}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-baseline justify-between font-mono text-[10px] tracking-wide2 uppercase text-ink-muted mb-2">
              <span>abstract syntax tree</span>
              {result.ast && <span>{count(result.ast)} nodes</span>}
            </div>
            <div className="max-h-72 overflow-auto rounded-sm border border-ink-line bg-ink-bg p-3">
              {result.error ? (
                <p className="font-mono text-[11px] text-amber-live">
                  syntax error: {result.error}
                </p>
              ) : (
                result.ast && <Tree n={result.ast} />
              )}
            </div>
          </div>
        </div>
      </div>

      <p className="mt-4 text-[13px] text-ink-fg2/80 leading-relaxed">
        Keywords and operators come from <span className="font-mono text-[12px]">front_end/lexer.scala</span>,
        the precedence ladder from <span className="font-mono text-[12px]">ops.scala</span>, and the node names
        from <span className="font-mono text-[12px]">syntax.scala</span>. Parsley&apos;s combinators become a Pratt
        parser here, so the tree shape matches but the implementation does not. Edit the source and the tree
        re-parses as you type.
      </p>
    </DemoFrame>
  );
}
