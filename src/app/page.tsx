// Homepage

"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Github, Linkedin, Mail } from 'lucide-react';
import Link from 'next/link';
import Navbar from './components/Navbar';

const skills = [
  { name: 'JavaScript', icon: '🟨', description: 'Proficient in modern JavaScript, including ES6+ features.' },
  { name: 'React', icon: '⚛️', description: 'Experienced in building complex UIs with React and its ecosystem.' },
  { name: 'Node.js', icon: '🟩', description: 'Skilled in server-side JavaScript with Node.js.' },
  { name: 'Python', icon: '🐍', description: 'Proficient in Python for various applications and data analysis.' },
  { name: 'SQL', icon: '🗃️', description: 'Experienced in database design and complex queries.' },
  { name: 'Git', icon: '🌿', description: 'Proficient in version control and collaborative development.' },
  { name: 'Docker', icon: '🐳', description: 'Experienced in containerization and deployment.' },
  { name: 'AWS', icon: '☁️', description: 'Skilled in cloud computing and serverless architectures.' },
  { name: 'TypeScript', icon: '🔷', description: 'Proficient in static typing and advanced JavaScript features.' },
  { name: 'GraphQL', icon: '🔗', description: 'Experienced in building and consuming GraphQL APIs.' },
];

const certifications = [
  { name: 'AWS Certified Developer', icon: '🏆', description: 'Amazon Web Services Certified Developer - Associate' },
  { name: 'MCSD', icon: '🖥️', description: 'Microsoft Certified Solutions Developer' },
  { name: 'Google Cloud Certified', icon: '☁️', description: 'Professional Cloud Architect' },
];

const HomePage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [heroMousePosition, setHeroMousePosition] = useState({ x: 0, y: 0 });
  const [activeSkill, setActiveSkill] = useState(null);
  const [typedText, setTypedText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isProjectsHovered, setIsProjectsHovered] = useState(false);
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(false);
  const [isProjectsLoaded, setIsProjectsLoaded] = useState(false);
  const [isBooklistHovered, setIsBooklistHovered] = useState(false);
  const [isBooklistExpanded, setIsBooklistExpanded] = useState(false);
  const [isBooklistLoaded, setIsBooklistLoaded] = useState(false);
  const skillsRef = useRef(null);
  const mouseTrailRef = useRef([]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      mouseTrailRef.current = [...mouseTrailRef.current.slice(-5), { x: e.clientX, y: e.clientY }];
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const text = '$ npm run dev\n> Building webpage...\n> Webpage built successfully!';
    let i = 0;
    const typing = setInterval(() => {
      setTypedText(text.slice(0, i));
      i++;
      if (i > text.length) {
        clearInterval(typing);
        setTimeout(() => setIsLoading(false), 1000);
      }
    }, 50);

    return () => clearInterval(typing);
  }, []);

  const gradientStyle = {
    background: `
      ${mouseTrailRef.current.map((pos, index) => 
        `radial-gradient(circle at ${pos.x}px ${pos.y}px, rgba(82, 183, 136, ${0.2 * (index + 1) / mouseTrailRef.current.length}), transparent ${50 * (index + 1)}px)`
      ).join(', ')},
      #33658A
    `,
  };

  const heroGradientStyle = {
    background: `radial-gradient(circle at ${100 - heroMousePosition.x}% ${100 - heroMousePosition.y}%, #FF6B6B, #FEC601)`,
  };

  const handleHeroMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setHeroMousePosition({ x, y });
  };

  const renderSkillsTrack = (items, offset) => (
    <div className="flex" style={{ transform: `translateX(${offset}px)` }}>
      {[...items, ...items].map((item, index) => (
        <motion.div
          key={index}
          className="flex-shrink-0 w-32 h-32 m-2 bg-[#52B788] rounded-lg flex items-center justify-center text-4xl cursor-pointer relative x-50%"
          whileHover={{ scale: 1.2, zIndex: 10 }}
          onHoverStart={() => setActiveSkill(item)}
          onHoverEnd={() => setActiveSkill(null)}
        >
          <span className="skill-icon">{item.icon}</span>
          <AnimatePresence>
            {activeSkill === item && (
              <motion.div
                className="absolute inset-0 bg-white bg-opacity-90 p-2 rounded-lg flex flex-col justify-center items-center text-black"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p className="text-sm font-bold">{item.name}</p>
                <p className="text-xs mt-1">{item.description}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );

  const projectsCardVariants = {
    hover: (mousePosition) => ({
      rotateX: (mousePosition.y - 0.5) * 10,
      rotateY: (mousePosition.x - 0.5) * 10,
    }),
  };

  return (
    <AnimatePresence>
      {isLoading ? (
        <motion.div
          className="fixed inset-0 bg-black flex items-center justify-center"
          exit={{ opacity: 0 }}
          key="loading"
        >
          <pre className="text-green-400 font-mono">
            {typedText}
            <span className="animate-blink">|</span>
          </pre>
        </motion.div>
      ) : (
        <motion.div
          className="min-h-screen flex flex-col font-['Roboto', sans-serif]"
          style={gradientStyle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          key="content"
        >
          <Navbar/>
          <main className="flex-grow">
            <motion.section 
              className="hero text-white p-8 rounded-lg shadow-lg m-8 overflow-hidden"
              style={heroGradientStyle}
              onMouseMove={handleHeroMouseMove}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h1 className="text-4xl font-bold mb-4">Your Name</h1>
              <p className="text-xl">A short bio about yourself. Highlight your key skills and passion for coding.</p>
            </motion.section>

            <div className="skills-banner overflow-hidden my-8 relative" ref={skillsRef}>
              <div className="parallax-bg" style={{ backgroundImage: 'url("/path-to-your-background-image.jpg")', backgroundAttachment: 'fixed' }} />
              {renderSkillsTrack(skills, 0)}
              {renderSkillsTrack(certifications, -160)}
            </div>

            <Link href="/projects" passHref>
              <motion.div
                className="projects-card bg-[#FF6B6B] text-white p-8 rounded-lg shadow-lg m-8 cursor-pointer"
                whileHover={{ rotateZ: 1, scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                onHoverStart={() => setIsProjectsHovered(true)}
                onHoverEnd={() => setIsProjectsHovered(false)}
              >
                <h2 className="text-2xl font-bold mb-4">Projects</h2>
                <AnimatePresence>
                  {isProjectsHovered && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-lg"
                    >
                      Click to explore my portfolio of projects, showcasing my skills and experiences in web development, data analysis, and more.
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>

            <motion.div
              className="booklist-card bg-[#52B788] text-white p-8 rounded-lg shadow-lg m-8 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              onClick={() => {
                setIsBooklistExpanded(true);
                setTimeout(() => setIsBooklistLoaded(true), 2000);
              }}
              onHoverStart={() => setIsBooklistHovered(true)}
              onHoverEnd={() => setIsBooklistHovered(false)}
            >
              <h2 className="text-2xl font-bold mb-4">Booklist</h2>
              <AnimatePresence>
                {isBooklistHovered && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-lg"
                  >
                    Explore my curated booklist, featuring my favorite reads and recommendations across various genres and topics.
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          </main>

          <footer className="bg-[#040303] text-white p-4 mt-auto">
            <div className="flex justify-center space-x-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Github className="w-6 h-6 hover:text-[#FF6B6B]" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <Linkedin className="w-6 h-6 hover:text-[#FF6B6B]" />
              </a>
              <a href="mailto:your.email@example.com">
                <Mail className="w-6 h-6 hover:text-[#FF6B6B]" />
              </a>
            </div>
          </footer>

          <AnimatePresence>
            {isProjectsExpanded && (
              <motion.div
                className="fixed inset-0 bg-[#FF6B6B] text-white overflow-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Projects onClose={() => setIsProjectsExpanded(false)} />
              </motion.div>
            )}
          </AnimatePresence>


          <AnimatePresence>
            {isBooklistExpanded && (
              <motion.div
                className="fixed inset-0 bg-[#52B788] text-white p-8 overflow-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {isBooklistLoaded ? (
                  <motion.div className="grid grid-cols-4 gap-4">
                    {[...Array(16)].map((_, index) => (
                      <motion.div
                        key={index}
                        className="bg-white h-40 rounded-lg"
                        initial={{ rotateY: 180 }}
                        animate={{ rotateY: 0 }}
                        transition={{ delay: index * 0.1 }}
                      />
                    ))}
                  </motion.div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-2xl">Loading booklist...</p>
                  </div>
                )}
                <button
                  className="absolute top-4 right-4 text-2xl"
                  onClick={() => {
                    setIsBooklistExpanded(false);
                    setIsBooklistLoaded(false);
                  }}
                >
                  &times;
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HomePage;