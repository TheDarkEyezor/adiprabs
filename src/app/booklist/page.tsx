'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen, Star } from 'lucide-react';
import Image from 'next/image';
import { TransitionLink } from '../components/transitions/TransitionLink';
import Navbar from '../components/Navbar';
import ParticleField from '../components/effects/ParticleField';
import SectionHeading from '../components/common/SectionHeading';
import GlassCard from '../components/common/GlassCard';
import { staggerContainer, staggerItem } from '@/utils/animations';

interface Book {
  id: number;
  title: string;
  author: string;
  review: string;
  coverImage: string;
  rating: number;
  genre: string;
}

const books: Book[] = [
  {
    id: 1,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    review: "A classic tale of racial injustice and loss of innocence in the American South. A powerful story about courage, empathy, and standing up for what's right.",
    coverImage: "/book-covers/mockingbird.jpg",
    rating: 5,
    genre: "Classic Fiction"
  },
  {
    id: 2,
    title: "1984",
    author: "George Orwell",
    review: "A chilling portrayal of a totalitarian future society. Orwell's vision remains hauntingly relevant to discussions of surveillance, truth, and freedom.",
    coverImage: "/book-covers/1984.jpg",
    rating: 5,
    genre: "Dystopian"
  },
  {
    id: 3,
    title: "Outliers",
    author: "Malcolm Gladwell",
    review: "An interesting study on how the best of humanity got their start. Explores the hidden factors behind extraordinary success.",
    coverImage: "/book-covers/outliers.jpg",
    rating: 4,
    genre: "Non-fiction"
  },
  {
    id: 4,
    title: "The Time Keeper",
    author: "Mitch Albom",
    review: "A deep fictionalization of our priorities in life and how we treat the time we get. A beautiful reminder to appreciate every moment.",
    coverImage: "/book-covers/keeper.jpg",
    rating: 4,
    genre: "Fiction"
  },
  {
    id: 5,
    title: "Steve Jobs",
    author: "Walter Isaacson",
    review: "An interesting study of what made a generation-defining genius tick. Comprehensive biography of one of tech's most influential figures.",
    coverImage: "/book-covers/jobs.jpg",
    rating: 5,
    genre: "Biography"
  },
  {
    id: 6,
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    review: "A timeless coming-of-age story exploring teenage alienation and the loss of innocence in post-war America.",
    coverImage: "/book-covers/catcher.jpg",
    rating: 4,
    genre: "Classic Fiction"
  },
];

export default function BooklistPage() {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string>('All');

  const genres = ['All', ...Array.from(new Set(books.map(b => b.genre)))];
  
  const filteredBooks = selectedGenre === 'All'
    ? books
    : books.filter(book => book.genre === selectedGenre);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white overflow-x-hidden">
      <ParticleField count={40} />
      
      {/* Fixed gradient orbs */}
      <motion.div
        className="fixed top-20 -left-40 w-96 h-96 bg-gradient-to-br from-[#52B788]/30 to-[#4A90E2]/30 rounded-full blur-3xl pointer-events-none"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
        }}
      />
      <motion.div
        className="fixed bottom-20 -right-40 w-96 h-96 bg-gradient-to-br from-[#8B5CF6]/30 to-[#FF6B6B]/30 rounded-full blur-3xl pointer-events-none"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          delay: 4,
        }}
      />

      <Navbar />

      <div className="relative z-10 px-8 py-12 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <TransitionLink href="/">
            <motion.button
              className="mb-8 flex items-center text-white/80 hover:text-white transition-colors glass-card px-4 py-2 rounded-lg"
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="mr-2" size={20} /> Back to Home
            </motion.button>
          </TransitionLink>

          <SectionHeading 
            align="left" 
            gradient
            subtitle="A curated collection of books that have shaped my thinking and inspired my journey"
          >
            My Reading List
          </SectionHeading>

          {/* Genre Filter */}
          <div className="mt-8 flex flex-wrap gap-3">
            {genres.map(genre => (
              <motion.button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                  selectedGenre === genre
                    ? 'bg-gradient-to-r from-[#52B788] to-[#4A90E2] text-white'
                    : 'glass-card text-white/80 hover:text-white hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <BookOpen size={16} />
                {genre}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Books Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <AnimatePresence mode="popLayout">
            {filteredBooks.map((book, index) => (
              <motion.div
                key={book.id}
                variants={staggerItem}
                layout
                initial={{ opacity: 0, rotateY: 180 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0, rotateY: -180, transition: { duration: 0.3 } }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedBook(book)}
              >
                <GlassCard
                  variant="interactive"
                  hoverEffect
                  className="h-full cursor-pointer group relative overflow-hidden"
                >
                  {/* Book Cover */}
                  <div className="relative h-96 mb-4 rounded-lg overflow-hidden">
                    <Image
                      src={book.coverImage}
                      alt={book.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    {/* Rating overlay */}
                    <div className="absolute top-4 right-4 glass-card px-3 py-2 rounded-full flex items-center gap-1">
                      <Star className="text-yellow-400 fill-yellow-400" size={16} />
                      <span className="text-white font-bold">{book.rating}</span>
                    </div>
                  </div>

                  {/* Book Info */}
                  <div className="p-4">
                    <h3 className="text-xl font-bold mb-2 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#52B788] group-hover:to-[#4A90E2] transition-all">
                      {book.title}
                    </h3>
                    <p className="text-white/60 text-sm mb-3">by {book.author}</p>
                    <span className="inline-block px-3 py-1 rounded-full text-xs bg-white/10 border border-white/20 text-white/80">
                      {book.genre}
                    </span>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {filteredBooks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-2xl text-white/60 mb-6">No books found in this genre</p>
            <motion.button
              onClick={() => setSelectedGenre('All')}
              className="px-6 py-3 bg-gradient-to-r from-[#52B788] to-[#4A90E2] rounded-lg font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View All Books
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Book Detail Modal */}
      <AnimatePresence>
        {selectedBook && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBook(null)}
            />

            {/* Modal Content */}
            <motion.div
              className="relative glass-card p-8 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-white/20"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ type: 'spring', damping: 25 }}
            >
              <div className="grid md:grid-cols-2 gap-8">
                {/* Book Cover */}
                <div className="relative h-96 md:h-full rounded-lg overflow-hidden">
                  <Image
                    src={selectedBook.coverImage}
                    alt={selectedBook.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Book Details */}
                <div>
                  <div className="inline-block px-3 py-1 rounded-full text-sm bg-gradient-to-r from-[#52B788] to-[#4A90E2] text-white mb-4">
                    {selectedBook.genre}
                  </div>
                  
                  <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#52B788] to-[#4A90E2] bg-clip-text text-transparent">
                    {selectedBook.title}
                  </h2>
                  
                  <p className="text-xl text-white/80 mb-4">by {selectedBook.author}</p>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        className={i < selectedBook.rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}
                      />
                    ))}
                    <span className="ml-2 text-white/60">{selectedBook.rating}/5</span>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-3 text-white">My Review:</h3>
                  <p className="text-white/80 leading-relaxed mb-6">
                    {selectedBook.review}
                  </p>

                  <motion.button
                    onClick={() => setSelectedBook(null)}
                    className="w-full px-6 py-3 bg-gradient-to-r from-[#52B788] to-[#4A90E2] rounded-lg font-semibold text-white"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Close
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
