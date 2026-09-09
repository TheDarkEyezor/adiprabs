import React from 'react';
import type { Metadata } from 'next';
import { profile, roles } from '@/data/profile';
import { education, skills, languages, cvProjects } from '@/data/cv';

export const metadata: Metadata = {
  title: 'Aditya Prabakaran · CV',
  robots: { index: false, follow: false },
};

/* ---------------------------------------------------------------------------
 * Print source for public/AdiPrabs_SWE.pdf.
 *
 * Everything comes from src/data/profile.ts and src/data/cv.ts, so the PDF and
 * the site cannot drift apart. Regenerate with scripts/build-cv.mjs, or just
 * open /cv-print and print to PDF from the browser.
 * ------------------------------------------------------------------------- */

/** `**bold**` becomes bold. Same convention the site's withMetrics uses. */
function md(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i}>{part.slice(2, -2)}</strong>
      : <React.Fragment key={i}>{part}</React.Fragment>,
  );
}

export default function CvPrint() {
  return (
    <main className="cv">
      <header>
        <h1>{profile.fullName}</h1>
        <p className="contact">
          {profile.location} · {profile.emailPersonal} ·{' '}
          <a href={profile.linkedinUrl}>linkedin.com/in/adiprabs</a> ·{' '}
          <a href={profile.githubUrl}>github.com/{profile.github}</a> ·{' '}
          <a href="https://adiprabs.vercel.app">adiprabs.vercel.app</a>
        </p>
        <p className="summary">
          Computing student at Imperial College London, currently Site Reliability
          Engineer on Apple&rsquo;s ML Platforms team, with three years of
          production experience across five startups. Happiest at the seam between
          research and production: compilers, infrastructure, agents, and the
          unglamorous work of keeping them running.
        </p>
      </header>

      <section>
        <h2>Education</h2>
        <div className="entry">
          <div className="entry-head">
            <span className="lhs"><strong>{education.institution}</strong>, {education.degree}</span>
            <span className="rhs">{education.period}</span>
          </div>
          <ul>{education.notes.map((n) => <li key={n}>{n}</li>)}</ul>
        </div>
      </section>

      <section>
        <h2>Experience</h2>
        {roles.map((r) => (
          <div className="entry" key={`${r.company}-${r.period}`}>
            <div className="entry-head">
              <span className="lhs"><strong>{r.company}</strong>, {r.role}</span>
              <span className="rhs">{r.period}</span>
            </div>
            <ul>{r.bullets.map((b) => <li key={b}>{md(b)}</li>)}</ul>
            <p className="tech">{r.tech.join(' · ')}</p>
          </div>
        ))}
      </section>

      <section>
        <h2>Selected Projects</h2>
        <ul className="projects">
          {cvProjects.map((p) => (
            <li key={p.title}>
              <strong>{p.title}</strong> ({p.tech}): {p.blurb}
            </li>
          ))}
        </ul>
      </section>

      <section className="two-up">
        <div>
          <h2>Skills</h2>
          {Object.entries(skills).map(([group, items]) => (
            <p className="skill-row" key={group}>
              <strong>{group}:</strong> {items.join(', ')}
            </p>
          ))}
        </div>
        <div>
          <h2>Languages</h2>
          {languages.map((l) => (
            <p className="skill-row" key={l.lang}><strong>{l.lang}:</strong> {l.level}</p>
          ))}
        </div>
      </section>
    </main>
  );
}
