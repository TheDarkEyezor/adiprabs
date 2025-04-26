"use client";
import React from 'react';
import { motion } from 'framer-motion';

interface ExperienceCardProps {
  title: string;
  company: string;
  period: string;
  details: string[];
  link?: string;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ 
  title, 
  company, 
  period, 
  details,
  link 
}) => {
  return (
    <motion.div 
      className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-filter backdrop-blur-sm"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col md:flex-row justify-between mb-4">
        <div>
          <h3 className="text-2xl font-bold">{title}</h3>
          <h4 className="text-xl text-yellow-300">{company}</h4>
        </div>
        <span className="text-gray-300 mt-2 md:mt-0">{period}</span>
      </div>
      
      <ul className="list-disc list-inside space-y-2 mb-4">
        {details.map((detail, index) => (
          <li key={index} className="text-gray-200">{detail}</li>
        ))}
      </ul>
      
      {link && (
        <a 
          href={link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block text-blue-300 hover:text-blue-200 transition-colors"
        >
          View Project →
        </a>
      )}
    </motion.div>
  );
};

export default ExperienceCard;