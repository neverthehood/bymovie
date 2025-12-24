"use client";

import { useEffect, useRef, useState } from "react";

type Slide = {
  src: string;
  alt?: string;
};

export default function GallerySlider({ images }: { images: Slide[] }) {
  const repeats = 7; // ⬅️ было 30
  const extended = Array.from({ length: repeats }, () => images).flat();
  const middleIndex = Math.floor(extended.length / 2);

  const [index, setIndex] = useState(middleIndex);
  const [isDesktop, setIsDesktop] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);

  // =========================
  // DEVICE CHECK (SAFE)
  // =========================
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // =========================
  // CENTER ACTIVE
  // =========================
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const activeEl = track.children[index] as HTMLElement;
    if (!activeEl) return;

    const offset =
      activeEl.offsetLeft +
      activeEl.offsetWidth / 2 -
      window.innerWidth / 2;

    track.style.transition = "transform 0.6s cubic-bezier(0.16,1,0.3,1)";
    track.style.transform = `translateX(-${offset}px)`;
  }, [index]);

  // =========================
  // LOOP FIX (SAFE)
  // =========================
  useEffect(() => {
    const segment = images.length;
    if (index < segment || index > extended.length - segment) {
      setTimeout(() => {
        if (!trackRef.current) return;
        trackRef.current.style.transition = "none";
        setIndex(middleIndex);
      }, 0);
    }
  }, [index, extended.length, images.length, middleIndex]);

  // =========================
  // CONTROLS
  // =========================
  const next = () => setIndex((i) => i + 1);
  const prev = () => setIndex((i) => i - 1);

  // =========================
  // TOUCH
  // =========================
  const startX = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current === null) return;
    const delta = startX.current - e.changedTouches[0].clientX;

    if (delta > 50) next();
    if (delta < -50) prev();

    startX.current = null;
  };

  // =========================
  // RENDER
  // =========================
  return (
    <section className="w-full bg-black py-16">
      <div className="relative overflow-hidden h-[560px]">
        <div
          ref={trackRef}
          className="absolute left-0 bottom-0 flex gap-8"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {extended.map((img, i) => {
            const isActive = i === index;

            const baseW = isDesktop ? 240 : 220;
            const baseH = isDesktop ? 360 : 320;
            const scale = isActive ? 1.15 : 1;

            return (
              <div
                key={i}
                className={`flex items-center justify-center ${
                  isActive ? "z-10" : "opacity-40"
                }`}
                style={{
                  width: baseW,
                  height: baseH,
                  transition: "opacity 0.3s",
                }}
              >
                <img
                  src={img.src}
                  alt={img.alt ?? ""}
                  draggable={false}
                  className="rounded object-cover select-none pointer-events-none"
                  style={{
                    width: "100%",
                    height: "100%",
                    transform: `scale(${scale})`,
                    transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
