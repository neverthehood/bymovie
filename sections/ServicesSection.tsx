"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { services } from "@/app/data/servicesData";

gsap.registerPlugin(ScrollTrigger);

export default function ServicesSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const videoTrackRef = useRef<HTMLDivElement | null>(null);
  const subtitleRef = useRef<HTMLDivElement | null>(null);
  const titleRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [active, setActive] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const isAnimating = useRef(false);
  const [canExit, setCanExit] = useState(false);

  const total = services.length;

  // ----------------------------------------------------------------
  // PIN SECTION (одинаков для desktop и mobile)
  // ----------------------------------------------------------------
  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "bottom top",
      pin: true,
      pinSpacing: false,
      scrub: false,
    });

    return () => st.kill();
  }, []);

  // ----------------------------------------------------------------
  // Mobile detect
  // ----------------------------------------------------------------
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();

    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (active < total - 1) setCanExit(false);
  }, [active]);

  // ----------------------------------------------------------------
  // Subtitle positioning
  // ----------------------------------------------------------------
  const positionSubtitle = (index: number) => {
    if (isMobile) return;
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

  // ----------------------------------------------------------------
  // VIDEO TRANSITION
  // ----------------------------------------------------------------
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
  }, [active]);

  // ----------------------------------------------------------------
  // SCROLL / SWIPE BEHAVIOUR
  // ----------------------------------------------------------------
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    // ---------------- DESKTOP WHEEL ------------------
    const onWheel = (event: WheelEvent) => {
      if (isMobile) return;
      const delta = event.deltaY;

      if (isAnimating.current) {
        event.preventDefault();
        return;
      }

      // Вниз
      if (delta > 0) {
        if (active < total - 1) {
          event.preventDefault();
          isAnimating.current = true;
          setActive((p) => p + 1);
          return;
        }

        if (!canExit) {
          event.preventDefault();
          setCanExit(true);
          return;
        }

        return;
      }

      // Вверх
      if (delta < 0) {
        if (active > 0) {
          event.preventDefault();
          isAnimating.current = true;
          setActive((p) => p - 1);
          return;
        }
        return;
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });

    // ---------------- MOBILE TOUCH ------------------
    if (isMobile) {
      let startY = 0;
      let endY = 0;

      const onTouchStart = (e: TouchEvent) => {
        startY = e.touches[0].clientY;
      };

      const onTouchMove = (e: TouchEvent) => {
        endY = e.touches[0].clientY;
        e.preventDefault();
      };

      const onTouchEnd = () => {
        const diff = startY - endY;

        // свайп вверх (листаем вниз)
        if (diff > 40) {
          if (active < total - 1) {
            setActive((p) => p + 1);
            return;
          }

          // последний пункт → первый свайп включает выход
          if (!canExit) {
            setCanExit(true);
            return;
          }

          // если canExit === true → секция отпустит
          return;
        }

        // свайп вниз (листаем вверх)
        if (diff < -40) {
          if (active > 0) {
            setActive((p) => p - 1);
            return;
          }

          return;
        }
      };

      el.addEventListener("touchstart", onTouchStart, { passive: false });
      el.addEventListener("touchmove", onTouchMove, { passive: false });
      el.addEventListener("touchend", onTouchEnd, { passive: false });

      return () => {
        el.removeEventListener("wheel", onWheel);
        el.removeEventListener("touchstart", onTouchStart);
        el.removeEventListener("touchmove", onTouchMove);
        el.removeEventListener("touchend", onTouchEnd);
      };
    }

    // DESKTOP cleanup
    return () => {
      el.removeEventListener("wheel", onWheel);
    };
  }, [isMobile, active, canExit]);

  // ----------------------------------------------------------------
  // CLICK HANDLER
  // ----------------------------------------------------------------
  const clickItem = (i: number) => {
    if (i === active || isAnimating.current) return;
    isAnimating.current = true;
    setActive(i);
  };

  // ----------------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------------
  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen overflow-hidden bg-black"
      data-scroll
    >
      {/* VIDEO TRACK */}
      <div ref={videoTrackRef} className="absolute inset-0 flex flex-col h-full w-full">
        {services.map((service) => (
          <div key={service.title} className="h-full w-full flex-shrink-0">
            <video
              className="h-full w-full object-cover"
              muted
              loop
              autoPlay
              playsInline
            >
              <source src={service.webm} type="video/webm" />
              <source src={service.mp4} type="video/mp4" />
            </video>
          </div>
        ))}
      </div>

      <div className="absolute inset-0 bg-black/45 pointer-events-none" />

      {/* TITLES */}
      <div className="absolute bottom-12 left-4 right-4 md:left-12 z-20 flex flex-col gap-2">
        {services.map((s, i) => (
          <div
            key={s.title}
            ref={(el) => (titleRefs.current[i] = el)}
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
