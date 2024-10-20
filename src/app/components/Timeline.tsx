import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, useMotionValueEvent } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';


const timelineData = [
  {
    date: "2019",
    title: "The robotics competition that started it all",
    description: "Thanks to FRC, organised by the non-profit in FIRST, my interest in engineering was solifdified, almost guaranteeting my future in applied sciences and engineering",
    image: ""
  },
  {
    date: "Feb 2021 - Mar 2023",
    title: "Head of Marketing",
    description: "This was my first time taking part in enterprise (although it was non-profit). The role of managing a team and being involved in a company's day to day running got me enamoured with the idea of one day running my own venture.",
    image: ""
  },
  {
    date: "Jan 2024",
    title: "Joined Altus Reach, a tech startup",
    description: "I finally got an amazing opportunity to work as an ML engineer and full-stack developer at Altus reach. The dynamic startup environment, exciting nature of the role and fantastic exposure to Cloud Computing helped develop my skills to become a better employee in the tech sector",
    image: ""
  },
  {
    date: "Sept 2024",
    title: "Now this website",
    description: "I'm determined to put myself on the map now, showcasing my skills and passions in every possible way. here's to hoping for more milestones in the future",
    image: ""
  },
];

interface TimelineProps {
  onClose: () => void;
}

const Timeline: React.FC<TimelineProps> = ({ onClose }) => {
  const constraintsRef = useRef<HTMLDivElement | null>(null);
  const y = useMotionValue(0);
  const background = useTransform(
    y,
    [-300, 0, 300],
    ['#FEC601', '#FEC601', '#FEC601']
  );

  const [backgroundStyle, setBackgroundStyle] = useState<string>('');

  useMotionValueEvent(background, "change", (latest) => {
    setBackgroundStyle(latest);
  });

  return (
    <div className="min-h-screen bg-[#FEC601] text-gray-800 p-8 overflow-hidden" style={{ background: backgroundStyle }}>
      <motion.button
        className="mb-6 flex items-center text-xl font-bold"
        onClick={onClose}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft className="mr-2" /> Back to Home
      </motion.button>

      <h1 className="text-4xl font-bold mb-8">My Journey</h1>

      <div className="relative h-[calc(100vh-200px)] overflow-hidden" ref={constraintsRef}>
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-800 transform -translate-x-1/2"></div>
        <motion.div
          className="absolute top-0 left-0 right-0 cursor-grab active:cursor-grabbing"
          drag="y"
          dragConstraints={constraintsRef}
          style={{ y }}
        >
          {timelineData.map((item, index) => (
            <motion.div
              key={index}
              className={`flex items-center mb-16 ${
                index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
              }`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.div
                className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}
                whileHover={{ scale: 1.05 }}
              >
                <div className="bg-white p-6 rounded-lg shadow-lg inline-block">
                  <h3 className="text-2xl font-bold mb-2">{item.date}</h3>
                  <h4 className="text-xl font-semibold mb-2">{item.title}</h4>
                  <p className="mb-4">{item.description}</p>
                  {item.image && (
                    <Image src={item.image} alt={item.title} className="w-full h-48 object-cover rounded-lg" width={200} height={200} />
                  )}
                </div>
              </motion.div>
              <div className="w-4 h-4 bg-gray-800 rounded-full absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Timeline;