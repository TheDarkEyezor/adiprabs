"use client";
import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { TransitionLink } from '../components/TransitionLink';

const timelineData = [
  {
    date: "Jan 2011 - Jan 2021",
    title: "NPS International School",
    description: "IGCSE and IB, Grade 12.",
    image: ""
  },
  {
    date: "Sep 2019 - Mar 2021",
    title: "#8235 Beyond the Flames - FRC Team Leader",
    description: "Coordinated a 20-student robotics team for FIRST Robotics Competition. Oversaw design and creation of the robot using Fusion 360. Wrote Java/Python code for autonomous and control. Helped secure wins in international FRC challenges and earned a Dean's List nomination.",
    image: ""
  },
  {
    date: "Feb 2021 - Mar 2023",
    title: "HelpIGCSE - Head of Marketing",
    description: "Led marketing for a non-profit helping students with IGCSE and SAT exams. Increased blog engagement by 25% in 6 months. Achieved a 200% boost in Instagram engagement. Oversaw growth to 12,750+ students worldwide, driving an 80% user increase.",
    image: ""
  },
  {
    date: "Jul 2020 - Mar 2023",
    title: "DamnIQ Bionics and Prosthetics - Co-Founder",
    description: "Co-founded a startup focused on affordable prosthetics using 3D printing technology. Tackled complex legal, health, and logistical challenges. Developed adaptability, creative thinking, and project management skills.",
    image: ""
  },
  {
    date: "Jun 2022 - Jun 2023",
    title: "Robotics Club at NPSI - Founder",
    description: "Founded a robotics club to inspire students in STEM, sparked by FIRST Robotics competitions. Established frameworks for participating in international competitions. Secured resources and support from school staff and alumni. Encouraged collaboration and innovation among multiple teams.",
    image: ""
  },
  {
    date: "Sep 2022 - Sep 2023",
    title: "Interact Club: Chapter of Rotary Club - Vice President",
    description: "Led community service initiatives, collaborating on projects that benefited local communities. Planned and executed service projects, refining leadership and organizational skills. Fostered teamwork and community engagement. Gained skills in public speaking and presentations.",
    image: ""
  },
  {
    date: "Jun 2022 - Feb 2023",
    title: "Chlorophyll Club - Founder and President",
    description: "Launched a student-led initiative promoting environmental awareness. Organized quizzes, workshops, and events. Wrote articles on sustainability and climate change. Led community outreach for recycling and conservation.",
    image: ""
  },
  {
    date: "May 2022 - Aug 2022",
    title: "HCIS - Intern",
    description: "Contributed to a healthcare tech project focused on elderly fall-detection. Helped develop infrared-based solutions, emphasizing data privacy. Drafted a grant proposal for government funding.",
    image: ""
  },
  {
    date: "Aug 2022 - Aug 2022",
    title: "Model Environmental Summit by Chlorophyll Club - Secretary General and Lead Organizer",
    description: "Organized a student-led conference spotlighting environmental issues. Managed logistics, funding, and team collaboration. Led keynote speeches, workshops, and panel discussions.",
    image: ""
  },
  {
    date: "Aug 2020 - Apr 2022",
    title: "Aerodynamics Club - Co-founder and Head of Academics",
    description: "Launched a student-led club for STEM and aviation activities at NPSI. Designed a 2-month aerodynamics course. Handled social media and logistics.",
    image: ""
  },
  {
    date: "Aug 2021 - Mar 2022",
    title: "NPS International School - Editor in Chief",
    description: "Led the yearbook team to produce a comprehensive annual publication. Oversaw content planning and design. Interviewed administration, faculty, and student leaders.",
    image: ""
  },
  {
    date: "Jul 2021 - Dec 2021",
    title: "TheOpenCode Foundation - Intern",
    description: "Developed and delivered coding workshops to promote tech literacy. Managed logistics for educational programs. Helped design curriculum and coordinate events.",
    image: ""
  },
  {
    date: "Jul 2021 - Dec 2021",
    title: "TheOpenCode - Intern",
    description: "Created and delivered coding workshops, fostering a learning community. Organized program logistics. Contributed to workshop design and tech literacy promotion.",
    image: ""
  },
  {
    date: "Dec 2023 - Oct 2024",
    title: "Altus Reach - Machine Learning Engineer",
    description: "Drove innovation in AI model development to enhance product performance and customer satisfaction. Improved predictive accuracy by 30% in video saliency detection. Contributed to robust, scalable cloud architecture. Focused on modernizing the company website’s front and back end.",
    image: ""
  },
  {
    date: "Jan 2024",
    title: "Joined Altus Reach, a tech startup",
    description: "I finally got an amazing opportunity to work as an ML engineer and full-stack developer at Altus reach. The dynamic startup environment, exciting nature of the role and fantastic exposure to Cloud Computing helped develop my skills to become a better employee in the tech sector.",
    image: ""
  },
  {
    date: "Sept 2024",
    title: "Now this website",
    description: "I'm determined to put myself on the map now, showcasing my skills and passions in every possible way. Here's to hoping for more milestones in the future.",
    image: ""
  },
  {
    date: "Oct 2023 - Jul 2027",
    title: "Imperial College London",
    description: "MEng in Computing (Computer Science) with specializations in Artificial Intelligence and Computer Science.",
    image: ""
  },
  {
    date: "Nov 2023 - Present",
    title: "Imperial College London - Wellbeing Representative",
    description: "Served as Computing Wellbeing Representative, first for the year, then department representative, driving initiatives to promote student mental wellbeing and campus comfort. Proposed and organized activities to educate students about mental wellbeing and university life. Collaborated with faculty and student society to ensure inclusive events, fostering a sense of belonging. Oversaw installations of additional watercoolers and extra equipment to improve student wellbeing.",
    image: ""
  },
  {
    date: "Jul 2024 - Present",
    title: "DoCSoc - Treasurer",
    description: "Currently serving as Treasurer for the DoCSoc society, managing finances and sponsorships. Oversee contracts and sponsorship agreements. Develop and manage budgets. Secured over £98,000 in funding through coding automation for logistical tasks.",
    image: ""
  },
  {
    date: "Oct 2024 - Present",
    title: "Trajex - ML and AI developer",
    description: "Integrating the latest open-source research to improve AI systems using a Knowledge Augmented Generation approach.",
    image: ""
  },
];

const Page: React.FC = () => {
  const constraintsRef = useRef<HTMLDivElement | null>(null);
  const y = useMotionValue(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollSpeed = useRef(0);
  const lastScrollTime = useRef(0);

  const background = useTransform(
    y,
    [-300, 0, 300],
    ['#FEC601', '#FEC601', '#FEC601']
  );

  const [backgroundStyle, setBackgroundStyle] = useState<string>('');

  useMotionValueEvent(background, "change", (latest) => {
    setBackgroundStyle(latest);
  });

  const handleWheel = (event: React.WheelEvent) => {
    event.preventDefault();

    const container = constraintsRef.current;
    if (!container) return;

    const contentHeight = container.scrollHeight;
    const viewportHeight = container.clientHeight;

    const maxScroll = contentHeight - viewportHeight;
    const newY = y.get() - event.deltaY;

    if (newY > 0) {
      y.set(0);
    } else if (Math.abs(newY) > maxScroll) {
      y.set(-maxScroll);
    } else {
      y.set(newY);
    }

    // Calculate scroll speed
    const currentTime = Date.now();
    const timeDiff = currentTime - lastScrollTime.current;
    scrollSpeed.current = event.deltaY / timeDiff;
    lastScrollTime.current = currentTime;

    setIsScrolling(true);

    // Debounce the isScrolling state
    setTimeout(() => {
      setIsScrolling(false);
    }, 100);
  };

  const speedLineVariants = {
    initial: {
      opacity: 0,
      x: scrollSpeed.current > 0 ? -50 : 50,
    },
    animate: {
      opacity: 0.5,
      x: 0,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
    exit: {
      opacity: 0,
      x: scrollSpeed.current > 0 ? 50 : -50,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  };

  useEffect(() => {
    lastScrollTime.current = Date.now();
  }, []);

  return (
    <div className="min-h-screen bg-[#FEC601] text-gray-800 p-8 overflow-hidden" style={{ background: backgroundStyle }}>
      <TransitionLink href='/'>
        <motion.button
          className="mb-6 flex items-center text-xl font-bold"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="mr-2" /> Back to Home
        </motion.button>
      </TransitionLink>

      <h1 className="text-4xl font-bold mb-8">My Journey</h1>

      <div
        className="relative h-[calc(100vh-200px)] overflow-hidden"
        ref={constraintsRef}
        onWheel={handleWheel}
      >
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-800 transform -translate-x-1/2"></div>
        <motion.div
          className="absolute top-0 left-0 right-0"
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
              whileHover={{ scale: 1.05, backgroundColor: "#FEC601" }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.div
                className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}
                whileHover={{ scale: 1.1 }}
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
      <AnimatePresence>
        {isScrolling && (
          <motion.div
            className="fixed top-0 left-0 w-full h-full pointer-events-none bg-black/20 backdrop-blur-sm z-50"
            variants={speedLineVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Page;