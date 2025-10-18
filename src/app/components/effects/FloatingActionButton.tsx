'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, Download, Mail } from 'lucide-react';

interface FABProps {
  showScrollTop?: boolean;
  showDownloadResume?: boolean;
  showContact?: boolean;
}

const FloatingActionButton: React.FC<FABProps> = ({
  showScrollTop = true,
  showDownloadResume = true,
  showContact = true,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [showButton, setShowButton] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const downloadResume = () => {
    // Opens your resume PDF from /public folder
    window.open('/AdiPrabs_swe.pdf', '_blank');
  };

  const openContact = () => {
    window.location.href = 'mailto:your.email@example.com';
  };

  if (!showButton) return null;

  return (
    <div className="fixed bottom-8 right-8 z-40">
      <motion.div
        className="flex flex-col-reverse gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
      >
        {/* Secondary Actions */}
        {isExpanded && (
          <>
            {showContact && (
              <motion.button
                onClick={openContact}
                className="glass-card p-4 rounded-full hover:bg-white/20 transition-all group"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ delay: 0.1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Contact"
              >
                <Mail className="w-6 h-6 text-white" />
              </motion.button>
            )}
            {showDownloadResume && (
              <motion.button
                onClick={downloadResume}
                className="glass-card p-4 rounded-full hover:bg-white/20 transition-all group"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ delay: 0.05 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Download Resume"
              >
                <Download className="w-6 h-6 text-white" />
              </motion.button>
            )}
          </>
        )}

        {/* Main Button */}
        <motion.button
          onClick={() => {
            if (isExpanded) {
              setIsExpanded(false);
            } else if (showScrollTop && !isExpanded) {
              scrollToTop();
            }
          }}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
          className="glass-card p-4 rounded-full bg-gradient-to-r from-[#FF6B6B] to-[#FEC601] hover:shadow-lg hover:shadow-[#FF6B6B]/50 transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Actions"
        >
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ArrowUp className="w-6 h-6 text-white" />
          </motion.div>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default FloatingActionButton;
