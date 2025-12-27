'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { TransitionLink } from './transitions/TransitionLink';

function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home', gradient: 'from-[#FF6B6B] to-[#FEC601]' },
    { href: '/projects', label: 'Projects', gradient: 'from-[#FEC601] to-[#52B788]' },
    { href: '/resume', label: 'Resume', gradient: 'from-[#52B788] to-[#4A90E2]' },
    { href: '/journey', label: 'Journey', gradient: 'from-[#4A90E2] to-[#8B5CF6]' },
    { href: '/blog', label: 'Blog', gradient: 'from-[#8B5CF6] to-[#00F5FF]' },
    { href: '/booklist', label: 'Booklist', gradient: 'from-[#00F5FF] to-[#FF6B6B]' },
  ];

  return (
    <motion.nav 
      className="glass-dark text-white p-4 flex justify-between items-center sticky top-0 z-50 border-b border-white/10"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <TransitionLink href="/">
        <motion.div 
          className="text-2xl font-bold bg-gradient-to-r from-[#FF6B6B] via-[#FEC601] to-[#52B788] bg-clip-text text-transparent cursor-pointer"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          AdiPrabs
        </motion.div>
      </TransitionLink>
      
      <div className="space-x-2 md:space-x-4 flex items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <TransitionLink key={item.href} href={item.href}>
              <motion.div 
                className="relative group px-3 py-2 rounded-lg transition-all cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className={`relative z-10 text-sm md:text-base ${isActive ? 'font-bold' : ''}`}>
                  {item.label}
                </span>
                <motion.div 
                  className={`absolute inset-0 bg-gradient-to-r ${item.gradient} rounded-lg blur-sm transition-opacity ${
                    isActive ? 'opacity-70' : 'opacity-0 group-hover:opacity-70'
                  }`}
                  initial={{ opacity: isActive ? 0.7 : 0 }}
                  whileHover={{ opacity: 0.7 }}
                />
              </motion.div>
            </TransitionLink>
          );
        })}
        

      </div>
    </motion.nav>
  );
}

export default Navbar;
