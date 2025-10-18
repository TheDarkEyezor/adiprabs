// Page-specific transition configurations

export type TransitionType = 'fade' | 'slide' | 'liquid' | 'spiral' | 'zoom';

export interface TransitionConfig {
  type: TransitionType;
  duration: number;
  color?: string;
}

export const routeTransitions: Record<string, Record<string, TransitionConfig>> = {
  '/': {
    '/projects': {
      type: 'liquid',
      duration: 600,
      color: '#4A90E2', // Blue
    },
    '/experience': {
      type: 'slide',
      duration: 500,
      color: '#FF6B6B', // Red
    },
    '/journey': {
      type: 'spiral',
      duration: 700,
      color: '#FEC601', // Gold
    },
    '/resume': {
      type: 'zoom',
      duration: 600,
      color: '#8B5CF6', // Purple
    },
  },
  '/projects': {
    '/': {
      type: 'liquid',
      duration: 500,
      color: '#4A90E2',
    },
  },
  '/experience': {
    '/': {
      type: 'slide',
      duration: 500,
      color: '#FF6B6B',
    },
  },
  '/journey': {
    '/': {
      type: 'spiral',
      duration: 600,
      color: '#FEC601',
    },
  },
  '/resume': {
    '/': {
      type: 'zoom',
      duration: 500,
      color: '#8B5CF6',
    },
  },
};

export function getTransitionConfig(from: string, to: string): TransitionConfig {
  // Default transition
  const defaultTransition: TransitionConfig = {
    type: 'fade',
    duration: 500,
  };

  if (routeTransitions[from] && routeTransitions[from][to]) {
    return routeTransitions[from][to];
  }

  return defaultTransition;
}
