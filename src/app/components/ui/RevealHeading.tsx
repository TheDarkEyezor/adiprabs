'use client';
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

type Tag = 'h1' | 'h2' | 'h3' | 'h4';

interface Props {
  text: string;
  as?: Tag;
  className?: string;
  delay?: number;
}

export default function RevealHeading({ text, as: Tag = 'h2', className = '', delay = 0 }: Props) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: '-8%' });
  const words = text.split(' ');

  return (
    <Tag ref={ref as React.RefObject<never>} className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden leading-[1.15]">
          <motion.span
            className="inline-block"
            initial={{ y: '105%' }}
            animate={inView ? { y: 0 } : {}}
            transition={{
              duration: 0.65,
              delay: delay + i * 0.07,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && ' '}
        </span>
      ))}
    </Tag>
  );
}
