"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { services } from "@/app/data/servicesData";

export default function ServicesSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const videoTrackRef = useRef<HTMLDivElement | null>(null);
  const subtitleRef = useRef<HTMLDivElement | null>(null);
  const titleRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [active, setActive] = useState(0);
  const [isMobile, setIsMobile] = useState(false); // ←✓ главный фикс
  const isAnimating = useRef(false);

  const firstPauseMultiplier = 0.4;
  const total = services.length;

  // ———————————————————————————————
  // Detect mobile properly
  // ———————————————————————————————
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();

    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ———————————————————————————————
  // Desktop subtitle positioning
  // ———————————————————————————————
  const positionSubtitle = (index: number) => {
    if (isMobile) return; // ←✓ не двигаем на мобильном
    if (!subtitleRef.current || !titleRefs.current[index] || !sectionRef.current)
      return;

    const titleRect = titleRefs.current[index]!.getBoundingClientRect();
    const sectionRect = sectionRef.current!.getBoundingClientRect();

    gsap.to(subtitleRef.current, {
      top: titleRect.top - sectionRect.top,
      duration: 0.25,
      ease: "power2.out",
    });
  };

  // ———————————————————————————————
  // Video scroll animation
  // ———————————————————————————————
  useLayoutEffect(() => {
    if (!videoTrackRef.current) return;

    gsap.to(videoTrackRef.current, {
      yPercent: -100 * active,
      duration: 0.9,
      ease: "power3.inOut",
      onComplete: () => {
        isAnimating.current = false;
      },
    });

    positionSubtitle(active);
  }, [active, isMobile]);

  // ———————————————————————————————
  // DESKTOP WHEEL SCROLL
  // ———————————————————————————————
  useEffect(() => {
    if (!sectionRef.current) return;
    const el = sectionRef.current;

    const handleWheel = (event: WheelEvent) => {
      if (isMobile) return;

      event.preventDefault();
      if (isAnimating.current) return;

      const delta = event.deltaY;
      const threshold = active === 0 ? 10 * firstPauseMultiplier : 10;
      if (Math.abs(delta) < threshold) return;

      if (delta > 0 && active < total - 1) {
        isAnimating.current = true;
        setActive((p) => p + 1);
      }
      if (delta < 0 && active > 0) {
        isAnimating.current = true;
        setActive((p) => p - 1);
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [active, isMobile]);

  // ———————————————————————————————
  // MOBILE SWIPE
  // ———————————————————————————————
  useEffect(() => {
    if (!sectionRef.current) return;
    const el = sectionRef.current;

    if (!isMobile) return;

    let startY = 0;

    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      const delta = startY - e.changedTouches[0].clientY;

      if (Math.abs(delta) < 40) return;
      if (isAnimating.current) return;

      if (delta > 0 && active < total - 1) {
        isAnimating.current = true;
        setActive((p) => p + 1);
      }
      if (delta < 0 && active > 0) {
        isAnimating.current = true;
        setActive((p) => p - 1);
      }
    };

    el.addEventListener("touchstart", onTouchStart);
    el.addEventListener("touchend", onTouchEnd);

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [active, isMobile]);

  // ———————————————————————————————
  // CLICK
  // ———————————————————————————————
  const clickItem = (i: number) => {
    if (i === active || isAnimating.current) return;
    isAnimating.current = true;
    setActive(i);
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden bg-black"
    >
      {/* VIDEO STACK */}
      <div
        ref={videoTrackRef}
        className="absolute inset-0 flex flex-col h-full w-full"
      >
        {services.map((service) => (
          <div key={service.title} className="h-full w-full flex-shrink-0">
            <video className="h-full w-full object-cover" muted loop autoPlay playsInline>
              <source src={service.webm} type="video/webm" />
              <source src={service.mp4} type="video/mp4" />
            </video>
          </div>
        ))}
      </div>

      <div className="absolute inset-0 bg-black/45 pointer-events-none" />

      {/* LIST */}
      <div className="absolute bottom-12 left-12 z-20 flex flex-col gap-2">
        {services.map((s, i) => (
          <div
            key={s.title}
            ref={(el) => {titleRefs.current[i] = el;}}
            onClick={() => clickItem(i)}
            className={`cursor-pointer text-3xl md:text-4xl font-bold uppercase tracking-tight transition-all duration-300 ${
              i === active ? "text-[#D7F000]" : "text-white/15"
            }`}
          >
            {s.title}

            {isMobile && i === active && (
              <div className="mt-2 text-white/85 text-base leading-snug">
                {s.subtitle}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* DESKTOP SUBTITLE */}
      {!isMobile && (
        <div
          ref={subtitleRef}
          className="absolute right-12 w-[360px] max-w-[40vw] text-left text-base md:text-lg leading-snug text-white/85 z-20"
        >
          {services[active].subtitle}
        </div>
      )}
    </section>
  );
}
