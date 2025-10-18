'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Copy, Check } from 'lucide-react';

interface CodeSnippet {
  id: string;
  title: string;
  language: string;
  code: string;
  description: string;
  color: string;
}

const codeSnippets: CodeSnippet[] = [
  {
    id: '1',
    title: 'Custom React Hook',
    language: 'TypeScript',
    code: `const useScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const scrollTop = window.scrollY;
      const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
      setProgress(progress);
    };

    window.addEventListener('scroll', updateProgress);
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return progress;
};`,
    description: 'A custom hook to track scroll progress with smooth performance',
    color: '#3178C6',
  },
  {
    id: '2',
    title: 'Framer Motion Animation',
    language: 'React',
    code: `const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 12,
    },
  },
  hover: {
    scale: 1.05,
    rotateZ: 2,
    transition: { type: 'spring', stiffness: 300 },
  },
};

<motion.div
  variants={cardVariants}
  initial="hidden"
  animate="visible"
  whileHover="hover"
/>`,
    description: 'Smooth card animations with spring physics',
    color: '#FF6B6B',
  },
  {
    id: '3',
    title: 'API Route Handler',
    language: 'Next.js',
    code: `export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate input
    if (!body.email || !body.message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Process the data
    const result = await processData(body);
    
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}`,
    description: 'Type-safe Next.js API route with error handling',
    color: '#52B788',
  },
  {
    id: '4',
    title: 'Tailwind Utility',
    language: 'CSS/Tailwind',
    code: `/* Custom glass card utility */
.glass-card {
  @apply bg-white/10 backdrop-blur-lg border border-white/20;
  @apply rounded-2xl shadow-xl;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-card:hover {
  @apply bg-white/20 border-white/30 shadow-2xl;
  transform: translateY(-4px);
}

/* Gradient text */
.gradient-text {
  @apply bg-gradient-to-r from-[#FF6B6B] via-[#FEC601] to-[#52B788];
  @apply bg-clip-text text-transparent;
}`,
    description: 'Reusable glassmorphism and gradient utilities',
    color: '#00F5FF',
  },
];

const CodeSnippetCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [copied, setCopied] = useState(false);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) nextIndex = codeSnippets.length - 1;
      if (nextIndex >= codeSnippets.length) nextIndex = 0;
      return nextIndex;
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(codeSnippets[currentIndex].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentSnippet = codeSnippets[currentIndex];

  return (
    <div className="w-full max-w-4xl mx-auto glass-card p-8 rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white mb-1">Code Showcase</h3>
          <p className="text-white/60 text-sm">Swipe or click to explore</p>
        </div>
        <div className="flex gap-2">
          <motion.button
            onClick={() => paginate(-1)}
            className="glass-card p-2 rounded-lg hover:bg-white/20 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </motion.button>
          <motion.button
            onClick={() => paginate(1)}
            className="glass-card p-2 rounded-lg hover:bg-white/20 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </motion.button>
        </div>
      </div>

      <div className="relative overflow-hidden h-[500px]">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            className="absolute w-full"
          >
            <div className="bg-[#1e1e1e] rounded-xl overflow-hidden border border-white/10">
              {/* Header */}
              <div
                className="flex items-center justify-between px-4 py-3 border-b border-white/10"
                style={{ backgroundColor: `${currentSnippet.color}20` }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                    <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                  </div>
                  <span className="text-white/80 text-sm font-mono">
                    {currentSnippet.title}
                  </span>
                  <span
                    className="px-2 py-0.5 rounded text-xs font-mono"
                    style={{
                      backgroundColor: `${currentSnippet.color}30`,
                      color: currentSnippet.color,
                    }}
                  >
                    {currentSnippet.language}
                  </span>
                </div>
                <motion.button
                  onClick={copyToClipboard}
                  className="p-2 hover:bg-white/10 rounded transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-[#52B788]" />
                  ) : (
                    <Copy className="w-4 h-4 text-white/60" />
                  )}
                </motion.button>
              </div>

              {/* Code */}
              <div className="p-4 overflow-x-auto">
                <pre className="text-sm font-mono text-white/90 leading-relaxed">
                  <code>{currentSnippet.code}</code>
                </pre>
              </div>

              {/* Description */}
              <div className="px-4 py-3 border-t border-white/10 bg-white/5">
                <p className="text-white/70 text-sm">{currentSnippet.description}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination dots */}
      <div className="flex justify-center gap-2 mt-6">
        {codeSnippets.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/30'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>
    </div>
  );
};

export default CodeSnippetCarousel;
