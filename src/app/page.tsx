'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/home/Hero';
import CurrentRoles from './components/home/CurrentRoles';
import SkillsShowcase from './components/home/SkillsShowcase';
import LatestWork from './components/home/LatestWork';
import Contact from './components/Contact';
import ParticleField from './components/effects/ParticleField';
import ScrollProgress from './components/effects/ScrollProgress';
import { Github, Linkedin, Mail, Instagram } from 'lucide-react';

const HomePage: React.FC = () => {
  const [isContactExpanded, setIsContactExpanded] = useState(false);

  return (
    <>
      <ScrollProgress />
      <motion.div
        className="min-h-screen flex flex-col font-['Roboto', sans-serif] relative overflow-hidden bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        key="content"
      >
        {/* Particle background */}
        <ParticleField count={50} />

        {/* Fixed gradient orbs */}
        <motion.div
          className="fixed top-20 -left-40 w-96 h-96 bg-gradient-to-br from-[#FF6B6B]/30 to-[#FEC601]/30 rounded-full blur-3xl pointer-events-none"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
        />
        <motion.div
          className="fixed bottom-20 -right-40 w-96 h-96 bg-gradient-to-br from-[#4A90E2]/30 to-[#8B5CF6]/30 rounded-full blur-3xl pointer-events-none"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            delay: 4,
          }}
        />
        
        <Navbar />
        
        <main className="flex-grow relative z-10">
          {/* Hero Section */}
          <Hero />

          {/* Current Roles */}
          <CurrentRoles />

          {/* Skills Showcase */}
          <SkillsShowcase />

          {/* Latest Work */}
          <LatestWork />

          {/* Contact CTA */}
          <section className="py-20 px-8">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                className="glass-card p-12 cursor-pointer relative overflow-hidden border-2 border-[#4A90E2]/30 group"
                style={{
                  background: 'linear-gradient(135deg, #4A90E2 0%, #5AA3F0 100%)',
                }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 0 40px rgba(74, 144, 226, 0.6), 0 20px 60px rgba(0, 0, 0, 0.3)"
                }}
                onClick={() => setIsContactExpanded(true)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <motion.div 
                  className="absolute bottom-0 left-1/3 w-40 h-40 bg-white/10 rounded-full blur-3xl"
                  animate={{ 
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.5, 0.3]
                  }}
                  transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
                />
                <div className="relative z-10">
                  <h2 className="text-4xl font-bold text-white mb-4">Let&apos;s Work Together</h2>
                  <p className="text-xl text-white/90 mb-6">
                    Have a project in mind or want to collaborate? Get in touch!
                  </p>
                  <div className="inline-flex items-center gap-2 text-white text-lg font-semibold group-hover:gap-4 transition-all">
                    Contact Me
                    <svg 
                      className="w-6 h-6" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M17 8l4 4m0 0l-4 4m4-4H3" 
                      />
                    </svg>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        </main>

        <footer className="glass-dark text-white p-6 mt-auto border-t border-white/10 relative z-10">
          <motion.div 
            className="flex justify-center space-x-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <motion.a 
              href="https://github.com/TheDarkEyezor" 
              target="_blank" 
              rel="noopener noreferrer"
              whileHover={{ 
                scale: 1.2, 
                rotate: 5,
                filter: "drop-shadow(0 0 10px rgba(255, 107, 107, 0.8))"
              }}
              whileTap={{ scale: 0.9 }}
            >
              <Github className="w-6 h-6 hover:text-[#FF6B6B] transition-colors" />
            </motion.a>
            <motion.a 
              href="https://www.linkedin.com/in/adiprabs/" 
              target="_blank" 
              rel="noopener noreferrer"
              whileHover={{ 
                scale: 1.2, 
                rotate: -5,
                filter: "drop-shadow(0 0 10px rgba(74, 144, 226, 0.8))"
              }}
              whileTap={{ scale: 0.9 }}
            >
              <Linkedin className="w-6 h-6 hover:text-[#4A90E2] transition-colors" />
            </motion.a>
            <motion.a 
              href="mailto:aditya.prabakaran@gmail.com"
              whileHover={{ 
                scale: 1.2, 
                rotate: 5,
                filter: "drop-shadow(0 0 10px rgba(82, 183, 136, 0.8))"
              }}
              whileTap={{ scale: 0.9 }}
            >
              <Mail className="w-6 h-6 hover:text-[#52B788] transition-colors" />
            </motion.a>
            <motion.a 
              href="https://www.instagram.com/adiprabs/" 
              target="_blank" 
              rel="noopener noreferrer"
              whileHover={{ 
                scale: 1.2, 
                rotate: -5,
                filter: "drop-shadow(0 0 10px rgba(254, 198, 1, 0.8))"
              }}
              whileTap={{ scale: 0.9 }}
            >
              <Instagram className="w-6 h-6 hover:text-[#FEC601] transition-colors" />
            </motion.a>
          </motion.div>
          <div className="text-center mt-4 text-white/60 text-sm">
            © 2025 Aditya Prabakaran. Built with Next.js, TypeScript & Framer Motion.
          </div>
        </footer>

        {/* Contact Modal */}
        <AnimatePresence>
          {isContactExpanded && (
            <motion.div
              className="fixed inset-0 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Contact onClose={() => setIsContactExpanded(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default HomePage;
