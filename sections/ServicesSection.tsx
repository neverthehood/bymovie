"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { services } from "@/app/data/servicesData";

export default function ServicesSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const videoTrackRef = useRef<HTMLDivElement | null>(null);
  const titleRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [active, setActive] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const total = services.length;
  const animating = useRef(false);

  // MOBILE DETECT
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // -----------------------------
  // MOBILE: background video slide
  // -----------------------------
  useLayoutEffect(() => {
    if (!isMobile) return;
    if (!videoTrackRef.current) return;

    videoTrackRef.current.style.transform = `translateY(-${active * 100}vh)`;
  }, [active, isMobile]);

  // -----------------------------
  // MOBILE: swipe handling
  // -----------------------------
  useEffect(() => {
    if (!isMobile) return;

    let startY = 0;
    let deltaY = 0;

    const onStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };

    const onMove = (e: TouchEvent) => {
      deltaY = e.touches[0].clientY - startY;
    };

    const onEnd = () => {
      if (animating.current) return;

      if (Math.abs(deltaY) < 40) return;

      if (deltaY < 0 && active < total - 1) {
        animating.current = true;
        setActive((p) => p + 1);
        setTimeout(() => (animating.current = false), 400);
      }

      if (deltaY > 0 && active > 0) {
        animating.current = true;
        setActive((p) => p - 1);
        setTimeout(() => (animating.current = false), 400);
      }

      deltaY = 0;
    };

    window.addEventListener("touchstart", onStart);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onEnd);

    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
    };
  }, [isMobile, active, total]);

  // -----------------------------
  // DESKTOP — ничего НЕ меняем
  // -----------------------------

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen bg-black text-white overflow-hidden"
    >
      {/* VIDEO STACK */}
      <div
        ref={videoTrackRef}
        className="absolute inset-0 flex flex-col transition-transform duration-500"
      >
        {services.map((s, i) => (
          <video
            key={i}
            className="w-full h-screen object-cover flex-shrink-0"
            muted
            autoPlay
            loop
            playsInline
          >
            <source src={s.webm} type="video/webm" />
            <source src={s.mp4} type="video/mp4" />
          </video>
        ))}
      </div>

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/45 z-10" />

      {/* MOBILE UI */}
      {isMobile && (
        <div className="absolute inset-0 z-20 flex flex-col justify-end px-6 pb-24">
          {/* ACTIVE TITLE + SUBTITLE */}
          <div className="mb-14">
            <div className="text-[#D7F000] text-[38px] font-black leading-tight">
              {services[active].title}
            </div>

            <div className="text-white text-[18px] mt-3 leading-snug whitespace-pre-line">
              {services[active].subtitle}
            </div>
          </div>

          {/* TITLE LIST */}
          <div className="flex flex-col gap-3 opacity-90">
            {services.map((s, i) => (
              <div
                key={i}
                ref={(el) => {
                  titleRefs.current[i] = el;
                }}

                onClick={() => setActive(i)}
                className={`
                  uppercase font-bold text-[22px]
                  transition-all duration-300
                  ${i === active
                    ? "text-[#D7F000] scale-[1.05]"
                    : "text-white/25"}
                `}
              >
                {s.title}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DESKTOP UI — остаётся твоим, НЕ трогаю */}
      {!isMobile && (
        <>
          <div className="absolute bottom-12 left-12 z-20 flex flex-col gap-4">
            {services.map((s, i) => (
              <div
                key={i}
                className={`uppercase text-4xl font-bold cursor-pointer transition-all ${
                  i === active ? "text-[#D7F000]" : "text-white/25"
                }`}
                onClick={() => setActive(i)}
              >
                {s.title}
              </div>
            ))}
          </div>

          <div className="absolute right-12 top-1/2 -translate-y-1/2 w-[500px] text-xl text-white/80 z-20 whitespace-pre-line">
            {services[active].subtitle}
          </div>
        </>
      )}

      {/* Spacer */}
      <div className="h-[60vh]" />
    </section>
  );
}
