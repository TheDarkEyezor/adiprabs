import React from 'react'

function Navbar() {
  return (
    <nav className="bg-[#040303] text-white p-4 flex justify-between items-center">
      <a href="/" className="text-2xl font-bold">AdiPrabs</a>
      <div className="space-x-4">
        <a href="" className="hover:text-[#FEC601] transition-colors">Projects</a>
        <a href="https://www.linkedin.com/in/adiprabs/details/experience/" className="hover:text-[#FEC601] transition-colors">Experience</a>
        <a href="" className="hover:text-[#FEC601] transition-colors">Booklist</a>
        <a href="https://substack.com/@adityaprabakaran" className="hover:text-[#FEC601] transition-colors">Blog</a>
      </div>
    </nav>
    )
  }

  export default Navbar
