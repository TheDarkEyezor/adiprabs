'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, Briefcase, GraduationCap, Users, Trophy } from 'lucide-react';
import { TransitionLink } from '../components/transitions/TransitionLink';
import Navbar from '../components/Navbar';
import ParticleField from '../components/effects/ParticleField';
import SectionHeading from '../components/common/SectionHeading';
import GlassCard from '../components/common/GlassCard';
import { staggerContainer, staggerItem } from '@/utils/animations';

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  category: 'work' | 'education' | 'leadership' | 'achievement';
  icon: typeof Briefcase;
  color: string;
}

const timelineData: TimelineEvent[] = [
  {
    date: "Jun 2025 - Present",
    title: "VaNI MedTech - Full-stack & AI/ML Developer",
    description: "Building AI-powered healthcare platform with 120ms latency, 99.9% uptime. React, TypeScript, Next.js, FastAPI, AWS, Kubernetes. Reduced bugs by 76%.",
    category: 'work',
    icon: Briefcase,
    color: 'from-[#FF6B6B] to-[#FEC601]'
  },
  {
    date: "Oct 2024 - Present",
    title: "Trajex - Machine Learning Developer",
    description: "Deployed LLama3.2 models for K3 Capital client. 20% cost reduction, 12% faster processing vs OpenAI. Core product development and investor pitching.",
    category: 'work',
    icon: Briefcase,
    color: 'from-[#FEC601] to-[#52B788]'
  },
  {
    date: "Jan 2024 - Oct 2024",
    title: "Altus Reach - ML Engineer (Contractor)",
    description: "19% accuracy improvement in video saliency detection. Full-stack: JS, TS, React, NextJS. Azure cloud infrastructure. Team of 3 developers.",
    category: 'work',
    icon: Briefcase,
    color: 'from-[#52B788] to-[#4A90E2]'
  },
  {
    date: "Oct 2023 - Present",
    title: "Imperial College London - Computing",
    description: "Currently pursuing BSc in Computing with focus on AI/ML, Systems Programming, and Software Engineering. Expected graduation: July 2027.",
    category: 'education',
    icon: GraduationCap,
    color: 'from-[#4A90E2] to-[#8B5CF6]'
  },
  {
    date: "Sep 2019 - Mar 2021",
    title: "#8235 Beyond the Flames - FRC Team Leader",
    description: "Led 20-student robotics team for FIRST Robotics Competition. Designed robots with Fusion 360, coded autonomous control in Java/Python. Won international challenges and earned Dean's List nomination.",
    category: 'leadership',
    icon: Users,
    color: 'from-[#8B5CF6] to-[#FF10F0]'
  },
  {
    date: "Feb 2021 - Mar 2023",
    title: "HelpIGCSE - Head of Marketing",
    description: "Led marketing for non-profit helping students with IGCSE/SAT exams. 25% blog engagement increase, 200% Instagram boost. Grew to 12,750+ students (80% increase).",
    category: 'leadership',
    icon: Users,
    color: 'from-[#FF10F0] to-[#00F5FF]'
  },
  {
    date: "Jul 2020 - Mar 2023",
    title: "DamnIQ Bionics - Co-Founder",
    description: "Co-founded startup focused on affordable prosthetics using 3D printing. Tackled legal, health, and logistical challenges. Developed adaptability and project management skills.",
    category: 'leadership',
    icon: Users,
    color: 'from-[#00F5FF] to-[#52B788]'
  },
  {
    date: "Jun 2022 - Jun 2023",
    title: "Robotics Club at NPSI - Founder",
    description: "Founded robotics club to inspire STEM students. Established frameworks for international competitions. Secured resources from school staff and alumni.",
    category: 'leadership',
    icon: Users,
    color: 'from-[#52B788] to-[#FEC601]'
  },
  {
    date: "May 2022 - Aug 2022",
    title: "HCIS - Intern",
    description: "Healthcare tech project for elderly fall-detection. Developed infrared-based solutions emphasizing data privacy. Drafted government grant proposal.",
    category: 'work',
    icon: Briefcase,
    color: 'from-[#FEC601] to-[#FF6B6B]'
  },
  {
    date: "Jan 2011 - Jan 2021",
    title: "NPS International School",
    description: "Completed IGCSE and IB Diploma Programme. Built foundation in STEM, leadership, and international collaboration.",
    category: 'education',
    icon: GraduationCap,
    color: 'from-[#FF6B6B] to-[#4A90E2]'
  },
];

export default function JourneyPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { value: 'all', label: 'All', icon: Sparkles },
    { value: 'work', label: 'Work', icon: Briefcase },
    { value: 'education', label: 'Education', icon: GraduationCap },
    { value: 'leadership', label: 'Leadership', icon: Users },
    { value: 'achievement', label: 'Achievements', icon: Trophy },
  ];

  const filteredEvents = selectedCategory === 'all'
    ? timelineData
    : timelineData.filter(event => event.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white overflow-x-hidden">
      <ParticleField count={40} />
      
      {/* Fixed gradient orbs */}
      <motion.div
        className="fixed top-20 -left-40 w-96 h-96 bg-gradient-to-br from-[#FEC601]/30 to-[#52B788]/30 rounded-full blur-3xl pointer-events-none"
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
        className="fixed bottom-20 -right-40 w-96 h-96 bg-gradient-to-br from-[#8B5CF6]/30 to-[#FF10F0]/30 rounded-full blur-3xl pointer-events-none"
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

      <div className="relative z-10 px-8 py-12 max-w-6xl mx-auto">
        {/* Header */}
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

          <SectionHeading 
            align="left" 
            gradient
            subtitle="From robotics competitions to AI/ML development - a journey of continuous learning and innovation"
          >
            My Journey
          </SectionHeading>

          {/* Category Filter */}
          <div className="mt-8 flex flex-wrap gap-3">
            {categories.map(category => (
              <motion.button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                  selectedCategory === category.value
                    ? 'bg-gradient-to-r from-[#FF6B6B] to-[#FEC601] text-white'
                    : 'glass-card text-white/80 hover:text-white hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <category.icon size={18} className="mr-2" />
                {category.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#FF6B6B] via-[#52B788] to-[#8B5CF6]" />

          <motion.div
            className="space-y-12"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <AnimatePresence mode="popLayout">
              {filteredEvents.map((event, index) => {
                const Icon = event.icon;
                return (
                  <motion.div
                    key={`${event.date}-${event.title}`}
                    variants={staggerItem}
                    layout
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50, transition: { duration: 0.2 } }}
                    transition={{ delay: index * 0.05 }}
                    className="relative flex gap-8 items-start"
                  >
                    {/* Icon */}
                    <motion.div
                      className={`relative z-10 w-16 h-16 rounded-full bg-gradient-to-br ${event.color} flex items-center justify-center flex-shrink-0`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Icon className="text-white" size={28} />
                    </motion.div>

                    {/* Content */}
                    <GlassCard
                      variant="interactive"
                      hoverEffect
                      className="flex-1 overflow-hidden group"
                    >
                      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${event.color} rounded-t-2xl`} />
                      
                      <div className="relative p-6 pt-8">
                        <div className="text-sm text-white/60 mb-2 font-mono">
                          {event.date}
                        </div>
                        <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#FF6B6B] group-hover:to-[#FEC601] transition-all">
                          {event.title}
                        </h3>
                        <p className="text-white/80 leading-relaxed">
                          {event.description}
                        </p>
                      </div>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {[
            { label: 'Years Experience', value: '3+', gradient: 'from-[#FF6B6B] to-[#FEC601]' },
            { label: 'Projects', value: '15+', gradient: 'from-[#FEC601] to-[#52B788]' },
            { label: 'Leadership Roles', value: '10+', gradient: 'from-[#52B788] to-[#4A90E2]' },
            { label: 'Students Impacted', value: '12K+', gradient: 'from-[#4A90E2] to-[#8B5CF6]' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="p-6 text-center">
                <div className={`text-4xl font-bold mb-2 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                  {stat.value}
                </div>
                <div className="text-sm text-white/60">
                  {stat.label}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
