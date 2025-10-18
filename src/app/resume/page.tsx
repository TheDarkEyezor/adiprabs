'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Download, Eye, FileText } from 'lucide-react';
import { TransitionLink } from '../components/transitions/TransitionLink';
import Navbar from '../components/Navbar';
import ParticleField from '../components/effects/ParticleField';
import SectionHeading from '../components/common/SectionHeading';
import GlassCard from '../components/common/GlassCard';
import { staggerContainer, staggerItem } from '@/utils/animations';

export default function ResumePage() {
  const [isInteractiveView, setIsInteractiveView] = useState(true);

  // Persist toggle state in localStorage
  useEffect(() => {
    const saved = localStorage.getItem('resumeViewMode');
    if (saved !== null) {
      setIsInteractiveView(saved === 'interactive');
    }
  }, []);

  const handleToggle = () => {
    const newValue = !isInteractiveView;
    setIsInteractiveView(newValue);
    localStorage.setItem('resumeViewMode', newValue ? 'interactive' : 'pdf');
  };

  const experiences = [
    {
      company: 'VaNI MedTech',
      role: 'Full-stack & AI/ML Developer',
      period: 'June 2025 - Present',
      achievements: [
        'Built AI-powered healthcare platform with 120ms latency',
        'Achieved 99.9% uptime with robust error handling',
        'Reduced bugs by 76% through comprehensive testing',
        'Technologies: React, TypeScript, Next.js, FastAPI, Redis, AWS, Kubernetes'
      ],
      color: 'from-[#FF6B6B] to-[#FEC601]'
    },
    {
      company: 'Trajex',
      role: 'Machine Learning Developer',
      period: 'Oct 2024 - Present',
      achievements: [
        'Deployed LLama3.2-7b-Instruct model for K3 Capital client',
        '20% cost reduction compared to OpenAI solutions',
        '12% faster processing with optimized inference',
        'Led product design and investor pitching',
        'Technologies: LLama3.2, Python, ML/AI, Product Design'
      ],
      color: 'from-[#FEC601] to-[#52B788]'
    },
    {
      company: 'Altus Reach',
      role: 'ML Engineer (Contractor)',
      period: 'Jan 2024 - Oct 2024',
      achievements: [
        '19% accuracy improvement in video saliency detection',
        '8% faster processing through algorithm optimization',
        'Full-stack development with React, Next.js, TypeScript',
        'Azure cloud infrastructure deployment',
        'Technologies: Azure AI, TypeScript, Python, React, Next.js'
      ],
      color: 'from-[#52B788] to-[#4A90E2]'
    },
  ];

  const education = {
    institution: 'Imperial College London',
    degree: 'BSc in Computing',
    period: 'Oct 2023 - Jul 2027 (Expected)',
    highlights: [
      'Focus on AI/ML and Systems Programming',
      'Relevant coursework: Algorithms, Data Structures, Software Engineering',
      'Active in hackathons and coding competitions'
    ]
  };

  const skills = {
    'Frontend': ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'HTML/CSS'],
    'Backend': ['Python', 'FastAPI', 'Node.js', 'SQL', 'Redis'],
    'AI/ML': ['LLama3.2', 'Machine Learning', 'Azure AI', 'Model Optimization'],
    'DevOps': ['AWS', 'Kubernetes', 'CI/CD', 'Git', 'Docker'],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white overflow-x-hidden">
      <ParticleField count={40} />
      
      {/* Fixed gradient orbs */}
      <motion.div
        className="fixed top-20 -left-40 w-96 h-96 bg-gradient-to-br from-[#8B5CF6]/30 to-[#FF10F0]/30 rounded-full blur-3xl pointer-events-none"
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
        className="fixed bottom-20 -right-40 w-96 h-96 bg-gradient-to-br from-[#FF6B6B]/30 to-[#FEC601]/30 rounded-full blur-3xl pointer-events-none"
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

      <div className="relative z-10 px-8 py-12 max-w-7xl mx-auto">
        {/* Header with Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <TransitionLink href="/">
            <motion.button
              className="mb-8 flex items-center text-white/80 hover:text-white transition-colors glass-card px-4 py-2 rounded-lg"
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="mr-2" size={20} /> Back to Home
            </motion.button>
          </TransitionLink>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <SectionHeading 
              align="left" 
              gradient
              subtitle="Full-stack developer and AI/ML engineer with 3+ years of experience"
            >
              Resume
            </SectionHeading>

            {/* Toggle Switch */}
            <div className="flex items-center gap-4">
              <motion.button
                onClick={handleToggle}
                className={`relative flex items-center gap-3 px-6 py-3 rounded-full glass-card border-2 transition-all ${
                  isInteractiveView 
                    ? 'border-[#52B788]' 
                    : 'border-[#8B5CF6]'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Eye size={20} className={isInteractiveView ? 'text-[#52B788]' : 'text-white/40'} />
                
                <div className="relative w-14 h-7 bg-white/20 rounded-full">
                  <motion.div
                    className={`absolute top-1 w-5 h-5 rounded-full ${
                      isInteractiveView 
                        ? 'bg-gradient-to-r from-[#52B788] to-[#4A90E2]' 
                        : 'bg-gradient-to-r from-[#8B5CF6] to-[#FF10F0]'
                    }`}
                    animate={{
                      left: isInteractiveView ? '4px' : 'calc(100% - 24px)'
                    }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </div>
                
                <FileText size={20} className={!isInteractiveView ? 'text-[#8B5CF6]' : 'text-white/40'} />
              </motion.button>

              <span className="text-sm text-white/60 hidden md:block">
                {isInteractiveView ? 'Interactive View' : 'PDF View'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Content - Animated transition */}
        <AnimatePresence mode="wait">
          {isInteractiveView ? (
            <motion.div
              key="interactive"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
            >
              {/* Experience Section */}
              <div className="mb-16">
                <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-[#FF6B6B] to-[#FEC601] bg-clip-text text-transparent">
                  Work Experience
                </h2>
                
                <motion.div
                  className="space-y-6"
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                >
                  {experiences.map((exp, ) => (
                    <motion.div key={exp.company} variants={staggerItem}>
                      <GlassCard variant="interactive" hoverEffect className="overflow-hidden">
                        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${exp.color} rounded-t-2xl`} />
                        
                        <div className="relative p-6 pt-8">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                            <div>
                              <h3 className="text-2xl font-bold text-white mb-1">{exp.company}</h3>
                              <p className="text-lg text-white/80">{exp.role}</p>
                            </div>
                            <span className="text-sm text-white/60 mt-2 md:mt-0">{exp.period}</span>
                          </div>

                          <ul className="space-y-2">
                            {exp.achievements.map((achievement, i) => (
                              <li key={i} className="flex items-start gap-3 text-white/80">
                                <span className={`mt-1.5 w-2 h-2 rounded-full bg-gradient-to-r ${exp.color} flex-shrink-0`} />
                                <span>{achievement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Education Section */}
              <div className="mb-16">
                <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-[#4A90E2] to-[#8B5CF6] bg-clip-text text-transparent">
                  Education
                </h2>
                
                <GlassCard variant="interactive" hoverEffect className="overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4A90E2] to-[#8B5CF6] rounded-t-2xl" />
                  
                  <div className="relative p-6 pt-8">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-1">{education.institution}</h3>
                        <p className="text-lg text-white/80">{education.degree}</p>
                      </div>
                      <span className="text-sm text-white/60 mt-2 md:mt-0">{education.period}</span>
                    </div>

                    <ul className="space-y-2">
                      {education.highlights.map((highlight, i) => (
                        <li key={i} className="flex items-start gap-3 text-white/80">
                          <span className="mt-1.5 w-2 h-2 rounded-full bg-gradient-to-r from-[#4A90E2] to-[#8B5CF6] flex-shrink-0" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </GlassCard>
              </div>

              {/* Skills Section */}
              <div>
                <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-[#52B788] to-[#00F5FF] bg-clip-text text-transparent">
                  Technical Skills
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {Object.entries(skills).map(([category, skillList], index) => (
                    <motion.div
                      key={category}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <GlassCard className="p-6">
                        <h3 className="text-xl font-bold mb-4 text-white">{category}</h3>
                        <div className="flex flex-wrap gap-2">
                          {skillList.map(skill => (
                            <span
                              key={skill}
                              className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-sm"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="pdf"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* PDF View */}
              <GlassCard className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-[#8B5CF6] to-[#FF10F0] bg-clip-text text-transparent">
                    Resume PDF
                  </h2>
                  <motion.a
                    href="/AdiPrabs_SWE.pdf"
                    download
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#8B5CF6] to-[#FF10F0] rounded-lg font-semibold text-white"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Download size={20} />
                    Download PDF
                  </motion.a>
                </div>

                {/* PDF Embed */}
                <div className="w-full h-[800px] rounded-lg overflow-hidden border-2 border-white/20">
                  <iframe
                    src="/AdiPrabs_SWE.pdf"
                    className="w-full h-full"
                    title="Resume PDF"
                  />
                </div>
              </GlassCard>

              <p className="text-center text-white/60 text-sm">
                Can&apos;t view the PDF? <a href="/AdiPrabs_SWE.pdf" download className="text-[#8B5CF6] hover:underline">Download it here</a>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
