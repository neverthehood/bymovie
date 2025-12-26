"use client";

import { useEffect, useRef, useState } from "react";

type Slide = {
  src: string;
  alt?: string;
};

export default function GallerySlider({ images }: { images: Slide[] }) {
  const total = images.length;
  const looped = [...images, ...images, ...images];
  const base = total;

  const [active, setActive] = useState(base);
  const trackRef = useRef<HTMLDivElement>(null);

  const isDesktop =
    typeof window !== "undefined" && window.innerWidth >= 768;

  const isIOS =
    typeof window !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent);

  // =========================
  // CONFIG
  // =========================
  const gap = 16;
  const snapW = 300;

  const scaleActive = isDesktop ? 1.08 : 1.06;

  // =========================
  // iOS: translate instead of scroll
  // =========================
  useEffect(() => {
    if (!isIOS) return;
    const el = trackRef.current;
    if (!el) return;

    const x = -(active * (snapW + gap));
    el.style.transform = `translateX(${x}px)`;
  }, [active, isIOS]);

  // =========================
  // CONTROLS
  // =========================
  const next = () => {
    setActive((i) =>
      i >= base + total - 1 ? base : i + 1
    );
  };

  const prev = () => {
    setActive((i) =>
      i <= base ? base + total - 1 : i - 1
    );
  };

  // =========================
  // TOUCH (iOS ONLY)
  // =========================
  const touchStart = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const delta =
      touchStart.current - e.changedTouches[0].clientX;

    if (delta > 50) next();
    if (delta < -50) prev();

    touchStart.current = null;
  };

  // =========================
  // RENDER
  // =========================
  return (
    <section className="w-full bg-black py-16 overflow-hidden">
      <div className="relative h-[520px]">
        <div
          ref={trackRef}
          onTouchStart={isIOS ? onTouchStart : undefined}
          onTouchEnd={isIOS ? onTouchEnd : undefined}
          className="
            absolute left-1/2 top-1/2
            flex gap-4
            transition-transform duration-500 ease-out
            will-change-transform
          "
          style={{
            transform: `translate(-50%, -50%)`,
          }}
        >
          {looped.map((img, i) => {
            const isActive = i === active;

            return (
              <div
                key={i}
                className="flex items-center justify-center"
                style={{
                  width: snapW,
                }}
                onClick={() => setActive(i)}
              >
                <div
                  className="
                    w-[220px] h-[320px] md:w-[260px] md:h-[380px]
                    overflow-hidden
                    transition-transform duration-500 ease-out
                    transform-gpu
                  "
                  style={{
                    transform: `scale(${isActive ? scaleActive : 1})`,
                  }}
                >
                  <img
                    src={img.src}
                    alt={img.alt ?? ""}
                    draggable={false}
                    className="w-full h-full object-cover select-none"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
