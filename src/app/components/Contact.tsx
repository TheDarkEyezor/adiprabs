import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FormData {
  name: string;
  email: string;
  message: string;
}

const Contact: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    // For demonstration, we'll just set isSubmitted to true
    setIsSubmitted(true);
    
    // Simulate sending email (replace with actual email sending logic)
    console.log('Sending email:', formData);
    
    // Close the form after animation
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -50, transition: { duration: 0.5 } },
  };

  const airplaneVariants = {
    initial: { x: 0, y: 0, rotate: 0, scale: 1 },
    fly: { 
      x: window.innerWidth,
      y: -window.innerHeight,
      rotate: 45,
      scale: 0,
      transition: { duration: 2, ease: "easeInOut" }
    },
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4">
      <AnimatePresence>
        {!isSubmitted ? (
          <motion.form
            className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full"
            onSubmit={handleSubmit}
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h2 className="text-2xl font-bold mb-4">Contact Me</h2>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          </motion.form>
        ) : (
          <motion.div
            className="text-white text-6xl"
            variants={airplaneVariants}
            initial="initial"
            animate="fly"
          >
            ✈️
          </motion.div>
        )}
      </AnimatePresence>
      {!isSubmitted && (
        <button
          className="absolute top-4 right-4 bg-white text-black rounded-full w-10 h-10 flex items-center justify-center text-2xl"
          onClick={onClose}
        >
          &times;
        </button>
      )}
    </div>
  );
};

export default Contact;