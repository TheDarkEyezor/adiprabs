'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import GlassCard from '../common/GlassCard';
import SectionHeading from '../common/SectionHeading';
import AnimatedButton from '../common/AnimatedButton';
import { staggerContainer, staggerItem } from '@/utils/animations';
import { TransitionLink } from '../transitions/TransitionLink';

const LatestWork: React.FC = () => {
  const projects = [
    {
      title: 'VaNI MedTech Platform',
      description: 'Full-stack healthcare platform with AI-powered diagnostics, achieving 99.9% uptime and 120ms response time.',
      tags: ['React', 'TypeScript', 'Next.js', 'FastAPI', 'AWS'],
      impact: ['99.9% uptime', '120ms latency', '76% fewer bugs'],
      gradient: 'from-[#FF6B6B] to-[#FEC601]',
      featured: true,
    },
    {
      title: 'Trajex AI Solutions',
      description: 'Deployed LLama3.2 models for K3 Capital, reducing costs by 20% while improving processing speed by 12%.',
      tags: ['LLama3.2', 'Python', 'ML/AI', 'Product Design'],
      impact: ['20% cost reduction', '12% faster', 'Enterprise client'],
      gradient: 'from-[#4A90E2] to-[#8B5CF6]',
      featured: true,
    },
    {
      title: 'Altus Reach AI Platform',
      description: 'Enhanced sales intelligence with Azure AI, achieving 19% accuracy improvement and 8% faster processing.',
      tags: ['Azure AI', 'TypeScript', 'Python', 'CI/CD'],
      impact: ['19% accuracy boost', '8% faster', 'Azure Cloud'],
      gradient: 'from-[#52B788] to-[#00F5FF]',
      featured: false,
    },
  ];

  return (
    <section className="py-20 px-8 relative">
      <div className="max-w-7xl mx-auto">
        <SectionHeading 
          align="center" 
          gradient
          subtitle="Recent projects that push the boundaries of web and AI technology"
        >
          Latest Work
        </SectionHeading>

        <motion.div
          className="space-y-8"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {/* Featured Project */}
          <motion.div variants={staggerItem}>
            <GlassCard
              variant="interactive"
              hoverEffect
              className="p-8 md:p-12 relative overflow-hidden"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${projects[0].gradient} opacity-10`} />
              
              {/* Animated Orbs */}
              <motion.div
                className={`absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br ${projects[0].gradient} rounded-full blur-3xl`}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                }}
              />

              <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-[#FF6B6B] to-[#FEC601] text-white text-sm font-medium mb-4">
                    <Star size={16} fill="currentColor" />
                    Featured Project
                  </div>
                  <h3 className="text-4xl font-bold text-white mb-4">
                    {projects[0].title}
                  </h3>
                  <p className="text-lg text-white/80 mb-6">
                    {projects[0].description}
                  </p>
                  
                  {/* Impact Metrics */}
                  <div className="flex flex-wrap gap-4 mb-6">
                    {projects[0].impact.map((metric) => (
                      <div
                        key={metric}
                        className="px-4 py-2 rounded-lg bg-white/10 border border-white/20"
                      >
                        <span className="text-white font-semibold">{metric}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <AnimatedButton variant="primary">
                      View Case Study
                    </AnimatedButton>
                    <AnimatedButton variant="secondary">
                      Live Demo
                    </AnimatedButton>
                  </div>
                </div>

                <div className="relative">
                  {/* Tech Stack */}
                  <div className="glass-card p-6">
                    <h4 className="text-sm uppercase tracking-wide text-white/60 mb-4">
                      Tech Stack
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {projects[0].tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-2 rounded-lg bg-gradient-to-r from-white/10 to-white/5 border border-white/20 text-white font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Other Projects Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {projects.slice(1).map((project, ) => (
              <motion.div key={project.title} variants={staggerItem}>
                <GlassCard
                  variant="interactive"
                  hoverEffect
                  className="p-6 h-full relative overflow-hidden group"
                >
                  {/* Gradient Accent */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${project.gradient}`} />
                  <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-white mb-3">
                      {project.title}
                    </h3>
                    <p className="text-white/80 mb-4">
                      {project.description}
                    </p>

                    {/* Impact Metrics */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {project.impact.map((metric) => (
                        <div
                          key={metric}
                          className="text-center p-2 rounded bg-white/5 border border-white/10"
                        >
                          <span className="text-xs text-white/90">{metric}</span>
                        </div>
                      ))}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/80"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <AnimatedButton variant="secondary" size="sm" fullWidth>
                      Learn More
                    </AnimatedButton>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* View All Projects CTA */}
          <motion.div 
            variants={staggerItem}
            className="text-center pt-8"
          >
            <TransitionLink href="/projects">
              <AnimatedButton variant="outline" size="lg">
                View All Projects →
              </AnimatedButton>
            </TransitionLink>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default LatestWork;
