"use client";

import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* DESKTOP NAV */}
      <nav className="fixed top-0 left-0 w-full z-[999] hidden md:flex items-center justify-between px-12 py-6 text-white text-sm tracking-[0.18em]">
        {/* LEFT */}
        <div className="flex gap-10">
          <a href="#about" className="uppercase">About</a>
          <a href="#services" className="uppercase">Services</a>
        </div>

        {/* CENTER LOGO */}
        <div className="text-[#D7F000] font-bold uppercase tracking-[0.25em]">
          BY MOVIE
        </div>

        {/* RIGHT */}
        <div className="flex gap-10">
          <a href="#projects" className="uppercase">Projects</a>
          <a href="#contacts" className="uppercase">Contacts</a>
        </div>
      </nav>

      {/* MOBILE NAV TOP BAR */}
      <div className="fixed top-0 left-0 w-full z-[999] flex md:hidden items-center justify-between px-6 py-6 text-white">
        <div className="text-[#D7F000] font-bold uppercase tracking-[0.25em]">
          BY MOVIE
        </div>

        <button onClick={() => setOpen(true)}>
          <FiMenu size={26} />
        </button>
      </div>

      {/* MOBILE FULLSCREEN MENU */}
      {open && (
        <div className="
          fixed inset-0 bg-black z-[9999]
          flex flex-col items-center justify-center
          text-white text-3xl gap-10 uppercase
          tracking-[0.2em]
        ">
          <button
            className="absolute top-6 right-6"
            onClick={() => setOpen(false)}
          >
            <FiX size={28} />
          </button>

          <a href="#about" onClick={() => setOpen(false)}>About</a>
          <a href="#services" onClick={() => setOpen(false)}>Services</a>
          <a href="#projects" onClick={() => setOpen(false)}>Projects</a>
          <a href="#contacts" onClick={() => setOpen(false)}>Contacts</a>
        </div>
      )}
    </>
  );
}
