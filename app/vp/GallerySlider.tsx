"use client";

import { useEffect, useRef, useState } from "react";

type Slide = {
  src: string;
  alt?: string;
};

export default function GallerySlider({ images }: { images: Slide[] }) {
  const base = images;
  const repeats = 30;
  const extended = Array.from({ length: repeats }, () => base).flat();

  const middleIndex = Math.floor(extended.length / 2);
  const [index, setIndex] = useState(middleIndex);

  const trackRef = useRef<HTMLDivElement>(null);

  const isDesktop =
    typeof window !== "undefined" && window.innerWidth >= 768;

  // =========================
  // SWIPE STATE
  // =========================
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const SWIPE_THRESHOLD = 50;

  // =========================
  // CENTER ACTIVE
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
  // LOOP FIX
  // =========================
  useEffect(() => {
    const len = extended.length;
    const segment = base.length;

    if (index > len - segment * 5 || index < segment * 5) {
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
  // TOUCH
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

    if (delta > SWIPE_THRESHOLD) next();
    if (delta < -SWIPE_THRESHOLD) prev();

    setTouchStartX(null);
    setTouchEndX(null);
  };

  // =========================
  // RENDER
  // =========================
  return (
    <section className="w-full bg-black py-16">
      <div className="mx-auto w-full px-4 md:px-8">

        {/* CONTROLS */}
        <div className="mb-8 flex justify-end gap-3">
          <button onClick={prev} className="h-9 w-9 border border-white/40 text-white rounded-full">‹</button>
          <button onClick={next} className="h-9 w-9 border border-white/40 text-white rounded-full">›</button>
        </div>

        {/* VIEWPORT */}
        <div
          className="relative overflow-hidden w-full h-[560px]"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div
            ref={trackRef}
            className="absolute left-0 bottom-0 flex gap-8 will-change-transform"
          >
            {extended.map((img, i) => {
              const isActive = i === index;

              const width = isDesktop
                ? isActive ? 420 : 240
                : isActive ? 300 : 220;

              const height = isDesktop
                ? isActive ? 560 : 360
                : isActive ? 440 : 320;

              const scale = isActive ? 1.08 : 1;

              return (
                <div
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`flex items-center justify-center cursor-pointer ${
                    isActive ? "z-10" : "opacity-40"
                  }`}
                  style={{
                    width,
                    height: 560,
                    transition: "all 0.8s cubic-bezier(0.16,1,0.3,1)",
                  }}
                >
                  <img
                    src={img.src}
                    alt={img.alt ?? ""}
                    draggable={false}
                    className="rounded object-cover select-none pointer-events-none"
                    style={{
                      width,
                      height,
                      transform: `scale(${scale})`,
                      transition: "all 0.8s cubic-bezier(0.16,1,0.3,1)",
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
