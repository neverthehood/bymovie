"use client";

import { useState, useEffect, useCallback, useRef } from "react";


const projects = [
  {
    id: 1,
    video: "https://vfq5uwwui8otjfkn.public.blob.vercel-storage.com/RISE_TOWER_ENG.webm",
    poster: "https://vfq5uwwui8otjfkn.public.blob.vercel-storage.com/RISE_TOWER_ENG.jpg",
    title: "Rise Tower",
    category: "TVC",
  },
  {
    id: 2,
    video: "https://vfq5uwwui8otjfkn.public.blob.vercel-storage.com/Police%20in%20Paris_%D1%8F%D1%81%D1%8C_By%20Movie.webm",
    poster: "https://vfq5uwwui8otjfkn.public.blob.vercel-storage.com/Police%20in%20Paris_%D1%8F%D1%81%D1%8C_By%20Movie.jpg",
    title: "POLICE IN PARIS",
    category: "Music video",
  },
  {
    id: 3,
    video: "https://vfq5uwwui8otjfkn.public.blob.vercel-storage.com/Mercedes-Benz%20EQS%20-%20Existing%20Now%281%29.webm",
    poster: "https://vfq5uwwui8otjfkn.public.blob.vercel-storage.com/%D0%A1%D0%BD%D0%B8%D0%BC%D0%BE%D0%BA-%D1%8D%D0%BA%D1%80%D0%B0%D0%BD%D0%B0-2025-12-17-005628.webp",
    title: "Mercedes-Benz EQS - Existing Now",
    category: "TVC",
  },
  {
    id: 4,
    video: "https://vfq5uwwui8otjfkn.public.blob.vercel-storage.com/Blockchain-Sports-Teaser.webm",
    poster: "https://vfq5uwwui8otjfkn.public.blob.vercel-storage.com/%D0%A1%D0%BD%D0%B8%D0%BC%D0%BE%D0%BA-%D1%8D%D0%BA%D1%80%D0%B0%D0%BD%D0%B0-2025-12-17-012048.webp",
    title: "Blockchain Sports",
    category: "Teaser. TVC",
  },
  {
    id: 5,
    video: "https://vfq5uwwui8otjfkn.public.blob.vercel-storage.com/Advertising-video-for-BELARUSBANK-Mastercard%D0%A0%D0%B5%D0%BA%D0%BB%D0%B0%D0%BC%D0%BD%D1%8B%D0%B9-%D0%B2%D0%B8%D0%B4%D0%B5%D0%BE%D1%80%D0%BE%D0%BB%D0%B8%D0%BA_1.webm",
    poster: "https://vfq5uwwui8otjfkn.public.blob.vercel-storage.com/%D0%A1%D0%BD%D0%B8%D0%BC%D0%BE%D0%BA-%D1%8D%D0%BA%D1%80%D0%B0%D0%BD%D0%B0-2025-12-17-014649.webp",
    title: "Mastercard/Belarusbank",
    category: "TVC",
  },
  {
    id: 6,
    video: "https://vfq5uwwui8otjfkn.public.blob.vercel-storage.com/JGGL.AI-COMMERCIAL.webm",
    poster: "https://vfq5uwwui8otjfkn.public.blob.vercel-storage.com/%D0%A1%D0%BD%D0%B8%D0%BC%D0%BE%D0%BA-%D1%8D%D0%BA%D1%80%D0%B0%D0%BD%D0%B0-2025-12-17-012659.webp",
    title: "JGGL.AI",
    category: "COMMERCIAL. TVC",
  },
  {
    id: 7,
    video: "https://vfq5uwwui8otjfkn.public.blob.vercel-storage.com/%D0%A7%D1%91%D1%80%D0%BD%D1%8B%D0%B9%20%D1%80%D1%8B%D0%BD%D0%BE%D0%BA%20_%20%D0%9C%D0%B8%D1%80%20%D1%82%D0%B0%D0%BD%D0%BA%D0%BE%D0%B2.webm",
    poster: "https://vfq5uwwui8otjfkn.public.blob.vercel-storage.com/%D0%A7%D1%91%D1%80%D0%BD%D1%8B%D0%B9%20%D1%80%D1%8B%D0%BD%D0%BE%D0%BA%20_%20%D0%9C%D0%B8%D1%80%20%D1%82%D0%B0%D0%BD%D0%BA%D0%BE%D0%B2.jpg",
    title: "WG - Black Market",
    category: "Promo",
  },
  {
    id: 8,
    video: "https://vfq5uwwui8otjfkn.public.blob.vercel-storage.com/MATIES_VKYS_OTBORNOJ_SELDI_RB_30sec_FHD_preview.webm",
    poster:
      "https://vfq5uwwui8otjfkn.public.blob.vercel-storage.com/MATIES_VKYS_OTBORNOJ_SELDI_RB_30sec_FHD_preview.jpg",
    title: "MATIAS",
    category: "TVC",
  },
  {
    id: 9,
    video: "https://vfq5uwwui8otjfkn.public.blob.vercel-storage.com/Black.webm",
    poster: "https://vfq5uwwui8otjfkn.public.blob.vercel-storage.com/Black.jpg",
    title: "SBER/Mastercard",
    category: "TVC",
  },
  {
    id: 10,
    video: "https://vfq5uwwui8otjfkn.public.blob.vercel-storage.com/Trailer%20Chess.webm",
    poster: "https://vfq5uwwui8otjfkn.public.blob.vercel-storage.com/Trailer%20Chess.jpg",
    title: "Chess",
    category: "CGI for movie promo",
  },
];

export default function ProjectsSection() {
  const [active, setActive] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // 🔹 refs ДЛЯ КАЖДОГО видео
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // mobile detect
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ▶️ play / pause ТОЛЬКО активного видео
  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;

      if (!isMobile && active === i) {
        video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [active, isMobile]);

  return (
    <section id="projects" className="w-full bg-black text-white pt-28 pb-40">
      <h2 className="text-center text-5xl font-bold mb-16">PROJECTS</h2>

      <div
        className={`max-w-[1600px] mx-auto px-6 grid gap-10 ${
          isMobile ? "grid-cols-1" : "grid-cols-2"
        }`}
      >
        {projects.map((p, idx) => {
          const isActive = active === idx && !isMobile;

          return (
            <div
              key={p.id}
              onMouseEnter={() => !isMobile && setActive(idx)}
              onMouseLeave={() => !isMobile && setActive(null)}
              className={`relative w-full overflow-hidden cursor-pointer transition-all duration-300
                ${!isMobile && active !== null && !isActive ? "blur-sm brightness-[0.45]" : ""}
                ${isMobile ? "h-[480px]" : "h-[420px]"}
              `}
            >
              {/* 🎥 VIDEO */}
              <video
  ref={(el) => {
    videoRefs.current[idx] = el;
  }}
  src={p.video}
  poster={p.poster}
  muted
  loop
  playsInline
  preload="metadata"
  autoPlay={isMobile}
  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500
    ${isActive || isMobile ? "opacity-100" : "opacity-80"}
  `}
/>


              {/* TEXT */}
              <div
                className={`absolute bottom-6 left-6 transition-all duration-300
                  ${
                    isMobile || isActive
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-2"
                  }
                `}
              >
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
