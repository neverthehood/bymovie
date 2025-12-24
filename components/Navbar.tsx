"use client";

import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import Image from "next/image";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* DESKTOP NAV */}
      <nav
        className="
          fixed -top-5 left-0 w-full z-[999] 
          hidden md:flex items-center justify-between 
          px-16 py-8 
          text-white text-base tracking-[0.18em]
        "
      >
        {/* LEFT */}
        <div className="flex gap-44">
          <a href="#weare" className="uppercase hover:text-[#D7F000] transition">
            We Are
          </a>
          <a href="#services" className="uppercase hover:text-[#D7F000] transition">
            Services
          </a>
        </div>

        {/* CENTER LOGO — заменён на картинку */}
        <a href="/" className="flex items-center justify-center">
          <Image
            src="/images/logo.png"
            alt="BYMOVIE Logo"
            width={160}
            height={40}
            className="object-contain"
            priority
          />
        </a>

        {/* RIGHT */}
        <div className="flex gap-44">
          <a href="#projects" className="uppercase hover:text-[#D7F000] transition">
            Projects
          </a>
          <a href="#contacts" className="uppercase hover:text-[#D7F000] transition">
            Contacts
          </a>
        </div>
      </nav>

      {/* MOBILE NAV TOP BAR */}
      <div className="fixed -top-2 left-0 w-full z-[999] flex md:hidden items-center justify-between px-6 py-6 text-white">
        
        {/* MOBILE LOGO — тоже картинка */}
        <a href="/" className="flex items-center">
          <Image
            src="/images/logo.png"
            alt="BYMOVIE Logo"
            width={105}
            height={28}
            className="object-contain"
            priority
          />
        </a>

        <button onClick={() => setOpen(true)}>
          <FiMenu size={26} />
        </button>
      </div>

      {/* MOBILE FULLSCREEN MENU */}
      {open && (
        <div
          className="
            fixed inset-0 bg-black z-[9999]
            flex flex-col items-center justify-center
            text-white text-3xl gap-10 uppercase
            tracking-[0.2em]
          "
        >
          <button className="absolute top-6 right-6" onClick={() => setOpen(false)}>
            <FiX size={28} />
          </button>

          <a href="#weare" onClick={() => setOpen(false)}>We Are</a>
          <a href="#services" onClick={() => setOpen(false)}>Services</a>
          <a href="#projects" onClick={() => setOpen(false)}>Projects</a>
          <a href="#contacts" onClick={() => setOpen(false)}>Contacts</a>
        </div>
      )}
    </>
  );
}
