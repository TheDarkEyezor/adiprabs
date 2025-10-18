'use client';
import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../common/GlassCard';
import SectionHeading from '../common/SectionHeading';
import { staggerContainer, staggerItem } from '@/utils/animations';

const CurrentRoles: React.FC = () => {
  const roles = [
    {
      company: 'VaNI MedTech',
      title: 'Full-stack & AI/ML Developer',
      period: 'June 2025 - Present',
      color: 'from-[#FF6B6B] to-[#FE8C8C]',
      highlights: [
        '120ms latency',
        '76% fewer bugs',
        '99.9% uptime',
      ],
      tags: ['React', 'TypeScript', 'Next.js', 'FastAPI', 'AWS', 'Kubernetes'],
    },
    {
      company: 'Trajex',
      title: 'Machine Learning Developer',
      period: 'Oct 2024 - Present',
      color: 'from-[#4A90E2] to-[#5AA3F0]',
      highlights: [
        '20% cost reduction',
        '12% faster',
        'K3 Capital client',
      ],
      tags: ['LLama3.2', 'Python', 'ML/AI', 'Product Design'],
    },
  ];

  return (
    <section className="py-20 px-8 relative">
      <div className="max-w-7xl mx-auto">
        <SectionHeading 
          align="center" 
          gradient
          subtitle="Currently building the future at these amazing companies"
        >
          What I&apos;m Working On
        </SectionHeading>

        <motion.div
          className="grid md:grid-cols-2 gap-8"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {roles.map((role, index) => (
            <motion.div key={role.company} variants={staggerItem}>
              <GlassCard
                variant="interactive"
                hoverEffect
                className="h-full p-8 relative overflow-hidden"
              >
                {/* Gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-10`} />
                
                {/* Animated glow orb */}
                <motion.div
                  className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${role.color} rounded-full blur-3xl opacity-30`}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.5,
                  }}
                />

                <div className="relative z-10">
                  {/* Header */}
                  <div className="mb-6">
                    <h3 className="text-3xl font-bold text-white mb-2">
                      {role.company}
                    </h3>
                    <p className="text-xl text-white/80 mb-1">{role.title}</p>
                    <p className="text-sm text-white/60">{role.period}</p>
                  </div>

                  {/* Highlights */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {role.highlights.map((highlight, i) => (
                      <div
                        key={i}
                        className="text-center p-3 rounded-lg bg-white/5 border border-white/10"
                      >
                        <div className="text-lg font-bold text-white">
                          {highlight}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {role.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full text-sm bg-white/10 border border-white/20 text-white"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CurrentRoles;
