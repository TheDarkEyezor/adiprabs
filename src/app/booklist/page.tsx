'use client';
import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Container, Label, Tag } from '../components/ui/primitives';

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
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    review:
      "A classic tale of racial injustice and loss of innocence in the American South. A powerful story about courage, empathy, and standing up for what's right.",
    coverImage: '/book-covers/mockingbird.jpg',
    rating: 5,
    genre: 'Classic Fiction',
  },
  {
    id: 2,
    title: '1984',
    author: 'George Orwell',
    review:
      "A chilling portrayal of a totalitarian future society. Orwell's vision remains hauntingly relevant to discussions of surveillance, truth, and freedom.",
    coverImage: '/book-covers/1984.jpg',
    rating: 5,
    genre: 'Dystopian',
  },
  {
    id: 3,
    title: 'Outliers',
    author: 'Malcolm Gladwell',
    review:
      'An interesting study on how the best of humanity got their start. Explores the hidden factors behind extraordinary success — culture, timing, opportunity.',
    coverImage: '/book-covers/outliers.jpg',
    rating: 4,
    genre: 'Non-fiction',
  },
  {
    id: 4,
    title: 'The Time Keeper',
    author: 'Mitch Albom',
    review:
      'A deep fictionalization of our priorities in life and how we treat the time we get. A beautiful reminder to appreciate every moment.',
    coverImage: '/book-covers/keeper.jpg',
    rating: 4,
    genre: 'Fiction',
  },
  {
    id: 5,
    title: 'Steve Jobs',
    author: 'Walter Isaacson',
    review:
      "An interesting study of what made a generation-defining genius tick. Comprehensive biography of one of tech's most influential figures. Uncomfortable in all the right ways.",
    coverImage: '/book-covers/jobs.jpg',
    rating: 5,
    genre: 'Biography',
  },
  {
    id: 6,
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    review:
      'A timeless coming-of-age story exploring teenage alienation and the loss of innocence in post-war America. Still resonates decades later.',
    coverImage: '/book-covers/catcher.jpg',
    rating: 4,
    genre: 'Classic Fiction',
  },
];

function BookRow({ book, index }: { book: Book; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: '-6%' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="grid grid-cols-12 gap-8 py-10 border-t border-ink-line first:border-t-0"
    >
      {/* Cover */}
      <div className="col-span-12 md:col-span-4">
        <div className="relative aspect-[3/4] overflow-hidden bg-ink-surface border border-ink-line">
          <Image
            src={book.coverImage}
            alt={book.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      </div>

      {/* Text */}
      <div className="col-span-12 md:col-span-8 flex flex-col justify-center">
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <Tag>{book.genre}</Tag>
          <div
            className="font-mono text-[14px] tracking-widest leading-none"
            aria-label={`${book.rating} out of 5 stars`}
          >
            {[...Array(5)].map((_, i) => (
              <span key={i} className={i < book.rating ? 'text-teal' : 'text-ink-muted'}>★</span>
            ))}
          </div>
        </div>
        <h2 className="text-2xl text-ink-fg tracking-snug">{book.title}</h2>
        <p className="font-mono text-mono-sm text-ink-muted mt-1">by {book.author}</p>
        <p className="mt-4 text-ink-fg2 leading-relaxed max-w-reading">{book.review}</p>
      </div>
    </motion.div>
  );
}

export default function BooklistPage() {
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const genres = ['All', ...Array.from(new Set(books.map((b) => b.genre)))];
  const filteredBooks = selectedGenre === 'All' ? books : books.filter((b) => b.genre === selectedGenre);

  return (
    <>
      <Navbar />
      <main className="relative z-10">
        <section className="relative">
          <Container className="pt-16 md:pt-24 pb-10">
            <Label number="05">reading</Label>
            <h1 className="mt-6 text-5xl md:text-7xl tracking-tightest font-medium text-ink-fg">
              Reading list
            </h1>
            <p className="mt-4 max-w-reading text-xl text-ink-fg2 leading-snug">
              Books that shaped my thinking. Updated occasionally.
            </p>

            <div className="mt-10 flex flex-wrap gap-2">
              {genres.map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGenre(g)}
                  className={`px-3 py-1.5 border rounded-sm font-mono text-mono-sm transition-colors ${
                    selectedGenre === g
                      ? 'border-teal-dim text-teal'
                      : 'border-ink-line text-ink-fg2 hover:text-ink-fg hover:border-ink-line2'
                  }`}
                >
                  {g.toLowerCase()}
                </button>
              ))}
            </div>
          </Container>
        </section>

        <section className="relative">
          <div className="rule" />
          <Container className="py-8">
            {filteredBooks.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-ink-fg2 mb-4">No books in this genre.</p>
                <button
                  onClick={() => setSelectedGenre('All')}
                  className="px-3 py-1.5 border border-ink-line rounded-sm font-mono text-mono-sm text-ink-fg2 hover:border-teal-dim hover:text-teal transition-colors"
                >
                  clear filter
                </button>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredBooks.map((book, i) => (
                  <BookRow key={book.id} book={book} index={i} />
                ))}
              </AnimatePresence>
            )}
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
