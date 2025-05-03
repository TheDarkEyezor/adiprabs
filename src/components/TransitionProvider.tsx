'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import React from 'react';

const TransitionProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  // Define different exit animations
  const defaultExit = { opacity: 0, y: -20 }; // Default exit: fade out, slight slide up
  const resumeExit = { opacity: 0, y: -50 }; // Exit from /resume: fade out, more pronounced slide up

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 20 }} // Start slightly down and faded out
        animate={{ opacity: 1, y: 0 }}   // Fade in and slide up
        // Apply specific exit animation when leaving the /resume page
        exit={pathname === '/resume' ? resumeExit : defaultExit}
        // Default transition for initial/animate. Can be overridden in exit.
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default TransitionProvider;
