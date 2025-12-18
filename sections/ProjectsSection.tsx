"use client";

import { useState, useEffect, useCallback } from "react";

const projects = [
  {
    id: 1,
    video: "https://pub-6b170c422cda4d44a90de5f670525527.r2.dev/RISE_TOWER_ENG.webm",
    poster: "https://pub-6b170c422cda4d44a90de5f670525527.r2.dev/Rise-Tower.webp",
    title: "Rise Tower",
    category: "TVC",
  },
  {
    id: 2,
    video: "https://pub-6b170c422cda4d44a90de5f670525527.r2.dev/Police%20in%20Paris_%D1%8F%D1%81%D1%8C_By%20Movie.webm",
    poster: "https://pub-6b170c422cda4d44a90de5f670525527.r2.dev/Police-in-Paris.webp",
    title: "POLICE IN PARIS",
    category: "Music video",
  },
  {
    id: 3,
    video: "https://pub-6b170c422cda4d44a90de5f670525527.r2.dev/Mercedes-Benz%20EQS%20-%20Existing%20Now(1).webm",
    poster: "https://pub-6b170c422cda4d44a90de5f670525527.r2.dev/mercedes-1.webp",
    title: "Mercedes-Benz EQS - Existing Now",
    category: "TVC",
  },
  {
    id: 4,
    video: "https://pub-6b170c422cda4d44a90de5f670525527.r2.dev/Blockchain-Sports-Teaser.webm",
    poster: "https://pub-6b170c422cda4d44a90de5f670525527.r2.dev/Blockchain-Sports-Teaser.webp",
    title: "Blockchain Sports",
    category: "Teaser. TVC",
  },
  {
    id: 5,
    video: "https://pub-6b170c422cda4d44a90de5f670525527.r2.dev/Advertising-video-for-BELARUSBANK-Mastercard%D0%A0%D0%B5%D0%BA%D0%BB%D0%B0%D0%BC%D0%BD%D1%8B%D0%B9-%D0%B2%D0%B8%D0%B4%D0%B5%D0%BE%D1%80%D0%BE%D0%BB%D0%B8%D0%BA_1.webm",
    poster: "https://pub-6b170c422cda4d44a90de5f670525527.r2.dev/Belarusbank.webp",
    title: "Mastercard/Belarusbank",
    category: "TVC",
  },
  {
    id: 6,
    video: "https://pub-6b170c422cda4d44a90de5f670525527.r2.dev/JGGL.AI-COMMERCIAL.webm",
    poster: "https://pub-6b170c422cda4d44a90de5f670525527.r2.dev/JGGL.AI-COMMERCIAL.webp",
    title: "JGGL.AI",
    category: "COMMERCIAL. TVC",
  },
  {
    id: 7,
    video: "https://pub-6b170c422cda4d44a90de5f670525527.r2.dev/%D0%A7%D1%91%D1%80%D0%BD%D1%8B%D0%B9%20%D1%80%D1%8B%D0%BD%D0%BE%D0%BA%20_%20%D0%9C%D0%B8%D1%80%20%D1%82%D0%B0%D0%BD%D0%BA%D0%BE%D0%B2.webm,
    poster: "https://pub-6b170c422cda4d44a90de5f670525527.r2.dev/black-market.webp",
    title: "WG - Black Market",
    category: "Promo",
  },
  {
    id: 8,
    video: "https://pub-6b170c422cda4d44a90de5f670525527.r2.dev/MATIES_VKYS_OTBORNOJ_SELDI_RB_30sec_FHD_preview.webm",
    poster: "https://pub-6b170c422cda4d44a90de5f670525527.r2.dev/matias.webp",
    title: "MATIAS",
    category: "TVC",
  },
  {
    id: 9,
    video: "https://vfq5uwwui8otjfkn.public.blob.vercel-storage.com/Black.webm",
    poster: "https://pub-6b170c422cda4d44a90de5f670525527.r2.dev/sber.webp",
    title: "SBER/Mastercard",
    category: "TVC",
  },
  {
    id: 10,
    video: "https://pub-6b170c422cda4d44a90de5f670525527.r2.dev/Trailer%20Chess.webm",
    poster: "https://pub-6b170c422cda4d44a90de5f670525527.r2.dev/chess.webp",
    title: "Chess",
    category: "CGI for movie promo",
  },
];

export default function ProjectsSection() {
  const [active, setActive] = useState<number | null>(null);
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // swipe-down support
  const [touchStartY, setTouchStartY] = useState(0);
  const [touchCurrentY, setTouchCurrentY] = useState(0);

  // mobile detection
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ESC close modal
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalIndex(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const closeModal = useCallback(() => setModalIndex(null), []);

  const next = () => {
    if (modalIndex === null) return;
    setModalIndex((modalIndex + 1) % projects.length);
  };

  const prev = () => {
    if (modalIndex === null) return;
    setModalIndex((modalIndex - 1 + projects.length) % projects.length);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchCurrentY(e.touches[0].clientY);
  };

  const onTouchEnd = () => {
    if (touchCurrentY - touchStartY > 80) closeModal();
    setTouchCurrentY(0);
  };

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
              key={idx}
              onClick={() => setModalIndex(idx)}
              onMouseEnter={() => !isMobile && setActive(idx)}
              onMouseLeave={() => !isMobile && setActive(null)}
              className={`relative w-full overflow-hidden cursor-pointer transition-all duration-300
                ${!isMobile && active !== null && !isActive ? "blur-sm brightness-[0.45]" : ""}
                ${isMobile ? "h-[480px]" : "h-[420px]"}
              `}
            >
              {/* VIDEO PREVIEW */}
              <video
                src={p.video}
                poster={p.poster}
                muted
                loop
                playsInline
                autoPlay={isMobile}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-700
                  ${isActive ? "opacity-100" : isMobile ? "opacity-100" : "opacity-80"}
                `}
              />

              {/* Decorative corners */}
              {!isMobile && (
                <div
                  className={`pointer-events-none absolute inset-0 transition-all duration-300 ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#D7F000]" />
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#D7F000]" />
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#D7F000]" />
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#D7F000]" />
                </div>
              )}

              {/* Text overlay */}
              <div
                className={`absolute bottom-6 left-6 max-w-[70%] leading-tight transition-all duration-300
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
                <div className="text-white/40">{p.category}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL */}
      {modalIndex !== null && (
        <div
          className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-fadeIn"
          onClick={closeModal}
        >
          <div
            className="relative max-w-[90vw] max-h-[90vh] scale-95 animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <video
              src={projects[modalIndex].video}
              poster={projects[modalIndex].poster}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-contain rounded-lg"
            />

            {/* Close */}
            <button
              className="absolute -top-10 right-0 text-white text-4xl"
              onClick={closeModal}
            >
              ×
            </button>

            {/* Prev */}
            <button
              className="absolute left-[-60px] top-1/2 -translate-y-1/2 text-white text-4xl hidden md:block"
              onClick={prev}
            >
              ‹
            </button>

            {/* Next */}
            <button
              className="absolute right-[-60px] top-1/2 -translate-y-1/2 text-white text-4xl hidden md:block"
              onClick={next}
            >
              ›
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
