"use client";

import { useState } from "react";
import MobileMenu from "./MobileMenu";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="
      fixed top-0 left-0 w-full z-50 
      px-6 py-5 flex justify-between items-center
      bg-black/20 backdrop-blur-md
    ">
      
      {/* LOGO */}
      <a href="/" className="text-[#DFFF52] text-xl font-anybody tracking-tight">
        BYMOVIE
      </a>

      {/* DESKTOP MENU */}
      <nav className="hidden md:flex gap-10 text-sm font-anybodyCondensed tracking-wider">
        <a href="#weare" className="hover:text-[#DFFF52] transition">WE ARE</a>
        <a href="#services" className="hover:text-[#DFFF52] transition">SERVICES</a>
        <a href="#howwework" className="hover:text-[#DFFF52] transition">HOW WE WORK</a>
        <a href="#projects" className="hover:text-[#DFFF52] transition">PROJECTS</a>
        <a href="#contacts" className="hover:text-[#DFFF52] transition">CONTACTS</a>
      </nav>

      {/* BURGER */}
      <button 
        className="md:hidden text-white text-3xl" 
        onClick={() => setOpen(true)}
      >
        ≡
      </button>

      <MobileMenu open={open} setOpen={setOpen} />
    </header>
  );
}
