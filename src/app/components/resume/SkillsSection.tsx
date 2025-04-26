"use client";
import React from 'react';
import { motion } from 'framer-motion';

const skillCategories = [
  {
    title: "Programming Languages",
    skills: ["TypeScript", "JavaScript", "Python", "Java", "C/C++", "Kotlin", "Haskell", "SQL"]
  },
  {
    title: "Web Technologies",
    skills: ["React", "Next.js", "Node.js", "HTML/CSS", "Tailwind CSS", "Express", "REST APIs"]
  },
  {
    title: "Tools & Platforms",
    skills: ["Git", "GitHub", "VS Code", "Docker", "AWS", "Firebase", "MongoDB", "PostgreSQL"]
  },
  {
    title: "Soft Skills",
    skills: ["Problem Solving", "Project Management", "Team Leadership", "Communication", "Agile Methodologies"]
  }
];

const SkillsSection: React.FC = () => {
  return (
    <section>
      <h2 className="text-3xl font-bold mb-8 text-yellow-300">Skills</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {skillCategories.map((category, index) => (
          <motion.div 
            key={index}
            className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-filter backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <h3 className="text-xl font-bold mb-4">{category.title}</h3>
            
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill, idx) => (
                <motion.span 
                  key={idx}
                  className="bg-indigo-900 px-3 py-1 rounded-full text-sm"
                  whileHover={{ scale: 1.05 }}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default SkillsSection;