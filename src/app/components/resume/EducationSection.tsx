"use client";
import React from 'react';
import { motion } from 'framer-motion';

const educationData = [
  {
    school: "Imperial College London",
    degree: "MEng in Computing (Computer Science)",
    period: "2022 - Present",
    gpa: "First Class Honors",
    details: [
      "Specializations in Artificial Intelligence and Computer Science",
      "Relevant coursework: Machine Learning, Algorithms, Data Structures, Computer Architecture"
    ]
  },
  {
    school: "NPS International School",
    degree: "IGCSE and IB",
    period: "2011 - 2021",
    gpa: "Grade 12",
    details: []
  }
];

const EducationSection: React.FC = () => {
  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold mb-8 text-yellow-300">Education</h2>
      
      <div className="space-y-6">
        {educationData.map((edu, index) => (
          <motion.div 
            key={index}
            className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-filter backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.03 }} 
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex flex-col md:flex-row justify-between mb-2">
              <h3 className="text-2xl font-bold">{edu.school}</h3>
              <span className="text-gray-300">{edu.period}</span>
            </div>
            
            <p className="text-xl text-yellow-300 mb-2">{edu.degree}</p>
            {edu.gpa && <p className="text-gray-200 mb-4">GPA: {edu.gpa}</p>}
            
            {edu.details.length > 0 && (
              <ul className="list-disc list-inside space-y-1">
                {edu.details.map((detail, idx) => (
                  <li key={idx} className="text-gray-200">{detail}</li>
                ))}
              </ul>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default EducationSection;