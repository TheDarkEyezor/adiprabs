'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { staggerContainer, staggerItem } from '@/utils/animations';
import AnimatedButton from '../common/AnimatedButton';
import { TransitionLink } from '../TransitionLink';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-8 py-20">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A192F] via-[#1a2942] to-[#0A192F] opacity-90" />
      
      {/* Content */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {/* Left side - Text content */}
        <motion.div variants={staggerItem} className="text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
              <span className="block bg-gradient-to-r from-[#FF6B6B] via-[#FEC601] to-[#52B788] bg-clip-text text-transparent animate-gradient">
                Adi
              </span>
              <span className="block bg-gradient-to-r from-[#52B788] via-[#4A90E2] to-[#8B5CF6] bg-clip-text text-transparent animate-gradient">
                Prabs
              </span>
            </h1>
          </motion.div>

          <motion.div
            className="mb-8"
            variants={staggerItem}
          >
            <p className="text-2xl md:text-3xl font-semibold text-white/90 mb-4">
              Building AI Solutions | Full-Stack Developer | Tech Leader
            </p>
            <p className="text-lg text-white/70 max-w-xl">
              MEng Computing student at Imperial College London, passionate about creating innovative solutions 
              that merge AI/ML with full-stack development. Currently leading product development at VaNI MedTech.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-wrap gap-4"
            variants={staggerItem}
          >
            <TransitionLink href="/projects">
              <AnimatedButton variant="primary" size="lg" gradient>
                View My Work
              </AnimatedButton>
            </TransitionLink>
            <TransitionLink href="/resume">
              <AnimatedButton variant="secondary" size="lg">
                Download Resume
              </AnimatedButton>
            </TransitionLink>
          </motion.div>

          {/* Quick stats */}
          <motion.div
            className="mt-12 grid grid-cols-3 gap-8"
            variants={staggerItem}
          >
            <div>
              <div className="text-3xl font-bold text-[#FF6B6B]">3+</div>
              <div className="text-sm text-white/60">Years Coding</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#FEC601]">15+</div>
              <div className="text-sm text-white/60">Projects</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#52B788]">99.9%</div>
              <div className="text-sm text-white/60">Uptime</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right side - Profile image with 3D effect */}
        <motion.div
          className="relative"
          variants={staggerItem}
        >
          <motion.div
            className="relative w-full max-w-md mx-auto"
            whileHover={{ scale: 1.05, rotateY: 5, rotateX: 5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {/* Glassmorphic card */}
            <div className="glass-card p-8 rounded-3xl border-2 border-white/20 backdrop-blur-xl bg-white/5">
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden">
                <Image
                  src="/picc.jpg"
                  alt="Adi Prabs"
                  fill
                  className="object-cover"
                  priority
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              
              {/* Floating tech badges */}
              <div className="mt-6 flex flex-wrap gap-2 justify-center">
                {['React', 'TypeScript', 'Python', 'AI/ML', 'AWS'].map((tech, i) => (
                  <motion.span
                    key={tech}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 border border-white/20 text-white"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Decorative elements */}
            <motion.div
              className="absolute -top-4 -right-4 w-24 h-24 bg-[#FF6B6B]/20 rounded-full blur-2xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.div
              className="absolute -bottom-4 -left-4 w-32 h-32 bg-[#52B788]/20 rounded-full blur-2xl"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-1 h-2 bg-white/60 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
