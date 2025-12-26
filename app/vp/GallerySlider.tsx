"use client";

import { useEffect, useRef, useState } from "react";

type Slide = {
  src: string;
  alt?: string;
};

export default function GallerySlider({ images }: { images: Slide[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  // protects from scroll handler reacting to our own jumps
  const isProgrammaticScroll = useRef(false);

  // rAF throttle for scroll
  const rafId = useRef<number | null>(null);

  // “scroll end” timer (for loop jump / finalize)
  const endTimer = useRef<number | null>(null);

  const total = images.length;
  const looped = [...images, ...images, ...images];

  // FINAL active (buttons + loop logic)
  const [active, setActive] = useState(total);

  // VISUAL active (scale/opacity) — updates immediately on scroll
  const [activeVisual, setActiveVisual] = useState(total);

  // =========================
  // CONFIG (keep your gap!)
  // =========================
  const gap = 16;

  // SNAP cell (fixed)
  const snapW = 300;
  const snapH = 480;

  // base
  const baseW = 220;
  const baseH = 320;

  // active sizes
  const activeWMobile = 280;
  const activeHMobile = 440;
  const activeWDesktop = 300;
  const activeHDesktop = 480;

  // desktop detection (stable)
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();

    // Safari < 14 fallback
    // @ts-ignore
    if (mq.addEventListener) mq.addEventListener("change", update);
    // @ts-ignore
    else mq.addListener(update);

    return () => {
      // @ts-ignore
      if (mq.removeEventListener) mq.removeEventListener("change", update);
      // @ts-ignore
      else mq.removeListener(update);
    };
  }, []);

  // =========================
  // INIT CENTER
  // =========================
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    // put us in the middle segment
    el.scrollLeft = (snapW + gap) * total;
    setActive(total);
    setActiveVisual(total);
  }, [total]);

  // =========================
  // HELPERS
  // =========================
  const normalize = (i: number) => {
    const m = ((i % total) + total) % total;
    return m;
  };

  const findClosestIndex = (el: HTMLDivElement) => {
    const center = el.scrollLeft + el.clientWidth / 2;

    let closest = 0;
    let min = Infinity;

    // children are snap items
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

  const finalizeAfterScrollEnd = () => {
    const el = scrollerRef.current;
    if (!el) return;

    const closest = findClosestIndex(el);

    // set FINAL active (buttons etc)
    setActive(closest);

    // loop jump only when we are outside middle segment
    if (closest < total || closest >= total * 2) {
      const norm = normalize(closest);
      const target = total + norm; // always in middle segment

      isProgrammaticScroll.current = true;
      el.scrollLeft = (snapW + gap) * target;
      // keep both actives consistent after jump
      setActive(target);
      setActiveVisual(target);

      // allow scroll events again next frame
      requestAnimationFrame(() => {
        isProgrammaticScroll.current = false;
      });
    }
  };

  // =========================
  // SCROLL (visual immediately, finalize debounced)
  // =========================
  const onScroll = () => {
    const el = scrollerRef.current;
    if (!el || isProgrammaticScroll.current) return;

    // throttle to one per frame (Safari can spam)
    if (rafId.current) return;
    rafId.current = requestAnimationFrame(() => {
      rafId.current = null;

      const closest = findClosestIndex(el);

      // ✅ VISUAL update immediately (no 1s delay)
      setActiveVisual(closest);

      // debounce finalize (loop jump + final active)
      if (endTimer.current) window.clearTimeout(endTimer.current);
      endTimer.current = window.setTimeout(() => {
        finalizeAfterScrollEnd();
      }, 120);
    });
  };

  // =========================
  // SCROLL TO INDEX (buttons/click)
  // =========================
  const scrollToIndex = (i: number) => {
    const el = scrollerRef.current;
    if (!el) return;

    isProgrammaticScroll.current = true;

    // ✅ visual should react right away
    setActiveVisual(i);

    el.scrollTo({
      left: (snapW + gap) * i,
      behavior: "smooth",
    });

    // unlock + finalize after animation starts
    window.setTimeout(() => {
      isProgrammaticScroll.current = false;
      finalizeAfterScrollEnd();
    }, 180);
  };

  // =========================
  // BUTTONS
  // =========================
  const prev = () => scrollToIndex(active - 1);
  const next = () => scrollToIndex(active + 1);

  // cleanup timers
  useEffect(() => {
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      if (endTimer.current) window.clearTimeout(endTimer.current);
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
          style={{
            // iOS scroll stability
            WebkitOverflowScrolling: "touch",
            // reduces random “hairlines” during momentum + transforms
            transform: "translateZ(0)",
          }}
        >
          {looped.map((img, i) => {
            const isActive = i === activeVisual;

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
              // SNAP ITEM (fixed cell)
              <div
                key={i}
                onClick={() => scrollToIndex(i)}
                className="
                  snap-center shrink-0
                  flex items-center justify-center
                  cursor-pointer
                  bg-black
                "
                style={{
                  width: snapW,
                  height: snapH,
                }}
              >
                {/* INNER BOX (resizes faster + smoother) */}
                <div
                  className="
                    relative
                    bg-black
                    overflow-hidden
                    will-change-transform
                    transition-[width,height,transform,opacity]
                    duration-150
                    ease-out
                  "
                  style={{
                    width: innerW,
                    height: innerH,

                    // quick “pop” after swipe
                    transform: isActive ? "scale(1.06)" : "scale(1)",

                    // optional: non-active a bit dim
                    opacity: isActive ? 1 : 0.4,

                    // anti-hairline tricks (Safari)
                    WebkitBackfaceVisibility: "hidden",
                    backfaceVisibility: "hidden",
                    transformOrigin: "center center",
                  }}
                >
                  {/* IMAGE */}
                  <img
                    src={img.src}
                    alt={img.alt ?? ""}
                    draggable={false}
                    className="
                      absolute inset-0
                      w-full h-full
                      object-cover
                      select-none pointer-events-none
                    "
                    style={{
                      // ✅ Method A: remove subpixel seam
                      display: "block",

                      // ✅ Method B: tiny overscan to cover 1px line on Safari/retina
                      // (this is the most reliable “guaranteed” fix)
                      width: "101%",
                      height: "101%",
                      left: "-0.5%",
                      top: "-0.5%",

                      // ✅ Method C: force compositor layer
                      transform: "translateZ(0)",

                      WebkitBackfaceVisibility: "hidden",
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
