"use client";

import { useEffect, useRef, useState } from "react";

type Slide = {
  src: string;
  alt?: string;
};

export default function GallerySlider({ images }: { images: Slide[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const isProgrammaticScroll = useRef(false);

  const total = images.length;
  const looped = [...images, ...images, ...images];

  const [active, setActive] = useState(total);

  // =========================
  // CONFIG
  // =========================
  const gap = 16; // расстояние между фото (уменьшили)

  // snap-ячейка (ВСЕГДА фикс)
  const snapW = 300;
  const snapH = 480;

  // обычный размер
  const baseW = 220;
  const baseH = 320;

  // активный
  const activeWMobile = 280;
  const activeHMobile = 440;
  const activeWDesktop = 300;
  const activeHDesktop = 480;

  const isDesktop =
    typeof window !== "undefined" && window.innerWidth >= 768;

  // =========================
  // INIT CENTER
  // =========================
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    el.scrollLeft = (snapW + gap) * total;
  }, [total]);

  // =========================
  // ACTIVE + LOOP
  // =========================
  const onScroll = () => {
    const el = scrollerRef.current;
    if (!el || isProgrammaticScroll.current) return;

    const center = el.scrollLeft + el.clientWidth / 2;

    let closest = 0;
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

    // fake-loop jump (без анимации)
    if (closest < total || closest >= total * 2) {
      el.scrollLeft = (snapW + gap) * (total + (closest % total));
    }
  };

  // =========================
  // SCROLL TO INDEX (CLICK / BUTTONS)
  // =========================
  const scrollToIndex = (i: number) => {
    const el = scrollerRef.current;
    if (!el) return;

    isProgrammaticScroll.current = true;

    el.scrollTo({
      left: (snapW + gap) * i,
      behavior: "smooth",
    });

    setTimeout(() => {
      isProgrammaticScroll.current = false;
      onScroll();
    }, 200);
  };

  // =========================
  // BUTTONS
  // =========================
  const prev = () => scrollToIndex(active - 1);
  const next = () => scrollToIndex(active + 1);

  // =========================
  // RENDER
  // =========================
  return (
    <section className="w-full bg-black py-16 relative">
      {/* DESKTOP CONTROLS */}
      <div className="hidden md:flex absolute top-6 right-6 z-20 gap-3">
        <button
          onClick={prev}
          aria-label="Previous"
          className="
            w-11 h-11 rounded-full
            flex items-center justify-center
            border border-white/30 text-white
            hover:border-white hover:bg-white/10
            transition
          "
        >
          ‹
        </button>
        <button
          onClick={next}
          aria-label="Next"
          className="
            w-11 h-11 rounded-full
            flex items-center justify-center
            border border-white/30 text-white
            hover:border-white hover:bg-white/10
            transition
          "
        >
          ›
        </button>
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

            const innerW = isActive
              ? isDesktop
                ? activeWDesktop
                : activeWMobile
              : baseW;

            const innerH = isActive
              ? isDesktop
                ? activeHDesktop
                : activeHMobile
              : baseH;

            return (
              // SNAP ITEM — ФИКСИРОВАННЫЙ
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
                {/* INNER BOX — РЕАЛЬНО МЕНЯЕТСЯ */}
                <div
                  className="
                    flex items-center justify-center overflow-hidden
                    transition-[width,height] duration-300 ease-out
                  "
                  style={{
                    width: innerW,
                    height: innerH,
                  }}
                >
                  <img
                    src={img.src}
                    alt={img.alt ?? ""}
                    draggable={false}
                    className="
                      block
                      w-full
                      min-h-[101%]
                      object-cover
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
