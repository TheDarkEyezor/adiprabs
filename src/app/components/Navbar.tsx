'use client';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import TransitionLink from './utils/TransitionLink';

const navItems = [
  { href: '/', label: 'Index', num: '00' },
  { href: '/projects', label: 'Work', num: '01' },
  { href: '/resume', label: 'CV', num: '02' },
  { href: '/blog', label: 'Writing', num: '03' },
  { href: '/journey', label: 'Journey', num: '04' },
  { href: '/booklist', label: 'Reading', num: '05' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-40 transition-colors duration-200 ${
        scrolled ? 'bg-ink-bg/85 backdrop-blur-md border-b border-ink-line' : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="mx-auto w-full max-w-6xl px-6 md:px-10 h-14 flex items-center justify-between">
        <TransitionLink href="/" className="group flex items-center gap-2">
          <span className="font-mono text-mono-sm text-teal">~/</span>
          <span className="font-sans font-medium tracking-snug text-ink-fg group-hover:text-teal transition-colors">
            adi prabs
          </span>
        </TransitionLink>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const active =
              item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <TransitionLink
                key={item.href}
                href={item.href}
                className="group relative px-3 py-2 font-mono text-mono-sm"
              >
                <span className={`mr-2 ${active ? 'text-teal' : 'text-ink-muted'}`}>
                  {item.num}
                </span>
                <span
                  className={`${
                    active ? 'text-ink-fg' : 'text-ink-fg2 group-hover:text-ink-fg'
                  } transition-colors`}
                >
                  {item.label}
                </span>
                {active && (
                  <span className="absolute left-3 right-3 -bottom-px h-px bg-teal" />
                )}
              </TransitionLink>
            );
          })}
        </div>

        <div className="md:hidden">
          <TransitionLink
            href="/projects"
            className="font-mono text-mono-sm text-teal border border-ink-line px-3 py-1.5 rounded-sm hover:border-teal-dim transition-colors"
          >
            menu →
          </TransitionLink>
        </div>
      </div>
    </nav>
  );
}
