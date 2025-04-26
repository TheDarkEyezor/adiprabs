"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const ResumeHeader: React.FC = () => {
  return (
    <motion.header 
      className="mb-16 flex flex-col md:flex-row items-center md:items-start gap-8"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg">
        <Image 
          src="/picc.jpg" 
          alt="Aditya Prabakaran" 
          width={160} 
          height={160} 
          className="object-cover"
        />
      </div>
      
      <div className="text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-bold mb-2">Aditya Prabakaran</h1>
        <p className="text-xl text-yellow-200 mb-4">Software Engineer & CS Student</p>
        
        <div className="mb-6">
          <p className="mb-1">aditya.prabakaran@gmail.com</p>
          <p className="mb-1">London, UK</p>
          <div className="flex gap-4 justify-center md:justify-start mt-2">
            <a href="https://github.com/TheDarkEyezor" className="text-white hover:text-yellow-300">GitHub</a>
            <a href="https://www.linkedin.com/in/adiprabs/" className="text-white hover:text-yellow-300">LinkedIn</a>
          </div>
        </div>
        
        <p className="max-w-2xl">
          Computing student at Imperial College London with experience in full-stack development,
          artificial intelligence, and quantitative analysis. Passionate about solving complex
          problems with elegant solutions.
        </p>
      </div>
    </motion.header>
  );
};

export default ResumeHeader;