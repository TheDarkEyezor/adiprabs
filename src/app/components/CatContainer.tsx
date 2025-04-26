"use client";
import React, { useState, useEffect } from 'react';
import Cat from './Cat';

interface CatContainerProps {
  catCount?: number;
}

const CatContainer: React.FC<CatContainerProps> = ({ catCount = 3 }) => {
  const [cats, setCats] = useState<{ id: number; x: number }[]>([]);
  
  useEffect(() => {
    // Initialize cats with random positions
    const initialCats = Array.from({ length: catCount }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth * 0.8
    }));
    
    setCats(initialCats);
  }, [catCount]);
  
  return (
    <>
      {cats.map(cat => (
        <Cat key={cat.id} id={cat.id} initialX={cat.x} />
      ))}
    </>
  );
};

export default CatContainer;