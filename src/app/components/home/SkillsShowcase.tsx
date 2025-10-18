'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Server, Brain, Cloud } from 'lucide-react';
import SectionHeading from '../common/SectionHeading';
import Image from 'next/image';

const SkillsShowcase: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState(0);

  const categories = [
    {
      name: 'Frontend',
      icon: Code2,
      skills: [
        { name: 'React', icon: '/icons/react.png', level: 95 },
        { name: 'TypeScript', icon: '/icons/ts.png', level: 90 },
        { name: 'Next.js', icon: '/icons/react.png', level: 88 },
        { name: 'Tailwind', icon: '/icons/react.png', level: 92 },
      ],
    },
    {
      name: 'Backend',
      icon: Server,
      skills: [
        { name: 'Python', icon: '/icons/py.png', level: 93 },
        { name: 'FastAPI', icon: '/icons/py.png', level: 85 },
        { name: 'SQL', icon: '/icons/sql.png', level: 87 },
        { name: 'Redis', icon: '/icons/py.png', level: 82 },
      ],
    },
    {
      name: 'AI/ML',
      icon: Brain,
      skills: [
        { name: 'LLama3.2', icon: '/icons/py.png', level: 88 },
        { name: 'Machine Learning', icon: '/icons/py.png', level: 86 },
        { name: 'Azure AI', icon: '/icons/azure.png', level: 84 },
        { name: 'Model Optimization', icon: '/icons/py.png', level: 85 },
      ],
    },
    {
      name: 'DevOps',
      icon: Cloud,
      skills: [
        { name: 'AWS', icon: '/icons/azure.png', level: 87 },
        { name: 'Kubernetes', icon: '/icons/git.png', level: 83 },
        { name: 'CI/CD', icon: '/icons/git.png', level: 90 },
        { name: 'Git', icon: '/icons/git.png', level: 94 },
      ],
    },
  ];

  return (
    <section className="py-20 px-8 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <SectionHeading 
          align="center" 
          gradient
          subtitle="Full-stack expertise across modern web, AI/ML, and cloud technologies"
        >
          Technical Arsenal
        </SectionHeading>

        {/* Category Selector */}
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          {categories.map((category, index) => (
            <motion.button
              key={category.name}
              onClick={() => setActiveCategory(index)}
              className={`px-6 py-3 rounded-full text-lg font-medium transition-all relative ${
                activeCategory === index
                  ? 'text-white'
                  : 'text-white/60 hover:text-white/80'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {activeCategory === index && (
                <motion.div
                  layoutId="activeCategory"
                  className="absolute inset-0 bg-gradient-to-r from-[#FF6B6B] to-[#4A90E2] rounded-full"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <category.icon size={20} />
                {category.name}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Skills Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, rotateY: 90, scale: 0.8 }}
            animate={{ opacity: 1, rotateY: 0, scale: 1 }}
            exit={{ opacity: 0, rotateY: -90, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            className="grid md:grid-cols-2 gap-6"
          >
            {categories[activeCategory].skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="glass-card p-6 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded-lg bg-white/10 p-2 group-hover:bg-white/20 transition-all">
                        <Image
                          src={skill.icon}
                          alt={skill.name}
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-white">
                          {skill.name}
                        </h4>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#FF6B6B] via-[#FEC601] to-[#52B788] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                    />
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-white/20 rounded-full"
                      animate={{
                        x: ['-100%', `${skill.level}%`],
                      }}
                      transition={{
                        duration: 1.5,
                        delay: index * 0.1 + 0.3,
                      }}
                      style={{ width: '20%' }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Decorative Elements */}
        <motion.div
          className="absolute top-1/4 -left-20 w-64 h-64 bg-gradient-to-br from-[#FF6B6B]/20 to-[#FEC601]/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-20 w-64 h-64 bg-gradient-to-br from-[#4A90E2]/20 to-[#8B5CF6]/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: 2,
          }}
        />
      </div>
    </section>
  );
};

export default SkillsShowcase;
