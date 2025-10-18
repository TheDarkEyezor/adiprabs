"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { TransitionLink } from '../components/TransitionLink';

interface Book {
  id: number;
  title: string;
  author: string;
  review: string;
  coverImage: string;
}

const books: Book[] = [
  {
    id: 1,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    review: "A classic tale of racial injustice and loss of innocence in the American South.",
    coverImage: "/book-covers/mockingbird.jpg"
  },
  {
    id: 2,
    title: "1984",
    author: "George Orwell",
    review: "A chilling portrayal of a totalitarian future society.",
    coverImage: "/book-covers/1984.jpg"
  },
  {
    id: 3,
    title: "Outliers",
    author: "Malcolm Gladwell",
    review: "An interessting study on how the best of humanity got their start",
    coverImage: "/book-covers/outliers.jpg"
  },
  {
    id: 4,
    title: "Timekeeper",
    author: "Mitch Albom",
    review: "A deep fictionalisation of our priorities in life and how we treat the time we get in our lives.",
    coverImage: "/book-covers/keeper.jpg"
  },
  {
    id: 7,
    title: "Stever Jobs",
    author: "Walter Isaacson",
    review: "An interesting study of what made a generation-defining genius tick",
    coverImage: "/book-covers/jobs.jpg"
  },
];

const Booklist: React.FC = () => {
  const [, setHoveredBook] = useState<number | null>(null);
  const cardVariants = {
    hidden: { rotateY: 180, opacity: 0 },
    visible: (i: number) => ({
      rotateY: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>, bookId: number) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left; // x position within the element
    const y = event.clientY - rect.top;  // y position within the element

    // Calculate the distance from the center
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const distanceX = (x - centerX) / centerX; // -1 to 1
    const distanceY = (y - centerY) / centerY; // -1 to 1

    // Calculate rotation (max 5 degrees)
    const rotateX = -distanceY * 5; // Negative because we want to rotate up when mouse is at the bottom
    const rotateY = distanceX * 5;

    setHoveredBook(bookId);
    event.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = (event: React.MouseEvent<HTMLDivElement>) => {
    setHoveredBook(null);
    event.currentTarget.style.transform = 'none';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#52B788] to-[#40916c] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex justify-between items-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            <span className="block">My Reading</span>
            <span className="block mt-1 text-emerald-100">Collection</span>
          </h1>
          
          <TransitionLink href='/'>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-emerald-800 rounded-full w-12 h-12 flex items-center justify-center text-2xl shadow-lg hover:bg-emerald-50 transition-colors"
              aria-label="Close and return to home"
            >
              &times;
            </motion.button>
          </TransitionLink>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {books.map((book, index) => (
            <motion.div
              key={book.id}
              className="bg-white rounded-xl shadow-xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:shadow-2xl"
              onMouseMove={(e) => handleMouseMove(e, book.id)}
              onMouseLeave={handleMouseLeave}
              style={{ transformStyle: 'preserve-3d', transition: 'transform 0.1s' }}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              custom={index}
            >
              <div className="relative h-72">
                <Image
                  src={book.coverImage}
                  alt={`Cover of ${book.title}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: 'cover' }}
                  className="transition-opacity duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-2 text-emerald-900">{book.title}</h3>
                <p className="text-emerald-700 font-medium mb-3 text-sm uppercase tracking-wide">{book.author}</p>
                <p className="text-gray-600 leading-relaxed">{book.review}</p>
              </div>
            </motion.div>
          ))}
        </div>
        
        <footer className="mt-16 text-center text-emerald-100 text-sm">
          <p>Books that have shaped my thinking and perspective</p>
        </footer>
      </div>
    </div>
  );
};

export default Booklist;