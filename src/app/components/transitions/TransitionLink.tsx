'use client';
import Link, { LinkProps } from 'next/link';
import React from 'react';
import { useRouter } from 'next/navigation';

interface TransitionLinkProps extends LinkProps {
  children: React.ReactNode;
  href: string;
  className?: string;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Color palette from your design system
const colors = [
  '#FF6B6B', // Red
  '#FEC601', // Gold
  '#52B788', // Green
  '#4A90E2', // Blue
  '#8B5CF6', // Purple
  '#00F5FF', // Cyan
];

// Animation directions
const animations = [
  'slideInRightOutLeft',
  'slideInLeftOutRight',
  'slideInTopOutBottom',
  'slideInBottomOutTop',
  'slideInTopRightOutBottomLeft',
  'slideInBottomRightOutTopLeft',
  'slideInTopLeftOutBottomRight',
  'slideInBottomLeftOutTopRight',
];

export const TransitionLink: React.FC<TransitionLinkProps> = ({
  children,
  href,
  className,
  ...props
}) => {
  const router = useRouter();

  const handleTransition = async (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault();
    
    // Random color and animation
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
    
    // Set CSS variables
    document.documentElement.style.setProperty('--transition-color', randomColor);
    document.documentElement.style.setProperty('--transition-animation', randomAnimation);
    
    const body = document.querySelector('body');
    body?.classList.add('page-transition');

    // Navigate at 50% of the animation (300ms into 600ms animation)
    await sleep(300);
    router.push(href);
    
    // Wait for the rest of the animation to complete
    await sleep(300);
    body?.classList.remove('page-transition');
  };

  return (
    <Link 
      {...props} 
      href={href} 
      onClick={handleTransition}
      className={className}
    >
      {children}
    </Link>
  );
};
