'use client';
import React from 'react';
import Link, { type LinkProps } from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { emitPhase, sleep, NAVIGATE_AT, EXIT_TOTAL } from '@/utils/pageTransition';

interface Props extends LinkProps {
  children: React.ReactNode;
  href: string;
  className?: string;
}

export default function TransitionLink({ children, href, className, ...rest }: Props) {
  const router   = useRouter();
  const pathname = usePathname();

  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (href === pathname) return; // already here — do nothing

    e.preventDefault();

    // 1. Tiles sweep in to cover current page
    emitPhase('in');
    await sleep(NAVIGATE_AT * 1000);

    // 2. Navigate — new page renders safely behind tiles
    router.push(href);
    await sleep(60);

    // 3. Tiles sweep out to reveal new page
    emitPhase('out');
    await sleep(EXIT_TOTAL * 1000);

    emitPhase('idle');
  };

  return (
    <Link href={href} onClick={handleClick} className={className} {...rest}>
      {children}
    </Link>
  );
}
