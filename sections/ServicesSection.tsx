"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { services } from "@/app/data/servicesData";

export default function ServicesSection({ isFocused = false }) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const videoTrackRef = useRef<HTMLDivElement | null>(null);
  const subtitleRef = useRef<HTMLDivElement | null>(null);
  const titleRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [active, setActive] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const isAnimating = useRef(false);

  const [canExit, setCanExit] = useState(false); // ← флажок "можно ли уже выйти из секции"

  const firstPauseMultiplier = 0.4;
  const total = services.length;

  // ——————————————————————————
  // Mobile detect
  // ——————————————————————————
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // при смене пункта — сбрасываем "разрешение на выход"
  useEffect(() => {
    if (active < total - 1) {
      setCanExit(false);
    }
  }, [active, total]);

  // ——————————————————————————
  // Позиционирование сабтайтла
  // ——————————————————————————
  const positionSubtitle = (index: number) => {
    if (isMobile) return;
    if (!subtitleRef.current || !titleRefs.current[index] || !sectionRef.current) return;

    const titleRect = titleRefs.current[index]!.getBoundingClientRect();
    const sectionRect = sectionRef.current!.getBoundingClientRect();

    gsap.to(subtitleRef.current, {
      top: titleRect.top - sectionRect.top,
      duration: 0.25,
      ease: "power2.out",
    });
  };

  // ——————————————————————————
  // Анимация видео
  // ——————————————————————————
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

  // ——————————————————————————
  // Скролл на десктопе
  // ——————————————————————————
  useEffect(() => {
  if (!sectionRef.current) return;
  const el = sectionRef.current;

  const handleWheel = (event: WheelEvent) => {
    if (isMobile) return;

    const delta = event.deltaY;

    // 1. Если анимация ещё идёт — не выпускаем наружу
    if (isAnimating.current) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    // 2. Внутренний скролл — двигаем пункты
    if (delta > 0) {
      // Листаем вниз
      if (active < total - 1) {
        isAnimating.current = true;
        event.preventDefault();
        event.stopPropagation();
        setActive((p) => p + 1);
        return;
      }

      // На последнем пункте
      if (!canExit) {
        // Первый жест вниз — разрешаем выход
        setCanExit(true);
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      // canExit === true → выпускаем наружу (не трогаем event)
      return;
    } else {
      // Листаем вверх
      if (active > 0) {
        isAnimating.current = true;
        event.preventDefault();
        event.stopPropagation();
        setActive((p) => p - 1);
        return;
      }

      // если active === 0 → выпускаем наружу
      return;
    }
  };

  el.addEventListener("wheel", handleWheel, { passive: false, capture: true });
  return () => el.removeEventListener("wheel", handleWheel, { capture: true } as any);
}, [active, isMobile, total, canExit]);


  // ——————————————————————————
  // Клик по пункту
  // ——————————————————————————
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

      {/* СПИСОК СЕРВИСОВ */}
      <div className="absolute bottom-12 left-4 right-4 md:left-12 md:right-auto z-20 flex flex-col gap-2">
        {services.map((s, i) => (
          <div
            key={s.title}
            ref={(el) => {
              titleRefs.current[i] = el;
            }}
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

      {/* SUBTITLE (DESKTOP) */}
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
