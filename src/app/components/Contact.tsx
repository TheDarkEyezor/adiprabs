"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';

interface FormData {
  name: string;
  email: string;
  message: string;
}

const Contact: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [animationPhase, setAnimationPhase] = useState<'form' | 'folding' | 'flying'>('form');
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAnimationPhase('folding'); // Start folding animation

    try {
      await emailjs.send(
        'service_j064tpj', // Replace with your EmailJS service ID
        'template_6k9go1v', // Replace with your EmailJS template ID
        {
          from_name: formData.name,
          reply_to: formData.email,
          message: formData.message,
        },
        'JX1_kltSZm6UjQkWi' // Replace with your EmailJS public key
      );

      // Wait for folding animation to roughly complete before starting fly
      setTimeout(() => {
        setAnimationPhase('flying');
      }, 800); // Adjust timing based on fold animation duration (1000ms)

      // Wait for flying animation to complete before closing the modal
      setTimeout(() => {
        onClose();
      }, 800 + 3000); // Folding time + Flying time

    } catch (error) {
      console.error('Failed to send email:', error);
      alert('Failed to send message. Please try again.');
      setAnimationPhase('form'); // Reset to form on error
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    fold: {
      opacity: [1, 0.8, 0], // Fade out during the fold
      height: ["100%", "50%", "0%"], // Animate height to zero
      y: [0, -50, -100], // Optional: Move slightly up as it folds
      overflow: "hidden", // Prevent content spill during height animation
      transition: { 
        duration: 1, // Duration of the fold animation
        ease: "easeInOut",
        times: [0, 0.5, 1] // Control timing of keyframes for height/opacity
      }
    },
  };

  // Ensure window is defined before accessing innerWidth/innerHeight
  const getAirplaneVariants = () => {
    if (typeof window === 'undefined') {
      // Default variants for SSR or environments without window
      return {
        initial: { opacity: 0, scale: 0.5, x: 0, y: 0, rotate: 0 },
        loopAndFly: { opacity: 0, x: 0, y: 0 }, // No animation if window is undefined
      };
    }
    return {
      initial: { opacity: 0, scale: 0.5, x: 0, y: 0, rotate: 0 },
      loopAndFly: {
        opacity: [0, 1, 1, 1, 0], // Fade in, stay, fade out during fly
        scale: [0.5, 1, 1, 1, 0.8], // Scale up, stay, shrink slightly
        x: [0, 50, -50, 0, window.innerWidth], // Loop side to side then fly off right
        y: [0, -20, 20, 0, -window.innerHeight / 2], // Loop up and down then fly off top
        rotate: [0, 15, -15, 0, 45], // Rotate during loop and fly off
        transition: {
          duration: 3, // Total duration for loop + fly
          times: [0, 0.2, 0.5, 0.7, 1], // Keyframe timings
          ease: "easeInOut"
        }
      },
    };
  };


  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <AnimatePresence>
        {animationPhase === 'form' && (
          <motion.form
            key="form" 
            className="glass-card p-8 rounded-2xl shadow-2xl max-w-md w-full relative overflow-hidden border-2 border-white/20"
            onSubmit={handleSubmit}
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="fold"
            style={{ transformOrigin: 'top' }}
          >
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#4A90E2]/30 via-[#52B788]/30 to-[#FEC601]/30 opacity-50" />
            
            {/* Shimmer effect */}
            <div className="absolute inset-0 shimmer opacity-20 pointer-events-none" />
            
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-6 text-white bg-gradient-to-r from-[#4A90E2] to-[#52B788] bg-clip-text text-transparent">Contact Me</h2>
              <div className="mb-4">
                <label htmlFor="name" className="block text-white font-bold mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg glass-card border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#52B788] focus:border-transparent transition-all"
                  placeholder="Your name"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-white font-bold mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg glass-card border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#52B788] focus:border-transparent transition-all"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="message" className="block text-white font-bold mb-2">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg glass-card border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#52B788] focus:border-transparent transition-all resize-none"
                  placeholder="Your message..."
                  rows={4}
                  required
                ></textarea>
              </div>
              <motion.button
                type="submit"
                className="w-full bg-gradient-to-r from-[#4A90E2] to-[#52B788] text-white font-bold py-3 px-4 rounded-lg hover:shadow-lg transition duration-300 relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10">Send Message</span>
                <motion.div 
                  className="absolute inset-0 bg-white/20"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.5 }}
                />
              </motion.button>
               {/* Close button inside the form container */}
               <motion.button
                type="button" 
                className="absolute top-4 right-4 glass-card text-white rounded-full w-10 h-10 flex items-center justify-center text-xl hover:bg-white/20 z-20 border border-white/30"
                onClick={onClose}
                aria-label="Close contact form"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                &times;
              </motion.button>
            </div>
          </motion.form>
        )}

        {animationPhase === 'flying' && (
          <motion.div
            key="airplane"
            className="text-white text-6xl filter drop-shadow-[0_0_30px_rgba(82,183,136,0.8)]"
            variants={getAirplaneVariants()}
            initial="initial"
            animate="loopAndFly"
          >
            ✈️
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Contact;