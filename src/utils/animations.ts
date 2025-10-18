import { Variants } from 'framer-motion';

// Easing functions
export const easings = {
  easeInOut: [0.43, 0.13, 0.23, 0.96] as [number, number, number, number],
  spring: { type: "spring" as const, stiffness: 300, damping: 30 },
  smooth: { duration: 0.6, ease: "easeInOut" as const },
  snappy: { duration: 0.3, ease: "easeOut" as const },
};

// Common animation variants

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const scaleWithBlur: Variants = {
  initial: { scale: 0.95, filter: "blur(10px)", opacity: 0 },
  animate: { scale: 1, filter: "blur(0px)", opacity: 1 },
  exit: { scale: 1.05, filter: "blur(10px)", opacity: 0 },
};

export const slideInFromLeft: Variants = {
  initial: { x: -100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 100, opacity: 0 },
};

export const slideInFromRight: Variants = {
  initial: { x: 100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -100, opacity: 0 },
};

export const liquidMorph: Variants = {
  initial: { 
    clipPath: "circle(0% at 50% 50%)",
    backdropFilter: "blur(0px)",
  },
  animate: { 
    clipPath: "circle(150% at 50% 50%)",
    backdropFilter: "blur(20px)",
    transition: {
      duration: 0.6,
      ease: easings.easeInOut,
    },
  },
  exit: {
    clipPath: "circle(0% at 50% 50%)",
    backdropFilter: "blur(0px)",
    transition: {
      duration: 0.4,
      ease: easings.easeInOut,
    },
  },
};

export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: easings.easeInOut,
    },
  },
};

// Page transition variants
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.95,
    filter: 'blur(10px)',
  },
  enter: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      ease: easings.easeInOut,
    },
  },
  exit: {
    opacity: 0,
    scale: 1.05,
    filter: 'blur(10px)',
    transition: {
      duration: 0.4,
      ease: easings.easeInOut,
    },
  },
};

// Hover and tap animations
export const hoverScale = {
  scale: 1.05,
  transition: { duration: 0.2 },
};

export const tapScale = {
  scale: 0.95,
  transition: { duration: 0.1 },
};

export const glowEffect = {
  boxShadow: "0 0 40px rgba(82, 183, 136, 0.6), 0 0 80px rgba(82, 183, 136, 0.4)",
  transition: { duration: 0.3 },
};
