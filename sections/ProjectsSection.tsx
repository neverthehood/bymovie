"use client";

import { useState, useEffect } from "react";

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
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const closeModal = () => setModalIndex(null);
  const next = () =>
    setModalIndex((i) => (i === null ? null : (i + 1) % projects.length));
  const prev = () =>
    setModalIndex((i) =>
      i === null ? null : (i - 1 + projects.length) % projects.length
    );

  return (
    <section id="projects" className="w-full bg-black text-white pt-28 pb-40">
      <h2 className="text-center text-5xl font-bold mb-16">PROJECTS</h2>

      <div
        className={`max-w-[1600px] mx-auto px-6 grid gap-10 ${
          isMobile ? "grid-cols-1" : "grid-cols-2"
        }`}
      >
        {projects.map((p, idx) => (
          <div
            key={p.id}
            onClick={() => setModalIndex(idx)}
            className={`relative w-full cursor-pointer overflow-hidden
              ${isMobile ? "h-[480px]" : "h-[420px]"}
            `}
          >
            {/* POSTER (НЕ VIDEO!) */}
            <img
              src={p.poster}
              alt={p.title}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-[1.03]"
            />

            {/* Play icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-black/60 flex items-center justify-center">
                <div className="w-0 h-0 border-l-[14px] border-l-white border-y-[10px] border-y-transparent ml-1" />
              </div>
            </div>

            {/* Text */}
            <div className="absolute bottom-6 left-6">
              <div className="text-white/80 mb-1">{p.title}</div>
              <div className="text-white/40">{p.category}</div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {modalIndex !== null && (
        <div
          className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={closeModal}
        >
          <div
            className="relative max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              src={projects[modalIndex].video}
              poster={projects[modalIndex].poster}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-contain rounded-lg"
            />

            <button
              className="absolute -top-10 right-0 text-white text-4xl"
              onClick={closeModal}
            >
              ×
            </button>

            <button
              className="absolute left-[-60px] top-1/2 -translate-y-1/2 text-white text-4xl hidden md:block"
              onClick={prev}
            >
              ‹
            </button>

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
