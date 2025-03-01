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
    <motion.div className='relative overflow-hidden h-[200px] min-w-[200px] bg-slate-400 rounded-xl feld justify-center items-center'
    onHoverStart={() => setShowOverlay(true)} onHoverEnd={() => setShowOverlay(false)}
    whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}>
      {showOverlay && (
        <div className='absolute inset-0 z-10 flex justify-center items-center'>
          <div className='asbolute bg-black pointer-events-none opacity-50 h-full w-full'/>
          <div className="bg-white p-2 rounded-md shadow-md">
            <h1 className="font-semibold text-sm">{name}</h1>
            <p className="text-xs">{description}</p>
          </div>
        </div>
      )}
      <Image src={image} alt={image} width={200} height={200} style={{objectFit:'cover'}}/>
    </motion.div>
  )
}

export default Card