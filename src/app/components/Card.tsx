import React, { useState } from 'react'
import Image from 'next/image';

import {motion} from "framer-motion"

interface CardProps {
  image: string;
  description: string;
  name: string;
}

const Card: React.FC<CardProps> = ({image, description, name}) => {
  const [showOverlay, setShowOverlay] = useState(false);

  return (
    <motion.div 
      className='relative overflow-hidden h-[200px] min-w-[200px] rounded-xl flex justify-center items-center glass-card border-2 border-white/20'
      onHoverStart={() => setShowOverlay(true)} 
      onHoverEnd={() => setShowOverlay(false)}
      whileHover={{ 
        scale: 1.1, 
        transition: { duration: 0.2 },
        boxShadow: "0 0 40px rgba(82, 183, 136, 0.6), 0 0 80px rgba(82, 183, 136, 0.4)"
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Gradient overlay on hover */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-[#FF6B6B]/30 via-[#FEC601]/30 to-[#52B788]/30 opacity-0"
        animate={{ opacity: showOverlay ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      
      {showOverlay && (
        <motion.div 
          className='absolute inset-0 z-10 flex justify-center items-center'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className='absolute bg-black/50 backdrop-blur-md pointer-events-none h-full w-full'/>
          <motion.div 
            className="glass-card p-4 rounded-lg shadow-2xl z-20 max-w-[180px]"
            initial={{ scale: 0.8, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h1 className="font-bold text-sm text-white mb-2 bg-gradient-to-r from-[#FF6B6B] to-[#FEC601] bg-clip-text text-transparent">{name}</h1>
            <p className="text-xs text-white/90">{description}</p>
          </motion.div>
        </motion.div>
      )}
      <Image src={image} alt={image} width={200} height={200} style={{objectFit:'cover'}} className="rounded-xl"/>
    </motion.div>
  )
}

export default Card