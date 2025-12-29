"use client";

import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import Image from "next/image";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ================= DESKTOP NAV (НЕ ТРОГАЕМ) ================= */}
      <nav
        className="
          fixed -top-5 left-0 w-full z-[999]
          hidden md:flex items-center justify-between
          px-16 py-8
          text-white text-base tracking-[0.18em]
        "
      >
        <div className="flex gap-44">
          <a href="#weare" className="uppercase hover:text-[#D7F000] transition">
            We Are
          </a>
          <a href="#services" className="uppercase hover:text-[#D7F000] transition">
            Services
          </a>
        </div>

        <a href="/" className="flex items-center justify-center">
          <Image
            src="/images/logo.png"
            alt="BYMOVIE Logo"
            width={160}
            height={40}
            className="object-contain w-[160px] h-auto"
            priority
          />
        </a>

        <div className="flex gap-44">
          <a href="#projects" className="uppercase hover:text-[#D7F000] transition">
            Projects
          </a>
          <a href="#contacts" className="uppercase hover:text-[#D7F000] transition">
            Contacts
          </a>
        </div>
      </nav>

      {/* ================= MOBILE TOP BAR (ЖЁСТКО ФИКСИМ) ================= */}
      <div
        className="
          fixed top-0 left-0 w-full z-[999]
          flex md:hidden items-center justify-between
          px-6 py-3
          text-white
        "
      >
        {/* ❗ Обычный img — 100% контроль размера */}
        <a href="/" className="flex items-center">
          <img
            src="/images/logo.png"
            alt="BYMOVIE Logo"
            className="h-[40px] w-auto object-contain"
          />
        </a>

        <button onClick={() => setOpen(true)}>
          <FiMenu size={24} />
        </button>
      </div>

      {/* ================= MOBILE FULLSCREEN MENU ================= */}
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
            className="absolute top-5 right-5"
            onClick={() => setOpen(false)}
          >
            <FiX size={28} />
          </button>

          {/* логотип в меню — тоже обычный img */}
          <a href="/" onClick={() => setOpen(false)} className="mb-8">
            <img
              src="/images/logo.png"
              alt="BYMOVIE Logo"
              className="h-[24px] w-auto object-contain"
            />
          </a>

          <a href="#weare" onClick={() => setOpen(false)}>We Are</a>
          <a href="#services" onClick={() => setOpen(false)}>Services</a>
          <a href="#projects" onClick={() => setOpen(false)}>Projects</a>
          <a href="#contacts" onClick={() => setOpen(false)}>Contacts</a>
        </div>
      )}
    </>
  );
}
