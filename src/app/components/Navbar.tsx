'use client';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import TransitionLink from './utils/TransitionLink';

const navItems = [
  { href: '/',          label: 'Index',   num: '00' },
  { href: '/projects',  label: 'Work',    num: '01' },
  { href: '/resume',    label: 'CV',      num: '02' },
  { href: '/blog',      label: 'Writing', num: '03' },
  { href: '/journey',   label: 'Journey', num: '04' },
  { href: '/booklist',  label: 'Reading', num: '05' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu whenever the route changes
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <nav
      className={`sticky top-0 z-40 transition-colors duration-200 ${
        scrolled
          ? 'bg-ink-bg/85 backdrop-blur-md border-b border-ink-line'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="mx-auto w-full max-w-6xl px-6 md:px-10 h-14 flex items-center justify-between relative">

        {/* Logo */}
        <TransitionLink href="/" className="group flex items-center gap-2">
          <span className="font-mono text-mono-sm text-teal">~/</span>
          <span className="font-sans font-medium tracking-snug text-ink-fg group-hover:text-teal transition-colors">
            adi prabs
          </span>
        </TransitionLink>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <TransitionLink
                key={item.href}
                href={item.href}
                className="group relative px-3 py-2 font-mono text-mono-sm"
              >
                <span className={`mr-2 ${active ? 'text-teal' : 'text-ink-muted'}`}>
                  {item.num}
                </span>
                <span className={`${active ? 'text-ink-fg' : 'text-ink-fg2 group-hover:text-ink-fg'} transition-colors`}>
                  {item.label}
                </span>
                {active && (
                  <span className="absolute left-3 right-3 -bottom-px h-px bg-teal" />
                )}
              </TransitionLink>
            );
          })}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden font-mono text-mono-sm text-teal border border-ink-line px-3 py-1.5 rounded-sm hover:border-teal-dim transition-colors"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          {menuOpen ? 'close ×' : 'menu →'}
        </button>
      </div>

      {/* Mobile slide-down menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden absolute left-0 right-0 bg-ink-bg/95 backdrop-blur-md border-b border-ink-line z-50"
          >
            <div className="mx-auto w-full max-w-6xl px-6">
              {navItems.map((item, i) => {
                const active = isActive(item.href);
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <TransitionLink
                      href={item.href}
                      className="flex items-center gap-4 py-3.5 border-b border-ink-line last:border-b-0"
                      onClick={() => setMenuOpen(false)}
                    >
                      <span className={`font-mono text-mono-sm ${active ? 'text-teal' : 'text-ink-muted'}`}>
                        {item.num}
                      </span>
                      <span className={`text-lg tracking-snug ${active ? 'text-ink-fg' : 'text-ink-fg2'}`}>
                        {item.label}
                      </span>
                      {active && (
                        <span className="ml-auto font-mono text-mono-sm text-teal">←</span>
                      )}
                    </TransitionLink>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
