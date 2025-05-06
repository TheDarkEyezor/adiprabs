"use client";
import { motion, useMotionValue, useTransform } from 'framer-motion';
import Link from 'next/link';
import React, { useState, MouseEvent } from 'react';
import ResumeHeader from '../components/resume/ResumeHeader';
import ExperienceCard from '../components/resume/ExperienceCard';
import EducationSection from '../components/resume/EducationSection';
import ProjectsGrid from '../components/resume/ProjectsGrid';
import SkillsSection from '../components/resume/SkillsSection';

// Animation variants for sections
const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

// Increased bubble count and added unique IDs
const initialBubbles = [
  { id: 1, size: 'w-10 h-10', left: '10%', duration: '15s', delay: '0s', depth: 0.1 },
  { id: 2, size: 'w-20 h-20', left: '20%', duration: '20s', delay: '3s', depth: 0.3 },
  { id: 3, size: 'w-8 h-8', left: '35%', duration: '12s', delay: '1s', depth: 0.2 },
  { id: 4, size: 'w-16 h-16', left: '50%', duration: '18s', delay: '5s', depth: 0.4 },
  { id: 5, size: 'w-12 h-12', left: '65%', duration: '22s', delay: '2s', depth: 0.15 },
  { id: 6, size: 'w-24 h-24', left: '80%', duration: '25s', delay: '7s', depth: 0.35 },
  { id: 7, size: 'w-6 h-6', left: '90%', duration: '10s', delay: '4s', depth: 0.05 },
  { id: 8, size: 'w-14 h-14', left: '5%', duration: '17s', delay: '6s', depth: 0.25 },
  { id: 9, size: 'w-18 h-18', left: '25%', duration: '23s', delay: '8s', depth: 0.1 },
  { id: 10, size: 'w-9 h-9', left: '55%', duration: '14s', delay: '9s', depth: 0.3 },
  { id: 11, size: 'w-22 h-22', left: '75%', duration: '28s', delay: '10s', depth: 0.2 },
];

export default function Resume() {
  // State to track popped bubbles by their ID
  const [poppedBubbles, setPoppedBubbles] = useState<Set<number>>(new Set());

  // Motion values for mouse position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Handle mouse move to update motion values
  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = event;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    // Normalize mouse position relative to the container center
    mouseX.set((clientX - left) / width - 0.5);
    mouseY.set((clientY - top) / height - 0.5);
  };

  // Handle bubble click
  const handleBubbleClick = (id: number) => {
    setPoppedBubbles(prev => new Set(prev).add(id));
    // Optional: Remove the bubble from the set after animation duration
    // setTimeout(() => {
    //   setPoppedBubbles(prev => {
    //     const next = new Set(prev);
    //     next.delete(id);
    //     return next;
    //   });
    // }, 500); // Match animation duration
  };

  return (
    <div
      className="bg-gradient-to-b from-indigo-900 via-purple-800 to-pink-700 min-h-screen text-white overflow-hidden relative"
      onMouseMove={handleMouseMove} // Track mouse movement on the main container
    >
      {/* Bubbles Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {initialBubbles.map((bubble) => {
          // Check if bubble is popped
          const isPopped = poppedBubbles.has(bubble.id);

          // Transform mouse position into bubble offset based on depth
          // Bubbles with higher depth move more
          const transformX = useTransform(mouseX, (v) => v * bubble.depth * 100); // Multiplier adjusts sensitivity
          const transformY = useTransform(mouseY, (v) => v * bubble.depth * 100);

          // Don't render if popped (or apply pop animation class)
          if (isPopped) return null; // Simple removal, or add class below

          return (
            <motion.div
              key={bubble.id}
              className={`absolute bottom-[-150px] ${bubble.size} bg-white/10 rounded-full animate-float cursor-pointer pointer-events-auto`} // Added cursor and pointer-events
              style={{
                left: bubble.left,
                animationDuration: bubble.duration,
                animationDelay: bubble.delay,
                // Apply the transformed mouse offsets
                translateX: transformX,
                translateY: transformY,
              }}
              onClick={() => handleBubbleClick(bubble.id)}
              // Example with pop class instead of removing:
              // className={`absolute bottom-[-150px] ${bubble.size} bg-white/10 rounded-full ${isPopped ? 'animate-pop' : 'animate-float'} cursor-pointer pointer-events-auto`}
              // whileTap={{ scale: 0.8 }} // Optional: visual feedback on click
            />
          );
        })}
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-12 relative z-10" // Ensure content is above bubbles
      >
        <Link href="/" className="text-blue-300 hover:text-blue-100 hover:underline mb-6 inline-block transition-colors duration-300">
          &larr; Back to Home
        </Link>

        <ResumeHeader />

        <motion.section
          className="mb-16"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-3xl font-bold mb-8 text-yellow-300">Work Experience</h2>
          <div className="space-y-8">
            <motion.div whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 300 }}>
              <ExperienceCard
                title="CTO"
                company="StealthAI"
                period="December 2024 – Present"
                details={[
                  "Created web-application to chat with LLM agents to collate data for lawyers easily to assist with consultation. Solved a major problem that 68% of surveyed paralegals encountered.",
                  "Full-stack development of website and backend using React and Python respectively.",
                  "Utilised latest research papers to build system, resulting in reduced hallucination and more accurate questions asked to users, grounded in proven knowledge.",
                  "Used Knowledge Augmented Generation, a newer generation of Retrieval Augmented Generation."
                ]}
              />
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 300 }}>
              <ExperienceCard
                title="Machine Learning Developer"
                company="Trajex"
                period="October 2024 – Present"
                details={[
                  "Successful deployment of LLama3.2-7b-Instruct resulting in a 12% reduction in latency and 20% in cost for OpenAI API calls.",
                  "Leadership in core development of flagship product, ensuring they meet user needs and expectations.",
                  "Strong product design and iteration skills, informed by feedback from stakeholders.",
                  "Experience in effective pitching and communication towards investors, resulting in onboarding of K3 Capital Group as a client."
                ]}
              />
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 300 }}>
              <ExperienceCard
                title="Machine Learning Engineer (Contractor)"
                company="Altus Reach"
                period="Jan 2024 – October 2024"
                details={[
                  "Developed a machine learning algorithm with a team of 3 that improved predictive accuracy by 19% in video saliency detection.",
                  "Worked with team to deploy a cloud-based infrastructure that supports our flagship product. (Microsoft Azure)",
                  "Engaged in full-stack development to improve the appearance of company website and its functionality. (JavaScript, TypeScript, React, NextJS)"
                ]}
              />
            </motion.div>
          </div>
        </motion.section>

        <motion.div variants={sectionVariants} initial="hidden" animate="visible">
          <EducationSection />
        </motion.div>

        {/* TODO: Modify ProjectsGrid component to accept all projects and implement internal state for a 'Show More/Less' button */}
        <motion.div variants={sectionVariants} initial="hidden" animate="visible">
          <ProjectsGrid />
        </motion.div>

        <motion.div variants={sectionVariants} initial="hidden" animate="visible">
          <SkillsSection />
        </motion.div>
      </motion.div>
    </div>
  );
}