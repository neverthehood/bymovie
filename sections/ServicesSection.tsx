"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { services } from "@/app/data/servicesData";

gsap.registerPlugin(ScrollTrigger);

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

  /* ---------------------------- 
    DETECT MOBILE
  ----------------------------- */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ----------------------------
    DESKTOP subtitle positioning
  ----------------------------- */
  useLayoutEffect(() => {
    if (isMobile) return;

    const sub = subtitleRef.current;
    const title = titleRefs.current[active];
    if (!sub || !title) return;

    const sticky = stickyRef.current!;
    const tRect = title.getBoundingClientRect();
    const sRect = sticky.getBoundingClientRect();

    const centerY = tRect.top + tRect.height / 2 - sRect.top;

    gsap.to(sub, {
      y: centerY - 40,
      duration: 0.45,
      ease: "power3.inOut",
    });
  }, [active, isMobile]);

  /* ----------------------------
    DESKTOP wheel snapping
  ----------------------------- */
  useEffect(() => {
    if (isMobile) return;

    const el = stickyRef.current;
    if (!el) return;

    const handler = (e: WheelEvent) => {
      const sticky = stickyRef.current;
      if (!sticky) return;

      const rect = sticky.getBoundingClientRect();
      const pinned = rect.top <= 0 && rect.bottom > 0;

      if (!pinned) {
        wheelAccum.current = 0;
        return;
      }

      if (isAnimating.current) {
        e.preventDefault();
        return;
      }

      const THRESHOLD = 70;
      wheelAccum.current += e.deltaY;

      // DOWN
      if (wheelAccum.current > THRESHOLD) {
        if (active < total - 1) {
          e.preventDefault();
          isAnimating.current = true;
          setActive((p) => p + 1);
          wheelAccum.current = 0;
          setTimeout(() => (isAnimating.current = false), 450);
        } else {
          wheelAccum.current = 0;
        }
      }

      // UP
      if (wheelAccum.current < -THRESHOLD) {
        if (active > 0) {
          e.preventDefault();
          isAnimating.current = true;
          setActive((p) => p - 1);
          wheelAccum.current = 0;
          setTimeout(() => (isAnimating.current = false), 450);
        } else {
          wheelAccum.current = 0;
        }
      }
    };

    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, [active, isMobile, total]);

  /* ----------------------------
    MOBILE: slide videos
  ----------------------------- */
  useLayoutEffect(() => {
    if (!isMobile) return;
    if (!videoTrackRef.current) return;
    videoTrackRef.current.style.transform = `translateY(-${active * 100}vh)`;
  }, [active, isMobile]);

  /* ----------------------------
    MOBILE: swipe handling
  ----------------------------- */
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
      if (isAnimating.current) return;
      if (Math.abs(deltaY) < 40) return;

      // swipe up → next
      if (deltaY < 0 && active < total - 1) {
        isAnimating.current = true;
        setActive((p) => p + 1);
        setTimeout(() => (isAnimating.current = false), 350);
      }

      // swipe down → prev
      if (deltaY > 0 && active > 0) {
        isAnimating.current = true;
        setActive((p) => p - 1);
        setTimeout(() => (isAnimating.current = false), 350);
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

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen bg-black text-white overflow-hidden"
    >
      {/* SINGLE sticky wrapper (desktop + mobile!) */}
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen overflow-hidden z-10"
      >
        {/* VIDEO STACK */}
        <div
          ref={videoTrackRef}
          className={`absolute inset-0 flex flex-col transition-transform duration-500`}
        >
          {services.map((s, i) => (
            <video
              key={i}
              className="h-screen w-full object-cover flex-shrink-0"
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

        <div className="absolute inset-0 bg-black/45 pointer-events-none z-10" />

        {/* ------------------ MOBILE UI ------------------ */}
        {isMobile && (
          <div className="absolute inset-0 z-20 flex flex-col justify-end px-6 pb-20">
            {services.map((s, i) => (
              <div key={i} className="mb-3">
                <div
                  onClick={() => setActive(i)}
                  className={`uppercase font-bold transition-all duration-300 ${
                    i === active
                      ? "text-[#D7F000] text-[34px]"
                      : "text-white/25 text-[22px]"
                  }`}
                >
                  {s.title}
                </div>

                {/* subtitle — only under active item */}
                {i === active && (
                  <div className="text-white text-[18px] leading-snug mt-2 mb-4 whitespace-pre-line">
                    {s.subtitle}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ------------------ DESKTOP UI ------------------ */}
        {!isMobile && (
          <>
            <div className="absolute bottom-12 left-12 z-20 flex flex-col gap-4">
              {services.map((s, i) => (
                <div
                  key={i}
                  ref={(el) => (titleRefs.current[i] = el)}
                  onClick={() => setActive(i)}
                  className={`uppercase text-4xl font-bold cursor-pointer transition-all ${
                    i === active ? "text-[#D7F000]" : "text-white/25"
                  }`}
                >
                  {s.title}
                </div>
              ))}
            </div>

            <div
              ref={subtitleRef}
              className="absolute right-12 top-1/2 -translate-y-1/2 w-[500px] text-xl text-white/80 z-20 whitespace-pre-line"
            >
              {services[active].subtitle}
            </div>
          </>
        )}
      </div>

    </section>
  );
}
