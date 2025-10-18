'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface ProjectPreviewProps {
  title: string;
  description: string;
  imageUrl?: string;
  tags: string[];
  children: React.ReactNode;
}

const ProjectPreview: React.FC<ProjectPreviewProps> = ({
  title,
  description,
  imageUrl,
  tags,
  children,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}

      {/* Preview Overlay */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute inset-0 z-50 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Expanded preview card */}
            <motion.div
              className="absolute left-1/2 top-1/2 w-[120%] glass-card rounded-2xl overflow-hidden border border-white/20 pointer-events-auto"
              initial={{ scale: 0.8, y: '-40%', x: '-50%' }}
              animate={{ scale: 1, y: '-50%', x: '-50%' }}
              exit={{ scale: 0.8, y: '-40%', x: '-50%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              style={{
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
              }}
            >
              {/* Image Preview */}
              {imageUrl && (
                <div className="relative w-full h-48 bg-gradient-to-br from-[#FF6B6B]/20 to-[#FEC601]/20">
                  <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                </div>
              )}

              {/* Content */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-white mb-3 line-clamp-1">
                  {title}
                </h3>
                <p className="text-white/80 text-sm mb-4 line-clamp-3">
                  {description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {tags.slice(0, 5).map((tag, index) => (
                    <motion.span
                      key={tag}
                      className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/80 backdrop-blur-sm"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>

                {/* Animated gradient bar */}
                <motion.div
                  className="mt-4 h-1 rounded-full bg-gradient-to-r from-[#FF6B6B] via-[#FEC601] to-[#52B788]"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  style={{ transformOrigin: 'left' }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectPreview;
