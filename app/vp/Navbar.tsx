"use client";

import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import Image from "next/image";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* NAVBAR */}
      <nav
        className="
          fixed top-0 left-0 w-full z-[999]
          flex items-center
          px-6 md:px-16
          py-5 md:py-8
          text-white tracking-[0.18em]
        "
      >
        {/* LEFT (mobile: logo, desktop: menu) */}
        <div className="flex items-center flex-1">
          {/* DESKTOP LEFT MENU */}
          <div className="hidden md:flex gap-44">
            <a href="#weare" className="uppercase hover:text-[#D7F000] transition">
              We Are
            </a>
            <a href="#services" className="uppercase hover:text-[#D7F000] transition">
              Services
            </a>
          </div>

          {/* MOBILE LOGO (left) */}
          <div className="md:hidden">
            <Image
              src="/images/logo.png"
              alt="BYMOVIE Logo"
              width={105}
              height={28}
              style={{ height: 18, width: "auto" }} // 💥 гарантированно работает
              priority
            />
          </div>
        </div>

        {/* CENTER LOGO (desktop only) */}
        <div className="hidden md:flex flex-1 justify-center">
          <Image
            src="/images/logo.png"
            alt="BYMOVIE Logo"
            width={160}
            height={40}
            className="object-contain"
            priority
          />
        </div>

        {/* RIGHT */}
        <div className="flex items-center justify-end flex-1">
          {/* DESKTOP RIGHT MENU */}
          <div className="hidden md:flex gap-44">
            <a href="#projects" className="uppercase hover:text-[#D7F000] transition">
              Projects
            </a>
            <a href="#contacts" className="uppercase hover:text-[#D7F000] transition">
              Contacts
            </a>
          </div>

          {/* MOBILE BURGER */}
          <button className="md:hidden" onClick={() => setOpen(true)}>
            <FiMenu size={26} />
          </button>
        </div>
      </nav>

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
          <button
            className="absolute top-6 right-6"
            onClick={() => setOpen(false)}
          >
            <FiX size={28} />
          </button>

          {/* SAME LOGO, BUT SMALL */}
          <Image
            src="/images/logo.png"
            alt="BYMOVIE Logo"
            width={105}
            height={28}
            style={{ height: 24, width: "auto" }}
            className="mb-8"
          />

          <a href="#weare" onClick={() => setOpen(false)}>We Are</a>
          <a href="#services" onClick={() => setOpen(false)}>Services</a>
          <a href="#projects" onClick={() => setOpen(false)}>Projects</a>
          <a href="#contacts" onClick={() => setOpen(false)}>Contacts</a>
        </div>
      )}
    </>
  );
}
