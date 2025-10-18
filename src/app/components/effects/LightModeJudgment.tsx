'use client';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, X } from 'lucide-react';

const LightModeJudgment: React.FC = () => {
  const [showJudgment, setShowJudgment] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    const checkLightMode = () => {
      const isLight = document.documentElement.classList.contains('light');
      
      // Only show once per session when switching to light mode
      if (isLight && !hasShown) {
        setShowJudgment(true);
        setHasShown(true);
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
          setShowJudgment(false);
        }, 5000);
      }
    };

    // Check immediately
    checkLightMode();

    // Set up observer for class changes
    const observer = new MutationObserver(checkLightMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, [hasShown]);

  const handleDismiss = () => {
    setShowJudgment(false);
  };

  return (
    <AnimatePresence>
      {showJudgment && (
        <motion.div
          className="fixed top-0 left-1/2 z-[9999] pointer-events-auto"
          initial={{ y: -200, x: '-50%' }}
          animate={{ y: 20, x: '-50%' }}
          exit={{ y: -200, x: '-50%' }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 20,
          }}
        >
          <motion.div
            className="glass-card px-6 py-4 rounded-2xl border-2 border-white/20 shadow-2xl max-w-md"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.2), rgba(254, 198, 1, 0.2))',
            }}
            animate={{
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <div className="flex items-start gap-4">
              {/* Judging eyes */}
              <motion.div
                className="flex gap-1 mt-1"
                animate={{
                  x: [-2, 2, -2],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Eye className="w-6 h-6 text-[#1a202c]" />
                <Eye className="w-6 h-6 text-[#1a202c]" />
              </motion.div>

              {/* Message */}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-[#1a202c] mb-1">
                  👀 I&apos;m judging you...
                </h3>
                <p className="text-[#1a202c]/80 text-sm">
                  ...for picking light mode. Bold choice. Very bold. 🌞
                </p>
              </div>

              {/* Dismiss button */}
              <motion.button
                onClick={handleDismiss}
                className="p-1 hover:bg-black/10 rounded-lg transition-colors"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Dismiss"
              >
                <X className="w-5 h-5 text-[#1a202c]" />
              </motion.button>
            </div>

            {/* Animated gradient bar */}
            <motion.div
              className="mt-3 h-1 rounded-full"
              style={{
                background: 'linear-gradient(90deg, #FF6B6B, #FEC601, #FF6B6B)',
                backgroundSize: '200% 100%',
              }}
              animate={{
                backgroundPosition: ['0% 0%', '100% 0%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LightModeJudgment;
