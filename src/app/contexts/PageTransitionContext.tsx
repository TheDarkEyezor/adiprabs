'use client';

import React, { createContext, useContext, useState } from 'react';

export enum TransitionFlow {
  FADE_IN = 'fade-in',
  FADE_OUT = 'fade-out',
  SLIDE_UP = 'slide-up',
  SLIDE_DOWN = 'slide-down',
}

interface TransitionContextType {
  flow: TransitionFlow;
  setFlow: (flow: TransitionFlow) => void;
  isAnimating: boolean;
  setIsAnimating: (value: boolean) => void;
}

const PageTransitionContext = createContext<TransitionContextType | undefined>(undefined);

export const PageTransitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [flow, setFlow] = useState<TransitionFlow>(TransitionFlow.FADE_IN);
  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <PageTransitionContext.Provider
      value={{ flow, setFlow, isAnimating, setIsAnimating }}
    >
      <div className={flow}>{children}</div>
    </PageTransitionContext.Provider>
  );
};

export const usePageTransition = () => {
  const context = useContext(PageTransitionContext);
  if (!context) {
    throw new Error('usePageTransition must be used within PageTransitionProvider');
  }

  const { setFlow, setIsAnimating } = context;

  const hide = (flow: TransitionFlow = TransitionFlow.FADE_OUT) => {
    return new Promise<void>((resolve) => {
      setIsAnimating(true);
      setFlow(flow);
      setTimeout(() => {
        resolve();
      }, 300); // Match animation duration
    });
  };

  const show = (flow: TransitionFlow = TransitionFlow.FADE_IN) => {
    return new Promise<void>((resolve) => {
      setFlow(flow);
      setTimeout(() => {
        setIsAnimating(false);
        resolve();
      }, 300); // Match animation duration
    });
  };

  return { hide, show };
};
