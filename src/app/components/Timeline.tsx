import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const timelineData = [
  {
    date: "2020",
    title: "Started Web Development",
    description: "Began learning HTML, CSS, and JavaScript",
    image: "/api/placeholder/400/300"
  },
  {
    date: "2021",
    title: "First Freelance Project",
    description: "Completed a website for a local business",
    image: "/api/placeholder/400/300"
  },
  {
    date: "2022",
    title: "Joined Tech Startup",
    description: "Worked as a full-stack developer on an innovative app",
    image: "/api/placeholder/400/300"
  },
  {
    date: "2023",
    title: "Led Development Team",
    description: "Managed a team of developers on a large-scale project",
    image: "/api/placeholder/400/300"
  },
  // Add more timeline items as needed
];

const Timeline = ({ onClose }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);

  const handleScroll = (direction) => {
    const scrollAmount = direction === 'left' ? -400 : 400;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FEC601] text-gray-800 p-8 overflow-hidden">
      <motion.button
        className="mb-6 flex items-center text-xl font-bold"
        onClick={onClose}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft className="mr-2" /> Back to Home
      </motion.button>

      <h1 className="text-4xl font-bold mb-8">My Journey</h1>

      <div className="relative">
        <div 
          ref={scrollRef}
          className="flex overflow-x-scroll pb-10 hide-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="flex flex-nowrap space-x-8">
            {timelineData.map((item, index) => (
              <motion.div
                key={index}
                className={`flex flex-col items-center w-96 flex-shrink-0 ${
                  index % 2 === 0 ? 'mt-20' : 'mb-20'
                }`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-1 h-20 bg-gray-800 mb-4"></div>
                <div className="bg-white p-6 rounded-lg shadow-lg w-full">
                  <h3 className="text-2xl font-bold mb-2">{item.date}</h3>
                  <h4 className="text-xl font-semibold mb-2">{item.title}</h4>
                  <p className="mb-4">{item.description}</p>
                  <img src={item.image} alt={item.title} className="w-full h-48 object-cover rounded-lg" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <button
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg"
          onClick={() => handleScroll('left')}
        >
          <ArrowLeft size={24} />
        </button>
        <button
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg"
          onClick={() => handleScroll('right')}
        >
          <ArrowRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default Timeline;