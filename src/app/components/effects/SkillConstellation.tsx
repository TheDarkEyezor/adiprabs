'use client';
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Skill {
  id: string;
  name: string;
  x: number;
  y: number;
  color: string;
  connections: string[];
}

const skills: Skill[] = [
  { id: 'react', name: 'React', x: 50, y: 30, color: '#61DAFB', connections: ['nextjs', 'typescript', 'tailwind'] },
  { id: 'nextjs', name: 'Next.js', x: 30, y: 50, color: '#FF6B6B', connections: ['react', 'typescript', 'nodejs'] },
  { id: 'typescript', name: 'TypeScript', x: 70, y: 50, color: '#3178C6', connections: ['react', 'nextjs', 'nodejs'] },
  { id: 'nodejs', name: 'Node.js', x: 50, y: 70, color: '#52B788', connections: ['nextjs', 'typescript', 'python'] },
  { id: 'python', name: 'Python', x: 25, y: 75, color: '#FEC601', connections: ['nodejs', 'ml', 'fastapi'] },
  { id: 'ml', name: 'ML/AI', x: 15, y: 55, color: '#8B5CF6', connections: ['python', 'tensorflow'] },
  { id: 'tailwind', name: 'Tailwind', x: 75, y: 30, color: '#00F5FF', connections: ['react', 'nextjs'] },
  { id: 'fastapi', name: 'FastAPI', x: 40, y: 85, color: '#009688', connections: ['python', 'nodejs'] },
  { id: 'tensorflow', name: 'TensorFlow', x: 10, y: 40, color: '#FF6F00', connections: ['ml', 'python'] },
];

const SkillConstellation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (canvasRef.current) {
        const container = canvasRef.current.parentElement;
        if (container) {
          setDimensions({
            width: container.clientWidth,
            height: container.clientHeight,
          });
        }
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    const drawConnections = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      skills.forEach((skill) => {
        const x1 = (skill.x / 100) * canvas.width;
        const y1 = (skill.y / 100) * canvas.height;

        skill.connections.forEach((connId) => {
          const connSkill = skills.find((s) => s.id === connId);
          if (!connSkill) return;

          const x2 = (connSkill.x / 100) * canvas.width;
          const y2 = (connSkill.y / 100) * canvas.height;

          // Draw line
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle =
            hoveredSkill === skill.id || hoveredSkill === connId
              ? `${skill.color}80`
              : 'rgba(255, 255, 255, 0.1)';
          ctx.lineWidth = hoveredSkill === skill.id || hoveredSkill === connId ? 2 : 1;
          ctx.stroke();
        });
      });
    };

    drawConnections();
  }, [dimensions, hoveredSkill]);

  return (
    <div className="relative w-full h-[600px] glass-card p-8 rounded-2xl overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0" />
      
      {/* Skill nodes */}
      {skills.map((skill, index) => (
        <motion.div
          key={skill.id}
          className="absolute cursor-pointer"
          style={{
            left: `${skill.x}%`,
            top: `${skill.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }}
          onMouseEnter={() => setHoveredSkill(skill.id)}
          onMouseLeave={() => setHoveredSkill(null)}
          whileHover={{ scale: 1.2 }}
        >
          <motion.div
            className="relative flex items-center justify-center"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: index * 0.2,
            }}
          >
            {/* Glow effect */}
            <motion.div
              className="absolute w-16 h-16 rounded-full blur-xl opacity-50"
              style={{ backgroundColor: skill.color }}
              animate={{
                scale: hoveredSkill === skill.id ? 1.5 : 1,
                opacity: hoveredSkill === skill.id ? 0.8 : 0.3,
              }}
            />
            
            {/* Node */}
            <motion.div
              className="relative w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xs backdrop-blur-sm border-2"
              style={{
                backgroundColor: `${skill.color}40`,
                borderColor: skill.color,
                boxShadow: `0 0 20px ${skill.color}60`,
              }}
            >
              {skill.name.slice(0, 2).toUpperCase()}
            </motion.div>

            {/* Label */}
            <motion.div
              className="absolute top-14 whitespace-nowrap bg-black/80 px-3 py-1 rounded-full text-xs text-white backdrop-blur-sm"
              initial={{ opacity: 0, y: -5 }}
              animate={{
                opacity: hoveredSkill === skill.id ? 1 : 0.7,
                y: 0,
              }}
              style={{
                boxShadow: hoveredSkill === skill.id ? `0 0 10px ${skill.color}` : 'none',
              }}
            >
              {skill.name}
            </motion.div>
          </motion.div>
        </motion.div>
      ))}

      {/* Title */}
      <div className="absolute top-8 left-8">
        <h3 className="text-2xl font-bold text-white mb-2">Skill Network</h3>
        <p className="text-white/60 text-sm">Hover to explore connections</p>
      </div>
    </div>
  );
};

export default SkillConstellation;
