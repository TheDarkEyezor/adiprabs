import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        // Engineer/system palette — deep petrol + teal
        ink: {
          bg: '#08100F',          // page bg, deep petrol/near-black
          surface: '#0E1A18',     // raised surfaces / cards
          surface2: '#142523',    // hover / secondary surface
          line: '#1B2D2A',        // hairline borders
          line2: '#27403C',       // emphasized borders
          fg: '#E8E6E1',          // primary text, warm off-white
          fg2: '#B6BDB9',         // secondary text
          muted: '#7C8B86',       // tertiary / metadata
          dim: '#4F5C58',         // disabled / very dim
        },
        teal: {
          DEFAULT: '#5EEAD4',     // signal accent (sparingly)
          dim: '#14B8A6',         // links, hover
          deep: '#0D9488',
          glow: '#5EEAD4',
        },
        amber: {
          live: '#F4A261',        // "live" / now indicator
        },
      },
      letterSpacing: {
        tightest: '-0.04em',
        snug: '-0.02em',
        wide2: '0.16em',
      },
      fontSize: {
        // Editorial scale
        'micro': ['11px', { lineHeight: '14px', letterSpacing: '0.16em' }],
        'mono-sm': ['12px', { lineHeight: '18px' }],
      },
      maxWidth: {
        'reading': '68ch',
      },
      animation: {
        'cursor-blink': 'cursor-blink 1.1s steps(2) infinite',
        'fade-in': 'fade-in 0.4s ease-out both',
        'rise': 'rise 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        'shimmer-line': 'shimmer-line 2.4s ease-in-out infinite',
        'marquee': 'marquee 40s linear infinite',
      },
      keyframes: {
        'cursor-blink': {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        rise: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'shimmer-line': {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '1' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      backgroundImage: {
        'grid-fade': 'radial-gradient(ellipse at center, rgba(94,234,212,0.06) 0%, transparent 70%)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
};
export default config;
