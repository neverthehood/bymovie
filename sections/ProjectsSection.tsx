"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

const projects = [
  {
    id: 1,
    img: "/assets/projects/1.png",
    title: "M Le Monde – The Dutch Touch",
    author: "Jean-Baptiste Talbourdet Napoleone",
    category: "Commercials",
  },
  {
    id: 2,
    img: "/assets/projects/2.png",
    title: "M Le Monde – The Dutch Touch",
    author: "Jean-Baptiste Talbourdet Napoleone",
    category: "Commercials",
  },
  {
    id: 3,
    img: "/assets/projects/3.png",
    title: "M Le Monde – The Dutch Touch",
    author: "Jean-Baptiste Talbourdet Napoleone",
    category: "Commercials",
  },
  {
    id: 4,
    img: "/assets/projects/4.png",
    title: "M Le Monde – The Dutch Touch",
    author: "Jean-Baptiste Talbourdet Napoleone",
    category: "Commercials",
  },
  {
    id: 5,
    img: "/assets/projects/5.png",
    title: "M Le Monde – The Dutch Touch",
    author: "Jean-Baptiste Talbourdet Napoleone",
    category: "Commercials",
  },
  {
    id: 6,
    img: "/assets/projects/6.png",
    title: "M Le Monde – The Dutch Touch",
    author: "Jean-Baptiste Talbourdet Napoleone",
    category: "Commercials",
  },
];

export default function ProjectsSection() {
  const [active, setActive] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section
      id="projects"
      className="
        w-full bg-black text-white 
        pt-28   /* ← ДОБАВЛЕН ОТСТУП, чтобы заголовок Projects не прятался */
        pb-40
      "
    >
      <h2 className="text-center text-5xl font-bold mb-16">PROJECTS</h2>

      <div
        className={`
          max-w-[1600px] mx-auto px-6
          grid gap-10
          ${isMobile ? "grid-cols-1" : "grid-cols-2"}
        `}
      >
        {projects.map((p, idx) => {
          const isActive = active === idx && !isMobile;

          return (
            <div
              key={idx}
              onMouseEnter={() => !isMobile && setActive(idx)}
              onMouseLeave={() => !isMobile && setActive(null)}
              className={`
                relative w-full overflow-hidden cursor-pointer
                transition-all duration-300
                ${!isMobile && active !== null && !isActive ? "blur-sm brightness-[0.45]" : ""}
                ${isMobile ? "h-[480px]" : "h-[420px]"}
              `}
            >
              {/* IMAGE */}
              <Image
                src={p.img}
                alt={p.title}
                fill
                className="object-cover transition-all duration-700"
              />

              {/* CORNER FRAMES (only desktop) */}
              {!isMobile && (
                <div
                  className={`
                    pointer-events-none absolute inset-0 
                    transition-all duration-300
                    ${isActive ? "opacity-100" : "opacity-0"}
                  `}
                >
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#D7F000]" />
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#D7F000]" />
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#D7F000]" />
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#D7F000]" />
                </div>
              )}

              {/* TEXT */}
              <div
                className={`
                  absolute bottom-6 left-6 max-w-[70%]
                  text-white leading-tight
                  transition-all duration-300

                  ${
                    isMobile
                      ? "opacity-100 translate-y-0 text-base"
                      : isActive
                      ? "opacity-100 translate-y-0 text-sm"
                      : "opacity-0 translate-y-2 text-sm"
                  }
                `}
              >
                <div className="text-white/80 mb-1">{p.title}</div>
                <div className="text-white/60">{p.author}</div>
                <div className="text-white/40">{p.category}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
