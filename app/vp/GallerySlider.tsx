"use client";

import { useEffect, useRef, useState } from "react";

type Slide = {
  src: string;
  alt?: string;
};

export default function GallerySlider({ images }: { images: Slide[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const total = images.length;
  const looped = [...images, ...images, ...images];

  // визуально активный (сразу)
  const [activeVisual, setActiveVisual] = useState(total);
  // финальный (после инерции)
  const [activeFinal, setActiveFinal] = useState(total);

  const gap = 16;
  const snapW = 300;
  const snapH = 480;

  const baseScale = 1;
  const activeScaleMobile = 1.15;
  const activeScaleDesktop = 1.12;

  const isDesktop =
    typeof window !== "undefined" && window.innerWidth >= 768;

  const rafId = useRef<number | null>(null);
  const scrollEndTimer = useRef<number | null>(null);
  const lock = useRef(false);

  // =========================
  // INIT CENTER
  // =========================
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollLeft = (snapW + gap) * total;
  }, [total]);

  // =========================
  // FIND CLOSEST
  // =========================
  const findClosest = () => {
    const el = scrollerRef.current;
    if (!el) return activeVisual;

    const center = el.scrollLeft + el.clientWidth / 2;
    let closest = 0;
    let min = Infinity;

    Array.from(el.children).forEach((child, i) => {
      const c = child as HTMLElement;
      const cCenter = c.offsetLeft + c.offsetWidth / 2;
      const d = Math.abs(center - cCenter);
      if (d < min) {
        min = d;
        closest = i;
      }
    });

    return closest;
  };

  // =========================
  // SCROLL
  // =========================
  const onScroll = () => {
    if (lock.current) return;

    if (rafId.current) cancelAnimationFrame(rafId.current);

    rafId.current = requestAnimationFrame(() => {
      const closest = findClosest();

      // 🔥 МГНОВЕННЫЙ ВИЗУАЛ
      setActiveVisual(closest);

      // debounce end
      if (scrollEndTimer.current) clearTimeout(scrollEndTimer.current);

      scrollEndTimer.current = window.setTimeout(() => {
        lock.current = true;

        setActiveFinal(closest);

        const el = scrollerRef.current;
        if (!el) return;

        // SAFE LOOP JUMP
        if (closest < total || closest >= total * 2) {
          el.scrollLeft =
            (snapW + gap) * (total + (closest % total));
        }

        setTimeout(() => {
          lock.current = false;
        }, 60);
      }, 100);
    });
  };

  // =========================
  // PROGRAMMATIC
  // =========================
  const scrollToIndex = (i: number) => {
    const el = scrollerRef.current;
    if (!el) return;

    lock.current = true;

    el.scrollTo({
      left: (snapW + gap) * i,
      behavior: "smooth",
    });

    setTimeout(() => {
      setActiveVisual(i);
      setActiveFinal(i);
      lock.current = false;
    }, 350);
  };

  const prev = () => scrollToIndex(activeFinal - 1);
  const next = () => scrollToIndex(activeFinal + 1);

  // =========================
  // RENDER
  // =========================
  return (
    <section className="w-full bg-black py-16 relative">
      <div className="hidden md:flex absolute top-6 right-6 z-20 gap-3">
        <button onClick={prev} className="w-11 h-11 border border-white/30 text-white rounded-full">‹</button>
        <button onClick={next} className="w-11 h-11 border border-white/30 text-white rounded-full">›</button>
      </div>

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
            const isActive = i === activeVisual;

            const scale = isActive
              ? isDesktop
                ? activeScaleDesktop
                : activeScaleMobile
              : baseScale;

            return (
              <div
                key={i}
                onClick={() => scrollToIndex(i)}
                className="snap-center shrink-0 flex items-center justify-center"
                style={{ width: snapW, height: snapH }}
              >
                <img
                  src={img.src}
                  alt={img.alt ?? ""}
                  draggable={false}
                  className="
                    block
                    w-full h-full
                    object-cover
                    bg-black
                    select-none
                    pointer-events-none
                    transition-transform duration-200 ease-out
                  "
                  style={{
                    transform: `scale(${scale})`,
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
