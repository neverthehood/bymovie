"use client";

import { useEffect, useRef, useState } from "react";

type Slide = {
  src: string;
  alt?: string;
};

export default function GallerySlider({ images }: { images: Slide[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const isProgrammatic = useRef(false);

  const total = images.length;
  const looped = [...images, ...images, ...images];
  const baseStart = total;

  const [active, setActive] = useState(baseStart);

  // =========================
  // CONFIG
  // =========================
  const gap = 16;
  const snapW = 300;
  const snapH = 480;

  const scaleActiveDesktop = 1.08;
  const scaleActiveMobile = 1.06;

  const isDesktop =
    typeof window !== "undefined" && window.innerWidth >= 768;

  // =========================
  // INIT CENTER
  // =========================
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollLeft = (snapW + gap) * baseStart;
  }, [baseStart]);

  // =========================
  // SCROLL HANDLER
  // =========================
  const onScroll = () => {
    const el = scrollerRef.current;
    if (!el || isProgrammatic.current) return;

    const center = el.scrollLeft + el.clientWidth / 2;

    let closest = active;
    let min = Infinity;

    Array.from(el.children).forEach((child, i) => {
      const c = child as HTMLElement;
      const childCenter = c.offsetLeft + c.offsetWidth / 2;
      const dist = Math.abs(center - childCenter);

      if (dist < min) {
        min = dist;
        closest = i;
      }
    });

    setActive(closest);

    // SAFE LOOP
    if (closest < baseStart || closest >= baseStart + total) {
      isProgrammatic.current = true;

      const normalized =
        baseStart + ((closest - baseStart + total) % total);

      el.scrollLeft = (snapW + gap) * normalized;
      setActive(normalized);

      requestAnimationFrame(() => {
        isProgrammatic.current = false;
      });
    }
  };

  // =========================
  // CONTROLS
  // =========================
  const scrollToIndex = (i: number) => {
    const el = scrollerRef.current;
    if (!el) return;

    isProgrammatic.current = true;

    el.scrollTo({
      left: (snapW + gap) * i,
      behavior: "smooth",
    });

    setTimeout(() => {
      isProgrammatic.current = false;
    }, 350);
  };

  const prev = () => scrollToIndex(active - 1);
  const next = () => scrollToIndex(active + 1);

  // =========================
  // RENDER
  // =========================
  return (
    <section className="w-full bg-black py-16 relative">
      {/* CONTROLS */}
      <div className="hidden md:flex absolute top-6 right-6 z-20 gap-3">
        <button onClick={prev} className="w-11 h-11 rounded-full border border-white/30 text-white">‹</button>
        <button onClick={next} className="w-11 h-11 rounded-full border border-white/30 text-white">›</button>
      </div>

      {/* VIEWPORT */}
      <div className="relative h-[520px]">
        <div
          ref={scrollerRef}
          onScroll={onScroll}
          className="
            absolute inset-0
            flex gap-4 overflow-x-auto
            snap-x snap-mandatory
            px-[50vw]
            scrollbar-none
          "
        >
          {looped.map((img, i) => {
            const isActive = i === active;
            const scale = isActive
              ? isDesktop
                ? scaleActiveDesktop
                : scaleActiveMobile
              : 1;

            return (
              <div
                key={i}
                onClick={() => scrollToIndex(i)}
                className="
                  snap-center shrink-0
                  flex items-center justify-center
                  cursor-pointer
                "
                style={{
                  width: snapW,
                  height: snapH,
                }}
              >
                <div
                  className="
                    w-[220px] h-[320px] md:w-[260px] md:h-[380px]
                    flex items-center justify-center
                    overflow-hidden
                    transform-gpu
                    transition-transform duration-500 ease-out
                  "
                  style={{
                    transform: `scale(${scale})`,
                  }}
                >
                  <img
                    src={img.src}
                    alt={img.alt ?? ""}
                    draggable={false}
                    className="
                      w-full h-full object-cover
                      select-none pointer-events-none
                    "
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
