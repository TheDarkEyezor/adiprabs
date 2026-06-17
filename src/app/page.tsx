import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/home/Hero';
import Now from './components/home/Now';
import Work from './components/home/Work';
import SelectedProjects from './components/home/SelectedProjects';
import About from './components/home/About';
import ContactCTA from './components/home/Contact';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <Now />
        <Work />
        <SelectedProjects />
        <About />
        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}
