"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import Image from 'next/image';


interface CatProps {
  id: number;
  initialX: number;
}

const catColors = ['orange', 'black', 'gray', 'white', 'brown'];

const Cat: React.FC<CatProps> = ({ id, initialX }) => {
  const controls = useAnimation();
  const [position, setPosition] = useState({ x: initialX, y: 0 });
  const [isClimbing, setIsClimbing] = useState(false);
  const [color] = useState(catColors[id % catColors.length]);
  const [direction, setDirection] = useState<'left' | 'right'>(Math.random() > 0.5 ? 'left' : 'right');
  const [isMoving, setIsMoving] = useState(true);
  const [isHovered, setIsHovered] = useState(false); // State for hover
  const animationRef = useRef<number | null>(null);
  
  // Decide cat behavior
  useEffect(() => {
    const moveCat = async () => {
      // Ensure window is available
      if (typeof window === 'undefined' || !isMoving) return;
      
      if (isClimbing) {
        const isLeftEdge = position.x < 100;
        const isRightEdge = position.x > window.innerWidth - 100;
        // Adjust climb height relative to viewport height
        const climbHeight = -window.innerHeight * 0.6; 
        
        // Ensure cat is positioned at the edge before climbing
        if (!isLeftEdge && !isRightEdge) {
          setIsClimbing(false);
          return; // Go back to walking if not at edge
        }
        
        // Climbing up - animate to specific y position
        await controls.start({
          y: climbHeight,
          transition: { duration: 3, ease: "easeInOut" }
        });
        setPosition(prev => ({ ...prev, y: climbHeight }));
        
        // Pause at the top
        await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));
        
        // Climbing down - animate back to bottom (y: 0)
        await controls.start({
          y: 0,
          transition: { duration: 3, ease: "easeInOut" }
        });
        setPosition(prev => ({ ...prev, y: 0 }));
        
        setIsClimbing(false); // Finished climbing
      } else {
        // Walking along bottom
        const moveDistance = (Math.random() * 200) + 50;
        let targetX = direction === 'right' 
          ? position.x + moveDistance 
          : position.x - moveDistance;
        let shouldClimb = false;
        
        // Check boundaries and decide direction/climbing
        if (targetX > window.innerWidth - 100) {
          targetX = window.innerWidth - 100; // Clamp to edge
          setDirection('left'); // Change direction
          // Increase climb probability when reaching the right edge
          if (Math.random() < 0.8) { // Increased probability (e.g., 80%)
            shouldClimb = true;
          }
        } else if (targetX < 100) {
          targetX = 100; // Clamp to edge
          setDirection('right'); // Change direction
           // Increase climb probability when reaching the left edge
          if (Math.random() < 0.8) { // Increased probability (e.g., 80%)
            shouldClimb = true;
          }
        }
        
        // Animate movement
        await controls.start({ 
          x: targetX, 
          transition: { duration: 2, ease: "linear" }
        });
        setPosition(prev => ({ ...prev, x: targetX }));

        // Start climbing if decided
        if (shouldClimb) {
          setIsClimbing(true);
          // No need to return here, let the loop continue to the climbing logic next iteration
        }
      }
      
      // Pause between movements/actions
      await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
      
      // Schedule next movement using requestAnimationFrame
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      // Use requestAnimationFrame to recursively call moveCat for the next step
      animationRef.current = requestAnimationFrame(moveCat); 
    };
    
    // Start the cat movement loop
    animationRef.current = requestAnimationFrame(moveCat);
    
    // Cleanup function to cancel animation frame on unmount
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      controls.stop(); // Stop any ongoing animations
    };
  // Re-added position and isClimbing to dependencies as they influence the logic inside.
  // Added window check inside useEffect to handle SSR/initial render.
  }, [controls, direction, isMoving, position, isClimbing]); 
  
  // Handle interaction when user clicks on cat
  const handleClick = () => {
    if (isMoving) {
      // Stop and meow
      setIsMoving(false);
      controls.stop(); // Stop current movement animation
      controls.start({ scale: [1, 1.2, 1], transition: { duration: 0.5 } });
      
      // Resume after a pause
      setTimeout(() => {
          setIsMoving(true);
          // Restart movement logic by triggering useEffect re-run (optional, depends if needed)
          // Or directly call requestAnimationFrame(moveCat) if state update doesn't trigger it
      }, 2000);
    }
  };
  
  return (
    <motion.div
      className="absolute bottom-0 z-50 cursor-pointer"
      animate={controls}
      initial={{ x: position.x, y: position.y }} // Use state for initial y too
      // Apply horizontal flip based on direction state
      style={{ 
        scaleX: direction === 'left' ? -1 : 1, 
      }}
      onClick={handleClick}
      onHoverStart={() => setIsHovered(true)} // Show meow on hover start
      onHoverEnd={() => setIsHovered(false)}   // Hide meow on hover end
    >
      {/* Inner div prevents image content from flipping */}
      <div className="relative" style={{ width: '60px', height: '40px', transform: 'scaleX(1)' }}> 
        <Image
          src={`/cats/${color}-cat.png`}
          alt="Cat"
          width={60}
          height={40}
          priority // Load cat images eagerly
        />
        {/* Show Meow bubble if clicked OR hovered */}
        {(isHovered || !isMoving) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: -40 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            // Apply inverse scaleX to keep text readable when cat is flipped
            style={{ scaleX: direction === 'left' ? -1 : 1, transformOrigin: 'center' }} 
            className="absolute top-[-30px] left-[50%] translate-x-[-50%] bg-white rounded-lg p-1 text-xs shadow whitespace-nowrap"
          >
            Meow!
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Cat;