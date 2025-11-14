"use client";

export default function MobileMenu({ open, setOpen }) {
  return (
    <div
      className={`
        fixed inset-0 bg-black text-white z-50 
        flex flex-col items-center justify-center
        text-3xl font-anybodyCondensed tracking-wider
        transition-all duration-300
        ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
      `}
    >
      {/* Close button */}
      <button 
        onClick={() => setOpen(false)} 
        className="absolute top-6 right-6 text-5xl"
      >
        ×
      </button>

      {/* Menu items */}
      <a href="#weare" onClick={() => setOpen(false)}>WE ARE</a>
      <a href="#services" onClick={() => setOpen(false)}>SERVICES</a>
      <a href="#howwework" onClick={() => setOpen(false)}>HOW WE WORK</a>
      <a href="#projects" onClick={() => setOpen(false)}>PROJECTS</a>
      <a href="#contacts" onClick={() => setOpen(false)}>CONTACTS</a>
    </div>
  );
}
