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
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <AnimatePresence>
        {animationPhase === 'form' && (
          <motion.form
            key="form" 
            className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full relative overflow-hidden" // Added overflow-hidden here too for initial state
            onSubmit={handleSubmit}
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="fold" // This will now use the updated fold variant
            style={{ transformOrigin: 'top' }} // Set origin for height collapse
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Contact Me</h2>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="message" className="block text-gray-700 font-bold mb-2">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                rows={4}
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Send Message
            </button>
             {/* Close button inside the form container */}
             <button
              type="button" 
              className="absolute top-4 right-4 bg-gray-200 text-gray-800 rounded-full w-8 h-8 flex items-center justify-center text-xl hover:bg-gray-300 z-10" // Ensure button stays above content
              onClick={onClose}
              aria-label="Close contact form"
            >
              &times;
            </button>
          </motion.form>
        )}

        {animationPhase === 'flying' && (
          <motion.div
            key="airplane" // Key is important for AnimatePresence
            className="text-white text-6xl" // Style your airplane icon
            variants={getAirplaneVariants()}
            initial="initial"
            animate="loopAndFly"
          >
            ✈️ {/* Or use an SVG/Image component */}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Contact;