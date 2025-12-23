"use client";

import { useEffect, useRef, useState } from "react";

type Slide = {
  src: string;
  alt?: string;
};

export default function GallerySlider({ images }: { images: Slide[] }) {
  // --- infinite track ---
  const base = images;
  const repeats = 30;
  const extended = Array.from({ length: repeats }, () => base).flat();

  const middleIndex = Math.floor(extended.length / 2);
  const [index, setIndex] = useState(middleIndex);

  const trackRef = useRef<HTMLDivElement>(null);

  const isDesktop =
    typeof window !== "undefined" && window.innerWidth >= 768;

  // =========================
  // SWIPE STATE (mobile)
  // =========================
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const SWIPE_THRESHOLD = 50;

  // =========================
  // CENTER ACTIVE SLIDE
  // =========================
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const activeEl = track.children[index] as HTMLElement;
    if (!activeEl) return;

    const screenWidth = window.innerWidth;
    const offset =
      activeEl.offsetLeft +
      activeEl.clientWidth / 2 -
      screenWidth / 2;

    track.style.transition =
      "transform 0.9s cubic-bezier(0.16,1,0.3,1)";
    track.style.transform = `translateX(-${offset}px)`;
  }, [index]);

  // =========================
  // LOOP CORRECTION
  // =========================
  useEffect(() => {
    const len = extended.length;
    const segment = base.length;

    if (index > len - segment * 5) {
      requestAnimationFrame(() => {
        if (!trackRef.current) return;
        trackRef.current.style.transition = "none";
        setIndex(middleIndex);
      });
    }

    if (index < segment * 5) {
      requestAnimationFrame(() => {
        if (!trackRef.current) return;
        trackRef.current.style.transition = "none";
        setIndex(middleIndex);
      });
    }
  }, [index, extended.length, base.length, middleIndex]);

  // =========================
  // CONTROLS
  // =========================
  const next = () => setIndex((i) => i + 1);
  const prev = () => setIndex((i) => i - 1);

  // =========================
  // TOUCH HANDLERS
  // =========================
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchStartX(e.touches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.touches[0].clientX);
  };

  const onTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return;

    const delta = touchStartX - touchEndX;

    if (delta > SWIPE_THRESHOLD) next(); // swipe left
    if (delta < -SWIPE_THRESHOLD) prev(); // swipe right

    setTouchStartX(null);
    setTouchEndX(null);
  };

  // =========================
  // RENDER
  // =========================
  return (
    <section className="w-full bg-black py-16" id="gallery">
      <div className="mx-auto w-full px-4 md:px-8">

        {/* HEADER */}
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-white font-anybody text-xl tracking-[0.25em] uppercase" />
          <div className="flex gap-3">
            <button
              onClick={prev}
              className="h-9 w-9 rounded-full border border-white/40 text-white flex items-center justify-center hover:bg-white hover:text-black transition"
            >
              ‹
            </button>
            <button
              onClick={next}
              className="h-9 w-9 rounded-full border border-white/40 text-white flex items-center justify-center hover:bg-white hover:text-black transition"
            >
              ›
            </button>
          </div>
        </div>

        {/* VIEWPORT (SWIPE HERE) */}
        <div
          className="relative overflow-hidden w-full h-[560px]"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div
            ref={trackRef}
            className="absolute left-0 bottom-0 flex gap-10 will-change-transform"
          >
            {extended.map((img, i) => {
              const isActive = i === index;

              return (
                <div
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`
                    cursor-pointer flex items-center h-[560px]
                    ${isActive ? "z-10" : "opacity-35"}
                  `}
                  style={{
                    width:
                      isActive && isDesktop ? "420px" : "240px",
                    transition:
                      "all 1s cubic-bezier(0.16,1,0.3,1)",
                  }}
                >
                  <img
                    src={img.src}
                    alt={img.alt ?? ""}
                    className="object-cover rounded mx-auto select-none pointer-events-none"
                    draggable={false}
                    style={{
                      height:
                        isActive && isDesktop
                          ? "560px"
                          : "360px",
                      transform:
                        isActive && isDesktop
                          ? "scale(1.12)"
                          : "scale(1)",
                      transition:
                        "all 1s cubic-bezier(0.16,1,0.3,1)",
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
