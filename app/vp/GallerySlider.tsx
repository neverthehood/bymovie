"use client";

import { useEffect, useRef, useState } from "react";

type Slide = {
  src: string;
  alt?: string;
};

export default function GallerySlider({ images }: { images: Slide[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const isProgrammatic = useRef(false);

  const total = images.length;
  const looped = [...images, ...images, ...images];

  // логический индекс (ВАЖНО)
  const [activeLogical, setActiveLogical] = useState(0);
  const [activeVisual, setActiveVisual] = useState(total);

  // =========================
  // CONFIG
  // =========================
  const gap = 20;

  const snapW = 300;
  const snapH = 480;

  const baseW = 220;
  const baseH = 320;

  const activeWMobile = 280;
  const activeHMobile = 440;
  const activeWDesktop = 300;
  const activeHDesktop = 480;

  const isDesktop =
    typeof window !== "undefined" && window.innerWidth >= 768;

  const logicalIndex = (i: number) =>
    ((i % total) + total) % total;

  // =========================
  // INIT CENTER
  // =========================
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollLeft = (snapW + gap) * total;
  }, [total]);

  // =========================
  // SCROLL HANDLER (THROTTLED)
  // =========================
  const handleScroll = () => {
    if (rafRef.current) return;

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;

      const el = scrollerRef.current;
      if (!el || isProgrammatic.current) return;

      const center = el.scrollLeft + el.clientWidth / 2;

      let closest = 0;
      let min = Infinity;

      Array.from(el.children).forEach((child, i) => {
        const c = child as HTMLElement;
        const childCenter =
          c.offsetLeft + c.offsetWidth / 2;
        const dist = Math.abs(center - childCenter);

        if (dist < min) {
          min = dist;
          closest = i;
        }
      });

      setActiveVisual(closest);
      setActiveLogical(logicalIndex(closest));

      // LOOP JUMP — спокойно и безопасно
      if (closest < total || closest >= total * 2) {
        isProgrammatic.current = true;

        el.scrollLeft =
          (snapW + gap) * (total + logicalIndex(closest));

        requestAnimationFrame(() => {
          isProgrammatic.current = false;
        });
      }
    });
  };

  // =========================
  // SCROLL TO INDEX (BUTTON / TAP)
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
    }, isDesktop ? 400 : 500);
  };

  const prev = () => scrollToIndex(activeVisual - 1);
  const next = () => scrollToIndex(activeVisual + 1);

  // =========================
  // RENDER
  // =========================
  return (
    <section className="w-full bg-black py-16 relative">
      {/* DESKTOP CONTROLS */}
      <div className="hidden md:flex absolute top-6 right-6 z-20 gap-3">
        <button
          onClick={prev}
          className="w-11 h-11 rounded-full border border-white/30 text-white transition hover:bg-white/10"
        >
          ‹
        </button>
        <button
          onClick={next}
          className="w-11 h-11 rounded-full border border-white/30 text-white transition hover:bg-white/10"
        >
          ›
        </button>
      </div>

      {/* VIEWPORT */}
      <div className="relative h-[520px]">
        <div
          ref={scrollerRef}
          onScroll={handleScroll}
          className="
            absolute inset-0
            flex overflow-x-auto
            px-[50vw]
            scrollbar-none
          "
          style={{
            gap: `${gap}px`,
            WebkitOverflowScrolling: "touch",
          }}
        >
          {looped.map((img, i) => {
            const isActive =
              logicalIndex(i) === activeLogical;

            const w = isActive
              ? isDesktop
                ? activeWDesktop
                : activeWMobile
              : baseW;

            const h = isActive
              ? isDesktop
                ? activeHDesktop
                : activeHMobile
              : baseH;

            return (
              <div
                key={i}
                onClick={() => scrollToIndex(i)}
                className="shrink-0 flex items-center justify-center cursor-pointer"
                style={{ width: snapW, height: snapH }}
              >
                <div
                  className="
                    relative bg-black overflow-hidden
                    transition-all duration-[420ms] ease-out
                    will-change-transform
                  "
                  style={{
                    width: w,
                    height: h,
                    transform: isActive
                      ? "scale(1.035)"
                      : "scale(1)",
                    opacity: isActive ? 1 : 0.5,
                  }}
                >
                  <img
                    src={img.src}
                    alt={img.alt ?? ""}
                    draggable={false}
                    className="absolute inset-0 object-cover pointer-events-none select-none"
                    style={{
                      width: "101%",
                      height: "101%",
                      left: "-0.5%",
                      top: "-0.5%",
                      transform: "translateZ(0)",
                      backfaceVisibility: "hidden",
                    }}
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
