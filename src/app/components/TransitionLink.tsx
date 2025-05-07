"use client";
import Link, { LinkProps } from "next/link";
import React from "react";
import { useRouter } from "next/navigation";

interface TransitionLinkProps extends LinkProps {
  children: React.ReactNode;
  href: string;
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

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const TransitionLink: React.FC<TransitionLinkProps> = ({
  children,
  href,
  ...props
}) => {
  const router = useRouter();

  const handleTransition = async (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault();
    const body = document.querySelector("body");
    
    // Select a random color from our palette
    const randomColor = transitionColors[Math.floor(Math.random() * transitionColors.length)];
    
    // Apply the random color to the pseudo-element
    document.documentElement.style.setProperty('--transition-color', randomColor);

    body?.classList.add("page-transition");

    // Wait for half of the animation duration (slide in part)
    await sleep(300);
    router.push(href);
    // Wait for the remaining half of the animation (slide out part)
    await sleep(300);

    body?.classList.remove("page-transition");
  };

  return (
    <Link {...props} href={href} onClick={handleTransition}>
      {children}
    </Link>
  );
};