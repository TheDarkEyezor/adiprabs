'use client';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, Heart, Star } from 'lucide-react';

const EasterEggs: React.FC = () => {
  const [konamiProgress, setKonamiProgress] = useState(0);
  const [showKonamiReward, setShowKonamiReward] = useState(false);
  const [showLogoReward, setShowLogoReward] = useState(false);
  const [secretCode, setSecretCode] = useState('');

  const konamiCode = [
    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
    'b',
    'a',
  ];

  // Konami code listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === konamiCode[konamiProgress]) {
        const newProgress = konamiProgress + 1;
        setKonamiProgress(newProgress);

        if (newProgress === konamiCode.length) {
          setShowKonamiReward(true);
          setKonamiProgress(0);
          setTimeout(() => setShowKonamiReward(false), 5000);
        }
      } else {
        setKonamiProgress(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [konamiProgress, konamiCode]);

  // Logo click counter
  useEffect(() => {
    let clickCount = 0;
    
    const handleLogoClick = () => {
      clickCount += 1;
      if (clickCount === 5) {
        setShowLogoReward(true);
        clickCount = 0;
        setTimeout(() => {
          setShowLogoReward(false);
        }, 5000);
      }
    };

    // Add click listener to logo elements
    const logos = document.querySelectorAll('[data-logo="true"]');
    logos.forEach((logo) => {
      logo.addEventListener('click', handleLogoClick as EventListener);
    });

    return () => {
      logos.forEach((logo) => {
        logo.removeEventListener('click', handleLogoClick as EventListener);
      });
    };
  }, []);

  // Secret text code listener
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key.length === 1) {
        const newCode = (secretCode + e.key).toLowerCase();
        setSecretCode(newCode);

        if (newCode.includes('developer')) {
          triggerConfetti();
          setSecretCode('');
        } else if (newCode.length > 20) {
          setSecretCode(newCode.slice(-20));
        }
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [secretCode]);

  const triggerConfetti = () => {
    // Create confetti effect
    const confettiCount = 50;
    const confettiElements = Array.from({ length: confettiCount }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 2,
      color: ['#FF6B6B', '#FEC601', '#52B788', '#4A90E2', '#8B5CF6'][Math.floor(Math.random() * 5)],
    }));

    const confettiContainer = document.createElement('div');
    confettiContainer.style.cssText = 'position: fixed; inset: 0; pointer-events: none; z-index: 9999;';
    document.body.appendChild(confettiContainer);

    confettiElements.forEach((conf) => {
      const el = document.createElement('div');
      el.style.cssText = `
        position: absolute;
        left: ${conf.left}%;
        top: -10%;
        width: 10px;
        height: 10px;
        background: ${conf.color};
        animation: fall ${conf.duration}s linear ${conf.delay}s forwards;
      `;
      confettiContainer.appendChild(el);
    });

    // Add animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fall {
        to {
          transform: translateY(100vh) rotate(720deg);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);

    setTimeout(() => {
      document.body.removeChild(confettiContainer);
      document.head.removeChild(style);
    }, 5000);
  };

  return (
    <>
      {/* Konami Code Reward */}
      <AnimatePresence>
        {showKonamiReward && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="glass-card p-8 rounded-3xl text-center max-w-md"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-16 h-16 text-[#FEC601] mx-auto mb-4" />
              </motion.div>
              <h2 className="text-3xl font-bold text-white mb-2">🎮 Konami Code!</h2>
              <p className="text-white/80">You found the secret! You&apos;re a true gamer! 🏆</p>
              <motion.div
                className="mt-4 flex justify-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  >
                    <Star className="w-6 h-6 text-[#FEC601] fill-[#FEC601]" />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logo Click Reward */}
      <AnimatePresence>
        {showLogoReward && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="glass-card p-8 rounded-3xl text-center max-w-md"
              initial={{ scale: 0, y: 100 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0, y: -100 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <Heart className="w-16 h-16 text-[#FF6B6B] mx-auto mb-4 fill-[#FF6B6B]" />
              </motion.div>
              <h2 className="text-3xl font-bold text-white mb-2">💖 You found me!</h2>
              <p className="text-white/80">Thanks for clicking around! You&apos;re curious and I like that! 😊</p>
              <motion.div
                className="mt-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
              >
                <Zap className="w-8 h-8 text-[#FEC601] mx-auto" />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress indicator (hidden) */}
      {konamiProgress > 0 && (
        <div className="fixed bottom-4 left-4 z-50 opacity-20">
          <div className="text-xs text-white">
            {konamiProgress}/{konamiCode.length}
          </div>
        </div>
      )}
    </>
  );
};

export default EasterEggs;
