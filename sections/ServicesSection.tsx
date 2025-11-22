"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { services } from "@/app/data/servicesData";

export default function ServicesSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);

  const videoTrackRef = useRef<HTMLDivElement | null>(null);
  const titleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const subtitleRef = useRef<HTMLDivElement | null>(null);

  const [active, setActive] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const isAnimating = useRef(false);
  const wheelAccum = useRef(0);

  const total = services.length;

  // detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // switch video on active change
  useLayoutEffect(() => {
    const sub = subtitleRef.current;
    const title = titleRefs.current[active];
    if (!sub || !title) return;

    const titleRect = title.getBoundingClientRect();
    const stickyRect = stickyRef.current!.getBoundingClientRect();

    // вычисляем вертикальный центр активного пункта
    const centerY = titleRect.top + titleRect.height / 2 - stickyRect.top;

    gsap.to(sub, {
      y: centerY - 40, // небольшой поправочный offset
      duration: 0.45,
      ease: "power3.inOut",
    });

  }, [active]);



  // wheel → change active (desktop only)
  useEffect(() => {
    if (isMobile) return;

    const el = stickyRef.current;
    if (!el) return;

    const handler = (e: WheelEvent) => {
      const sticky = stickyRef.current;
      if (!sticky) return;

      const rect = sticky.getBoundingClientRect();
      const vh = window.innerHeight;

      // считаем, что секция "активно залипла", пока хоть как-то видна
      const pinned = rect.top <= 0 && rect.bottom > 0;
      if (!pinned) {
        wheelAccum.current = 0;
        return; // вне секции — пусть страница крутится как обычно
      }

      if (isAnimating.current) {
        e.preventDefault();
        return;
      }

      const THRESHOLD = 80;
      wheelAccum.current += e.deltaY;

      // вниз
      if (wheelAccum.current > THRESHOLD) {
        if (active < total - 1) {
          e.preventDefault();
          isAnimating.current = true;
          setActive((prev) => prev + 1);
          wheelAccum.current = 0;
          setTimeout(() => {
            isAnimating.current = false;
          }, 450);
        } else {
          // на последнем — даём уйти дальше вниз
          wheelAccum.current = 0;
        }
      }

      // вверх
      if (wheelAccum.current < -THRESHOLD) {
        if (active > 0) {
          e.preventDefault();
          isAnimating.current = true;
          setActive((prev) => prev - 1);
          wheelAccum.current = 0;
          setTimeout(() => {
            isAnimating.current = false;
          }, 450);
        } else {
          // первый пункт — отпускаем скролл вверх
          wheelAccum.current = 0;
        }
      }
    };

    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, [active, isMobile, total]);


  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-black text-white"
    >
      {/* STICKY WRAPPER */}
      <div
        ref={stickyRef}
        className="
          sticky top-0
          h-screen
          overflow-hidden
        "
      >
        {/* BACKGROUND VIDEO STACK */}
        <div ref={videoTrackRef} className="absolute inset-0 flex flex-col">
          {services.map((s) => (
            <video
              key={s.title}
              className="h-screen w-full object-cover"
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

        <div className="absolute inset-0 bg-black/40" />

        {/* TITLES */}
        <div className="absolute bottom-12 left-8 z-10 flex flex-col gap-4">
          {services.map((s, i) => (
            <div
              key={s.title}
              ref={(el) => {
                titleRefs.current[i] = el;
              }}

              onClick={() => setActive(i)}
              className={`
                uppercase text-4xl font-bold cursor-pointer
                ${i === active ? "text-[#D7F000]" : "text-white/30"}
              `}
            >
              {s.title}
            </div>
          ))}
        </div>

        {/* DESKTOP SUBTITLE */}
        {!isMobile && (
          <div
            ref={subtitleRef}
            className="absolute right-16 w-[520px] text-white/80 text-xl leading-snug z-10 whitespace-pre-line"
          >
            {services[active].subtitle}
          </div>

        )}
      </div>

      {/* SPACER — даём странице “уйти” после sticky */}
      <div className="h-[60vh]" />
    </section>
  );
}
