"use client";

import { useState, useEffect, useRef } from "react";

export default function ProjectsSection() {
  const [active, setActive] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ▶️ управление видео
  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;

      if (active === i) {
        if (!video.src) {
          video.src = projects[i].video;
          video.load();
        }
        video.play().catch(() => {});
      } else {
        video.pause();
        video.removeAttribute("src");
        video.load(); // возвращает постер
      }
    });
  }, [active]);

  return (
    <section id="projects" className="w-full bg-black text-white pt-28 pb-40">
      <h2 className="text-center text-5xl font-bold mb-16">PROJECTS</h2>

      <div
        className={`max-w-[1600px] mx-auto px-6 grid gap-10 ${
          isMobile ? "grid-cols-1" : "grid-cols-2"
        }`}
      >
        {projects.map((p, idx) => {
          const isActive = active === idx;

          return (
            <div
              key={p.id}
              onClick={() =>
                setActive((prev) => (prev === idx ? null : idx))
              }
              className={`
                relative w-full overflow-hidden cursor-pointer
                transition-all duration-300
                ${isMobile ? "h-[480px]" : "h-[420px]"}
              `}
            >
              {/* 🎥 VIDEO */}
              <video
                ref={(el) => {
                  videoRefs.current[idx] = el;
                }}
                poster={p.poster}
                muted
                loop
                playsInline
                preload="none"
                className={`
                  absolute inset-0 w-full h-full object-cover
                  transition-opacity duration-500
                  ${isActive ? "opacity-100" : "opacity-90"}
                `}
              />

              {/* ▶ PLAY ICON */}
              {!isActive && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="w-16 h-16 rounded-full bg-black/60 flex items-center justify-center">
                    <div className="w-0 h-0 border-l-[14px] border-l-white border-y-[10px] border-y-transparent ml-1" />
                  </div>
                </div>
              )}

              {/* TEXT */}
              <div className="absolute bottom-6 left-6 z-20">
                <div className="text-white/80 mb-1">{p.title}</div>
                <div className="text-white/40">{p.category}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
