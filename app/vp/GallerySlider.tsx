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
  const pendingIndex = useRef<number | null>(null);

  const gestureStartIndex = useRef<number | null>(null); // 🔒

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

    // Safari fallback
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
  const gap = isDesktop ? 16 : 4;

  const snapW = 300;
  const snapH = 480;

  const baseW = 220;
  const baseH = 320;

  const activeWMobile = 280;
  const activeHMobile = 440;
  const activeWDesktop = 300;
  const activeHDesktop = 480;

  const FINALIZE_DELAY_MOBILE = 280;
  const FINALIZE_DELAY_DESKTOP = 180;

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

  const clampMobileStep = (from: number, to: number) => {
    if (isDesktop) return to;
    if (to > from) return from + 1;
    if (to < from) return from - 1;
    return from;
  };

  const finalize = () => {
    const el = scrollerRef.current;
    if (!el || pendingIndex.current === null) return;

    let closest = pendingIndex.current;

    if (!isDesktop && gestureStartIndex.current !== null) {
      closest = clampMobileStep(
        gestureStartIndex.current,
        closest
      );
    }

    pendingIndex.current = null;
    gestureStartIndex.current = null;

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

      if (gestureStartIndex.current === null) {
        gestureStartIndex.current = active;
      }

      setActiveVisual(closest);
      pendingIndex.current = closest;

      if (endTimer.current) clearTimeout(endTimer.current);
      endTimer.current = window.setTimeout(
        finalize,
        isDesktop ? FINALIZE_DELAY_DESKTOP : FINALIZE_DELAY_MOBILE
      );
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
    pendingIndex.current = i;

    el.scrollTo({
      left: (snapW + gap) * i,
      behavior: "smooth",
    });

    setTimeout(() => {
      isProgrammaticScroll.current = false;
      finalize();
    }, isDesktop ? 420 : 560);
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
        <button
          onClick={() => scrollToIndex(active - 1)}
          className="w-11 h-11 rounded-full border border-white/30 text-white hover:bg-white/10 transition"
        >
          ‹
        </button>
        <button
          onClick={() => scrollToIndex(active + 1)}
          className="w-11 h-11 rounded-full border border-white/30 text-white hover:bg-white/10 transition"
        >
          ›
        </button>
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
                    transition-[width,height,transform,opacity]
                    duration-300 ease-out
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
