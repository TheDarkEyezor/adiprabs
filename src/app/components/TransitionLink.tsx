"use client";
import Link, { LinkProps } from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import TransitionLogo from "./TransitionLogo";

interface TransitionLinkProps extends LinkProps {
  children: React.ReactNode;
  href: string;
  className?: string; // Explicitly add className to the props
}

// Define color palette to choose from
const transitionColors = [
  '#3B82F6', // blue
  '#10B981', // green
  '#8B5CF6', // purple
  '#F59E0B', // amber
  '#6366F1', // indigo
  '#EC4899', // pink
  '#808080', // gray (original color)
];

// Define animation directions to choose from
const transitionDirections = [
  'slideInRightOutLeft',
  'slideInLeftOutRight',
  'slideInTopOutBottom',
  'slideInBottomOutTop',
  'slideInTopRightOutBottomLeft',
  'slideInBottomRightOutTopLeft', 
  'slideInTopLeftOutBottomRight',
  'slideInBottomLeftOutTopRight',
];

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const TransitionLink: React.FC<TransitionLinkProps> = ({
  children,
  href,
  className,
  ...props
}) => {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleTransition = async (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault();
    const body = document.querySelector("body");
    
    // Select a random color from our palette
    const randomColor = transitionColors[Math.floor(Math.random() * transitionColors.length)];
    
    // Select a random direction for the transition
    const randomDirection = transitionDirections[Math.floor(Math.random() * transitionDirections.length)];
    
    // Apply the random color and direction to the pseudo-element
    document.documentElement.style.setProperty('--transition-color', randomColor);
    document.documentElement.style.setProperty('--transition-animation', randomDirection);

    // Start the transition
    setIsTransitioning(true);
    body?.classList.add("page-transition");

    // Wait for half of the animation duration (slide in part) - increased by 30%
    await sleep(390);
    router.push(href);
    // Wait for the remaining half of the animation (slide out part) - increased by 30%
    await sleep(390);

    // End the transition
    body?.classList.remove("page-transition");
    setIsTransitioning(false);
  };

  return (
    <>
      <TransitionLogo isActive={isTransitioning} />
      <Link {...props} href={href} onClick={handleTransition}>
        {children}
      </Link>
    </>
  );
};