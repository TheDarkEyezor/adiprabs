import React from 'react'

function Navbar() {
  return (
    <nav className="bg-[#040303] text-white p-4 flex justify-between items-center">
      <a href="/" className="text-2xl font-bold">Logo</a>
      <div className="space-x-4">
        <a href="/projects" className="hover:text-[#FEC601] transition-colors">Projects</a>
        <a href="#experience" className="hover:text-[#FEC601] transition-colors">Experience</a>
        <a href="#booklist" className="hover:text-[#FEC601] transition-colors">Booklist</a>
        <a href="#about" className="hover:text-[#FEC601] transition-colors">Blog</a>
        <a href="#about" className="hover:text-[#FEC601] transition-colors">About</a>
      </div>
    </nav>
    )
  }

  export default Navbar
