"use client";

import { useEffect, useRef, useState } from "react";

type Slide = {
  src: string;
  alt?: string;
};

export default function GallerySlider({ images }: { images: Slide[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const isProgrammaticScroll = useRef(false);

  const rafId = useRef<number | null>(null);
  const endTimer = useRef<number | null>(null);

  const total = images.length;
  const looped = [...images, ...images, ...images];

  const [active, setActive] = useState(total);
  const [activeVisual, setActiveVisual] = useState(total);

  // =========================
  // RESPONSIVE
  // =========================
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();

    // safari fallback
    // @ts-ignore
    mq.addEventListener ? mq.addEventListener("change", update) : mq.addListener(update);

    return () => {
      // @ts-ignore
      mq.removeEventListener ? mq.removeEventListener("change", update) : mq.removeListener(update);
    };
  }, []);

  // =========================
  // CONFIG
  // =========================
  const gap = isDesktop ? 16 : 28; // ← больше расстояние на мобиле

  const snapW = 300;
  const snapH = 480;

  const baseW = 220;
  const baseH = 320;

  const activeWMobile = 280;
  const activeHMobile = 440;
  const activeWDesktop = 300;
  const activeHDesktop = 480;

  // =========================
  // INIT CENTER
  // =========================
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    el.scrollLeft = (snapW + gap) * total;
    setActive(total);
    setActiveVisual(total);
  }, [total, gap]);

  // =========================
  // HELPERS
  // =========================
  const normalize = (i: number) =>
    ((i % total) + total) % total;

  const findClosestIndex = (el: HTMLDivElement) => {
    const center = el.scrollLeft + el.clientWidth / 2;

    let closest = 0;
    let min = Infinity;

    const kids = el.children;
    for (let i = 0; i < kids.length; i++) {
      const c = kids[i] as HTMLElement;
      const childCenter = c.offsetLeft + c.offsetWidth / 2;
      const dist = Math.abs(center - childCenter);
      if (dist < min) {
        min = dist;
        closest = i;
      }
    }
    return closest;
  };

  const finalize = () => {
    const el = scrollerRef.current;
    if (!el) return;

    const closest = findClosestIndex(el);
    setActive(closest);

    if (closest < total || closest >= total * 2) {
      const target = total + normalize(closest);
      isProgrammaticScroll.current = true;
      el.scrollLeft = (snapW + gap) * target;
      setActive(target);
      setActiveVisual(target);

      requestAnimationFrame(() => {
        isProgrammaticScroll.current = false;
      });
    }
  };

  // =========================
  // SCROLL
  // =========================
  const onScroll = () => {
    const el = scrollerRef.current;
    if (!el || isProgrammaticScroll.current) return;

    if (rafId.current) return;

    rafId.current = requestAnimationFrame(() => {
      rafId.current = null;

      const closest = findClosestIndex(el);
      setActiveVisual(closest);

      if (endTimer.current) clearTimeout(endTimer.current);
      endTimer.current = window.setTimeout(() => {
        finalize();
      }, 220); // ← МЕДЛЕННЕЕ финализация
    });
  };

  // =========================
  // PROGRAMMATIC
  // =========================
  const scrollToIndex = (i: number) => {
    const el = scrollerRef.current;
    if (!el) return;

    isProgrammaticScroll.current = true;
    setActiveVisual(i);

    el.scrollTo({
      left: (snapW + gap) * i,
      behavior: "smooth",
    });

    setTimeout(() => {
      isProgrammaticScroll.current = false;
      finalize();
    }, 320); // ← медленнее кнопки
  };

  // =========================
  // CLEANUP
  // =========================
  useEffect(() => {
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      if (endTimer.current) clearTimeout(endTimer.current);
    };
  }, []);

  // =========================
  // RENDER
  // =========================
  return (
    <section className="w-full bg-black py-16 relative">
      {/* DESKTOP CONTROLS */}
      <div className="hidden md:flex absolute top-6 right-6 z-20 gap-3">
        <button onClick={() => scrollToIndex(active - 1)} className="w-11 h-11 rounded-full border border-white/30 text-white">‹</button>
        <button onClick={() => scrollToIndex(active + 1)} className="w-11 h-11 rounded-full border border-white/30 text-white">›</button>
      </div>

      <div className="relative h-[520px]">
        <div
          ref={scrollerRef}
          onScroll={onScroll}
          className="
            absolute inset-0
            flex overflow-x-auto
            snap-x snap-mandatory
            px-[50vw]
            scrollbar-none
          "
          style={{
            gap,
            WebkitOverflowScrolling: "touch",
            transform: "translateZ(0)",
          }}
        >
          {looped.map((img, i) => {
            const isActive = i === activeVisual;

            const w = isActive
              ? isDesktop ? activeWDesktop : activeWMobile
              : baseW;

            const h = isActive
              ? isDesktop ? activeHDesktop : activeHMobile
              : baseH;

            return (
              <div
                key={i}
                onClick={() => scrollToIndex(i)}
                className="snap-center shrink-0 flex items-center justify-center cursor-pointer"
                style={{ width: snapW, height: snapH }}
              >
                <div
                  className="
                    relative bg-black overflow-hidden
                    transition-all duration-300 ease-out
                    will-change-transform
                  "
                  style={{
                    width: w,
                    height: h,
                    transform: isActive ? "scale(1.04)" : "scale(1)",
                    opacity: isActive ? 1 : 0.45,
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
                      display: "block",
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
