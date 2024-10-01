import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

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

const Booklist: React.FC<{ onClose: () => void }> = ({ onClose }) => {
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
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">My Booklist</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book, index) => (
          <motion.div
            key={book.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer"
            onMouseMove={(e) => handleMouseMove(e, book.id)}
            onMouseLeave={handleMouseLeave}
            style={{ transformStyle: 'preserve-3d', transition: 'transform 0.1s' }}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={index}
          >
            <div className="relative h-64">
              <Image
                src={book.coverImage}
                alt={`Cover of ${book.title}`}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{book.title}</h3>
              <p className="text-gray-600 mb-2">{book.author}</p>
              <p className="text-gray-800">{book.review}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <button
        className="fixed top-4 right-4 bg-white text-black rounded-full w-10 h-10 flex items-center justify-center text-2xl"
        onClick={onClose}
      >
        &times;
      </button>
    </div>
  );
};

export default Booklist;