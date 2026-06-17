import React from 'react';
import { Github, Linkedin, Mail, Instagram } from 'lucide-react';
import { Container } from './ui/primitives';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-ink-line mt-24">
      <Container className="py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="font-mono text-mono-sm text-ink-muted">
            <span className="text-teal">~/</span>adi-prabs &nbsp;·&nbsp; © {year}
          </div>

          <div className="flex items-center gap-4 text-ink-fg2">
            <a
              href="https://github.com/TheDarkEyezor"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="hover:text-teal transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/adiprabs/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hover:text-teal transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="mailto:adiprabs19@gmail.com"
              aria-label="Email"
              className="hover:text-teal transition-colors"
            >
              <Mail className="w-4 h-4" />
            </a>
            <a
              href="https://www.instagram.com/adiprabs/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-teal transition-colors"
            >
              <Instagram className="w-4 h-4" />
            </a>
          </div>

          <div className="font-mono text-[11px] tracking-wide2 text-ink-muted">
            BUILT WITH NEXT.JS · TYPED · DEPLOYED ON VERCEL
          </div>
        </div>
      </Container>
    </footer>
  );
}
