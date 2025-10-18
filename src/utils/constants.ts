// Design System Constants

// Color Palette
export const COLORS = {
  // Primary Colors
  primary: {
    red: '#FF6B6B',
    gold: '#FEC601',
    green: '#52B788',
    blue: '#4A90E2',
    purple: '#8B5CF6',
  },
  // Accent Colors
  accent: {
    electricBlue: '#00F5FF',
    neonPink: '#FF10F0',
    cyberGreen: '#39FF14',
  },
  // Base Colors
  base: {
    deepNavy: '#0A192F',
    softWhite: '#F8F9FA',
  },
} as const;

// Typography Scale
export const TYPOGRAPHY = {
  hero: 'text-7xl md:text-8xl lg:text-9xl',
  h1: 'text-5xl md:text-6xl lg:text-7xl',
  h2: 'text-4xl md:text-5xl lg:text-6xl',
  h3: 'text-2xl md:text-3xl lg:text-4xl',
  body: 'text-base md:text-lg',
  small: 'text-sm',
} as const;

// Spacing Scale
export const SPACING = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
} as const;

// Animation Durations (in milliseconds)
export const DURATIONS = {
  micro: 150,
  fast: 300,
  normal: 600,
  slow: 1000,
  verySlow: 1200,
} as const;

// Breakpoints
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// Gradient Definitions
export const GRADIENTS = {
  primary: 'bg-gradient-to-r from-red-500 via-yellow-500 to-green-500',
  accent: 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500',
  hero: 'bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900',
  glass: 'bg-gradient-to-br from-white/10 to-white/5',
} as const;

// Z-Index Layers
export const Z_INDEX = {
  background: 0,
  content: 10,
  navbar: 50,
  modal: 100,
  transition: 200,
  tooltip: 300,
} as const;
