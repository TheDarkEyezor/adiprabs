// Homepage

"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, animate } from 'framer-motion';
import { Github, Linkedin, Mail, Instagram } from 'lucide-react';
import Navbar from './components/Navbar';
import Projects from './components/Projects';
import Timeline from './components/Timeline';
import Booklist from './components/Booklist';
import { useMotionValue} from 'framer-motion';
import Image from 'next/image';
import Contact from './components/Contact';
import Card from './components/Card';
import useMeasure from "react-use-measure"
import { TransitionLink } from './components/TransitionLink';


interface Bounds {
  left: number;
  top: number;
  width: number;
  height: number;
}


const skills = [
  { name: 'TypeScript', icon: '/icons/ts.png', description: 'Proficient in modern JavaScript, including ES6+ features.' },
  { name: 'React', icon: '/icons/react.png', description: 'Experienced in building complex UIs with React and its ecosystem.' },
  { name: 'Kotlin', icon: '/icons/kt.png', description: 'Experienced in OOP and building applications' },
  { name: 'Java', icon: '/icons/java.png', description: 'Experienced in Java semantics and debugging' },
  { name: 'Python', icon: '/icons/py.png', description: 'Proficient in Python for various applications and data analysis.' },
  { name: 'SQL', icon: '/icons/sql.png', description: 'Experienced in database design and complex queries.' },
  { name: 'Git', icon: '/icons/git.png', description: 'Proficient in version control and collaborative development.' },
  { name: 'Haskell', icon: '/icons/hs.png', description: 'Proficient in functional programming.' },
];

const HomePage: React.FC = () => {
  const [hasMounted, setHasMounted] = useState(false); // Track if the component has mounted
  const [, setMousePosition] = useState({ x: 0, y: 0 });
  const [heroMousePosition, setHeroMousePosition] = useState({ x: 0, y: 0 });
  const [isBooklistExpanded, ] = useState(false);
  const [isContactExpanded, setIsContactExpanded] = useState(false);
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(false);
  const mouseTrailRef = useRef<{ x: number; y: number }[]>(
    typeof window !== 'undefined'
      ? [
          { x: window.innerWidth / 2, y: window.innerHeight / 2 },
          { x: window.innerWidth / 2, y: window.innerHeight / 2 },
          { x: window.innerWidth / 2, y: window.innerHeight / 2 },
        ]
      : [
          { x: 0, y: 0 },
          { x: 0, y: 0 },
          { x: 0, y: 0 },
        ]
  );
  const [isTimelineExpanded, setIsTimelineExpanded] = useState(false);
  const projectCardRef = useRef<HTMLDivElement | null>(null);
  const timelineCardRef = useRef<HTMLDivElement | null>(null);
  const [projectCardBounds, setProjectCardBounds] = useState<Bounds | null>(null);
  const [timelineCardBounds, setTimelineCardBounds] = useState<Bounds | null>(null);

  useEffect(() => {
    if (projectCardRef.current && timelineCardRef.current) {
      const projectRect = projectCardRef.current.getBoundingClientRect();
      const timelineRect = timelineCardRef.current.getBoundingClientRect();
      setProjectCardBounds({
        left: projectRect.left,
        top: projectRect.top,
        width: projectRect.width,
        height: projectRect.height,
      });
      setTimelineCardBounds({
        left: timelineRect.left,
        top: timelineRect.top,
        width: timelineRect.width,
        height: timelineRect.height,
      });
    }
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      mouseTrailRef.current = [...mouseTrailRef.current.slice(-5), { x: e.clientX, y: e.clientY }];
    };

    // Set initial positions based on window size on mount
    if (typeof window !== 'undefined') {      
      mouseTrailRef.current = Array(5).fill({ 
        x: window.innerWidth / 2, 
        y: window.innerHeight / 2 
      });
  
      window.addEventListener('mousemove', handleMouseMove);
  
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, []);

  useEffect(() => {
    setHasMounted(true); // Set the flag to true after the component has mounted
  }, []);

  const gradientStyle = hasMounted
    ? {
        background: mouseTrailRef.current.length > 0 
          ? `
            ${mouseTrailRef.current.map((pos, index) => 
              `radial-gradient(circle at ${pos.x}px ${pos.y}px, rgba(82, 183, 136, ${0.2 * (index + 1) / mouseTrailRef.current.length}), transparent ${50 * (index + 1)}px)`
            ).join(', ')},
            #33658A
          `
          : '#33658A', // Fallback solid color when no mouse positions are available
      }
    : {}; // Empty style during SSR to avoid mismatch

  const heroGradientStyle = hasMounted
    ? {
        background: `radial-gradient(circle at ${100 - heroMousePosition.x}% ${100 - heroMousePosition.y}%, #FF6B6B, #FEC601)`,
      }
    : {}; // Empty style during SSR to avoid mismatch

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setHeroMousePosition({ x, y });
  };

  useEffect(() => {
    if (projectCardRef.current) {
      const rect = projectCardRef.current.getBoundingClientRect();
      setProjectCardBounds({
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      });
    }
  }, []);

  const [ref, {width}] = useMeasure();

  const xTranslation = useMotionValue(0);
  const FastDuration = 25;
  const SlowDuration = 75;


  const [duration, setDuration] = useState(FastDuration)
  const [mustFinish, setMustFinish] = useState(false) ;
  const [rerender, setRerender] = useState(false);

  useEffect(()=> {
    let controls;
    const finalPosition = -width/2 - 8;

    if (mustFinish) {
      controls = animate( xTranslation, [xTranslation.get(), finalPosition], {
        ease: 'linear',
        duration: duration * (1 - xTranslation.get() / finalPosition),
        onComplete: () => {
          setMustFinish(false)
          setRerender(!rerender)
        }
      });

    } else  {
      controls = animate( xTranslation, [0, finalPosition], {
        ease: 'linear',
        duration: duration,
        repeat: Infinity,
        repeatType: 'loop',
        repeatDelay: 0,
      });

    }

    return controls.stop
  }, [xTranslation, width, duration, rerender, mustFinish]);

  useEffect(() => {
    const body = document.body;

    if (isProjectsExpanded || isTimelineExpanded || isBooklistExpanded || isContactExpanded) {
      body.classList.add('overflow-hidden'); // Disable scrolling
    } else {
      body.classList.remove('overflow-hidden'); // Enable scrolling
    }

    return () => {
      body.classList.remove('overflow-hidden'); // Cleanup on unmount
    };
  }, [isProjectsExpanded, isTimelineExpanded, isBooklistExpanded, isContactExpanded]);

  return (
    <motion.div
      className="min-h-screen flex flex-col font-['Roboto', sans-serif] relative overflow-hidden"
      style={gradientStyle}
      initial={{ opacity: 0 }} // Keep initial opacity for fade-in
      animate={{ opacity: 1 }}
      key="content"
    >
      {/* Animated background particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      
      <Navbar/>
      <main className="flex-grow relative z-10">
        <motion.section 
          className="hero text-white p-8 rounded-2xl shadow-2xl m-8 overflow-hidden flex items-center glass-card relative border-2 border-white/20"
          style={heroGradientStyle}
          onMouseMove={handleHeroMouseMove}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Shimmer effect overlay */}
          <div className="absolute inset-0 shimmer opacity-30 pointer-events-none" />
          
          <div className="flex-1 pr-8 relative z-10">
            <motion.h1 
              className="text-4xl font-bold mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Hey there! Nice to meet you
            </motion.h1>
            <motion.p 
              className="text-xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              My name is Adi Prabs, but I often go by Adi. I&apos;m studying CS at Imperial College London. I&apos;m always looking for an exciting new project to dip my feet into because, as they often say with coding, projects are the best way to learn! Below, you can find more information on my skills, the projects I&apos;ve participated in, my journey in STEM and my current leading in. <br/> (This website is being actively developed, so if you spot any bugs, please do drop me a message using the contact button below)
            </motion.p>
          </div>
          <motion.div 
            className="flex-shrink-0 w-48 h-48 rounded-full overflow-hidden border-4 border-white/30 shadow-2xl relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
            whileHover={{ 
              scale: 1.1, 
              borderColor: "rgba(255, 255, 255, 0.6)",
              boxShadow: "0 0 40px rgba(255, 255, 255, 0.5)"
            }}
          >
            <Image
              src="/picc.jpg"
              alt="Your Name"
              width={192}
              height={192}
              objectFit="cover"
            />
          </motion.div>
        </motion.section>

        {/* Wrap the skills track in a div with overflow-hidden and max-w-full */}
        <div className="m-8 overflow-hidden max-w-full"> {/* Added max-w-full */}
          <motion.div 
            className='relative left-0 flex gap-4 z-10'
            ref={ref} 
            style={{x:xTranslation}}
            onHoverStart={() => {
              setMustFinish(true);
              setDuration(SlowDuration);
            }}
            onHoverEnd={() => {
              setMustFinish(true);
              setDuration(FastDuration);
            }}
            >
            {[...skills, ...skills].map((item, idx) => (
              <Card image={item.icon} key={idx} description={item.description} name={item.name}/>
            ))}
          </motion.div>
        </div>

        <div className="flex flex-col md:flex-row justify-between m-8 space-y-8 md:space-y-0 md:space-x-8">
          {/* Projects Card */}
          <div className="flex-1">
            <motion.div
              ref={projectCardRef}
              className="projects-card glass-card text-white p-8 rounded-2xl shadow-2xl cursor-pointer h-full relative overflow-hidden border-2 border-[#FF6B6B]/30"
              style={{
                background: 'linear-gradient(135deg, #FF6B6B 0%, #FE8C8C 100%)',
              }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 40px rgba(255, 107, 107, 0.6), 0 20px 60px rgba(0, 0, 0, 0.3)"
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {/* Animated corner accents */}
              <motion.div 
                className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <TransitionLink href='/projects'>
                <div className="block w-full h-full relative z-10">
                  <h2 className="text-2xl font-bold mb-4">Projects</h2>
                  <p className="text-lg">Explore my portfolio of projects, showcasing my skills in web development, data analysis, and more.</p>
                </div>
              </TransitionLink>
            </motion.div>
          </div>

          {/* Timeline Card */}
          <div className="flex-1">
            <motion.div
              ref={timelineCardRef}
              className="timeline-card glass-card text-gray-800 p-8 rounded-2xl shadow-2xl cursor-pointer h-full relative overflow-hidden border-2 border-[#FEC601]/30"
              style={{
                background: 'linear-gradient(135deg, #FEC601 0%, #FFD700 100%)',
              }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 40px rgba(254, 198, 1, 0.6), 0 20px 60px rgba(0, 0, 0, 0.3)"
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <motion.div 
                className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              />
              <TransitionLink href='/journey'>
                <div className="block w-full h-full relative z-10">
                  <h2 className="text-2xl font-bold mb-4">My Journey</h2>
                  <p className="text-lg">Discover my professional timeline and key milestones in my career.</p>
                </div>
              </TransitionLink>
            </motion.div>
          </div>
        </div>

        {/* Update Resume Card to be a link */}
        <motion.div
          className="resume-card glass-card text-white p-8 rounded-2xl shadow-2xl m-8 cursor-pointer relative overflow-hidden border-2 border-purple-500/30"
          style={{
            background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
          }}
          whileHover={{ 
            scale: 1.02,
            boxShadow: "0 0 40px rgba(139, 92, 246, 0.6), 0 20px 60px rgba(0, 0, 0, 0.3)"
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div 
            className="absolute top-1/2 left-1/2 w-48 h-48 bg-white/10 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
              x: [-96, -96],
              y: [-96, -96]
            }}
            transition={{ duration: 5, repeat: Infinity }}
          />
          <TransitionLink href='/resume'>
            <div className="block w-full h-full relative z-10">
              <h2 className="text-2xl font-bold mb-4">Resume</h2>
              <p className="text-lg">
                View my professional resume detailing my experience, skills, and education.
              </p>
            </div>
          </TransitionLink>
        </motion.div>

        <motion.div
          className="booklist-card glass-card text-white p-8 rounded-2xl shadow-2xl m-8 cursor-pointer relative overflow-hidden border-2 border-[#52B788]/30"
          style={{
            background: 'linear-gradient(135deg, #52B788 0%, #74C69D 100%)',
          }}
          whileHover={{ 
            scale: 1.02,
            boxShadow: "0 0 40px rgba(82, 183, 136, 0.6), 0 20px 60px rgba(0, 0, 0, 0.3)"
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div 
            className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.4, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          <TransitionLink href='/booklist'>
            <div className="block w-full h-full relative z-10">
              <h2 className="text-2xl font-bold mb-4">Booklist</h2>
              <p className="text-lg">
                Explore my curated booklist, featuring my favorite reads and recommendations across various genres and topics.
              </p>
            </div>
          </TransitionLink>
        </motion.div>

        <motion.div
          className="contact-card glass-card text-white p-8 rounded-2xl shadow-2xl m-8 cursor-pointer relative overflow-hidden border-2 border-[#4A90E2]/30"
          style={{
            background: 'linear-gradient(135deg, #4A90E2 0%, #5AA3F0 100%)',
          }}
          whileHover={{ 
            scale: 1.02,
            boxShadow: "0 0 40px rgba(74, 144, 226, 0.6), 0 20px 60px rgba(0, 0, 0, 0.3)"
          }}
          onClick={() => setIsContactExpanded(true)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div 
            className="absolute bottom-0 left-1/3 w-40 h-40 bg-white/10 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
          />
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-4">Contact Me</h2>
            <p className="text-lg">
              Have a question or want to collaborate? Get in touch with me!
            </p>
          </div>
        </motion.div>
      </main>

      <footer className="glass-dark text-white p-6 mt-auto border-t border-white/10 relative z-10">
        <motion.div 
          className="flex justify-center space-x-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.a 
            href="https://github.com/TheDarkEyezor" 
            target="_blank" 
            rel="noopener noreferrer"
            whileHover={{ 
              scale: 1.2, 
              rotate: 5,
              filter: "drop-shadow(0 0 10px rgba(255, 107, 107, 0.8))"
            }}
            whileTap={{ scale: 0.9 }}
          >
            <Github className="w-6 h-6 hover:text-[#FF6B6B] transition-colors" />
          </motion.a>
          <motion.a 
            href="https://www.linkedin.com/in/adiprabs/" 
            target="_blank" 
            rel="noopener noreferrer"
            whileHover={{ 
              scale: 1.2, 
              rotate: -5,
              filter: "drop-shadow(0 0 10px rgba(74, 144, 226, 0.8))"
            }}
            whileTap={{ scale: 0.9 }}
          >
            <Linkedin className="w-6 h-6 hover:text-[#4A90E2] transition-colors" />
          </motion.a>
          <motion.a 
            href="mailto:Adi.Prabs@gmail.com"
            whileHover={{ 
              scale: 1.2, 
              rotate: 5,
              filter: "drop-shadow(0 0 10px rgba(82, 183, 136, 0.8))"
            }}
            whileTap={{ scale: 0.9 }}
          >
            <Mail className="w-6 h-6 hover:text-[#52B788] transition-colors" />
          </motion.a>
          <motion.a 
            href="https://www.instagram.com/adiprabs/" 
            target="_blank" 
            rel="noopener noreferrer"
            whileHover={{ 
              scale: 1.2, 
              rotate: -5,
              filter: "drop-shadow(0 0 10px rgba(254, 198, 1, 0.8))"
            }}
            whileTap={{ scale: 0.9 }}
          >
            <Instagram className="w-6 h-6 hover:text-[#FEC601] transition-colors" />
          </motion.a>
        </motion.div>
      </footer>
      <AnimatePresence>
        {isProjectsExpanded && projectCardBounds && (
          <motion.div
            className="fixed inset-0 z-[100]" // Ensure it covers the entire viewport and has a high z-index
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute bg-[#FF6B6B] rounded-lg overflow-auto" // Enable scrolling within the card
              initial={{
                left: projectCardBounds.left,
                top: projectCardBounds.top,
                width: projectCardBounds.width,
                height: projectCardBounds.height,
              }}
              animate={{
                left: 0,
                top: 0,
                width: '100vw',
                height: '100vh',
                transition: { duration: 0.3, ease: 'easeInOut' },
              }}
              exit={{
                left: projectCardBounds.left,
                top: projectCardBounds.top,
                width: projectCardBounds.width,
                height: projectCardBounds.height,
                transition: { duration: 0.3, ease: 'easeInOut' },
              }}
            >
              <Projects onClose={() => setIsProjectsExpanded(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isTimelineExpanded && timelineCardBounds && (
          <motion.div
            className="fixed inset-0 z-[100]" // Ensure it covers the entire viewport and has a high z-index
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute bg-[#FEC601] rounded-lg overflow-hidden"
              initial={{
                left: timelineCardBounds.left,
                top: timelineCardBounds.top,
                width: timelineCardBounds.width,
                height: timelineCardBounds.height,
              }}
              animate={{
                left: 0,
                top: 0,
                width: '100vw',
                height: '100vh',
                transition: { duration: 0.3, ease: 'easeInOut' },
              }}
              exit={{
                left: timelineCardBounds.left,
                top: timelineCardBounds.top,
                width: timelineCardBounds.width,
                height: timelineCardBounds.height,
                transition: { duration: 0.3, ease: 'easeInOut' },
              }}
            >
              <Timeline onClose={() => setIsTimelineExpanded(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isBooklistExpanded && (
          <motion.div
            className="fixed inset-0 bg-[#52B788] text-white overflow-auto z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Booklist/>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isContactExpanded && (
          <motion.div
            className="fixed inset-0 z-50" // Add z-index here
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Contact onClose={() => setIsContactExpanded(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default HomePage;