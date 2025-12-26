"use client";

import { useEffect, useRef, useState } from "react";

type Slide = {
  src: string;
  alt?: string;
};

// =========================
// iOS SAFE SLIDER
// =========================
function IOSSlider({ images }: { images: Slide[] }) {
  return (
    <section className="w-full bg-black py-16">
      <div
        className="
          flex gap-4 overflow-x-auto
          snap-x snap-mandatory
          px-6
          scrollbar-none
        "
      >
        {images.map((img, i) => (
          <div
            key={i}
            className="
              snap-center shrink-0
              w-[260px] h-[420px]
              flex items-center justify-center
            "
          >
            <img
              src={img.src}
              alt={img.alt ?? ""}
              draggable={false}
              className="
                w-full h-full
                object-cover
                select-none
              "
            />
          </div>
        ))}
      </div>
    </section>
  );
}

// =========================
// DESKTOP / ANDROID SLIDER
// =========================
function DesktopSlider({ images }: { images: Slide[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const isProgrammatic = useRef(false);

  const total = images.length;
  const looped = [...images, ...images, ...images];
  const [active, setActive] = useState(total);

  const gap = 16;
  const snapW = 300;
  const snapH = 480;

  const baseW = 220;
  const baseH = 320;

  const activeW = 300;
  const activeH = 480;

  // INIT CENTER
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollLeft = (snapW + gap) * total;
  }, [total]);

  // SCROLL HANDLER
  const onScroll = () => {
    if (isProgrammatic.current) return;
    const el = scrollerRef.current;
    if (!el) return;

    const center = el.scrollLeft + el.clientWidth / 2;

    let closest = 0;
    let min = Infinity;

    Array.from(el.children).forEach((child, i) => {
      const c = child as HTMLElement;
      const cCenter = c.offsetLeft + c.offsetWidth / 2;
      const dist = Math.abs(center - cCenter);
      if (dist < min) {
        min = dist;
        closest = i;
      }
    });

    setActive(closest);

    // FAKE LOOP JUMP
    if (closest < total || closest >= total * 2) {
      isProgrammatic.current = true;
      el.scrollLeft = (snapW + gap) * (total + (closest % total));
      requestAnimationFrame(() => {
        isProgrammatic.current = false;
      });
    }
  };

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
    }, 300);
  };

  const prev = () => scrollToIndex(active - 1);
  const next = () => scrollToIndex(active + 1);

  return (
    <section className="w-full bg-black py-16 relative">
      {/* CONTROLS */}
      <div className="hidden md:flex absolute top-6 right-6 z-20 gap-3">
        <button
          onClick={prev}
          className="w-11 h-11 rounded-full border border-white/30 text-white"
        >
          ‹
        </button>
        <button
          onClick={next}
          className="w-11 h-11 rounded-full border border-white/30 text-white"
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

            return (
              <div
                key={i}
                onClick={() => scrollToIndex(i)}
                className="snap-center shrink-0 flex items-center justify-center"
                style={{
                  width: snapW,
                  height: snapH,
                }}
              >
                <div
                  className="relative transition-all duration-500 ease-out"
                  style={{
                    width: isActive ? activeW : baseW,
                    height: isActive ? activeH : baseH,
                  }}
                >
                  <img
                    src={img.src}
                    alt={img.alt ?? ""}
                    draggable={false}
                    className="
                      absolute inset-0
                      w-full h-full
                      object-cover
                      select-none
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

// =========================
// MAIN EXPORT
// =========================
export default function GallerySlider({ images }: { images: Slide[] }) {
  const isIOS =
    typeof window !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent);

  if (isIOS) {
    return <IOSSlider images={images} />;
  }

  return <DesktopSlider images={images} />;
}
