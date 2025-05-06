'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';

const TransitionProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);

    // Reduce timeout duration to match faster animations (e.g., 300ms)
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 300); // Adjust to match or slightly exceed content animation duration

    return () => clearTimeout(timer);
  }, [pathname]);

  const defaultExit = { opacity: 0, y: -15 }; // Slightly reduce exit distance
  const resumeExit = { opacity: 0, y: -30 }; // Slightly reduce exit distance

  // Overlay Variants with faster transition
  const overlayVariants = {
    // Reduce duration to 0.2s
    hidden: { opacity: 0, transition: { duration: 0.2, ease: 'easeInOut' } },
    visible: { opacity: 1, transition: { duration: 0.2, ease: 'easeInOut' } },
  };

  return (
    <>
      {/* Overlay Div */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            key="transition-overlay"
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: '#33658A',
              zIndex: 9999,
              pointerEvents: 'none',
            }}
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          />
        )}
      </AnimatePresence>

      {/* Page Content Div */}
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 15 }} // Slightly reduce initial distance
          animate={{ opacity: 1, y: 0 }}
          exit={pathname === '/resume' ? resumeExit : defaultExit}
          // Reduce duration to 0.2s
          transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default TransitionProvider;
