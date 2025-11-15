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

  const isAnimating = useRef(false);

  // ———————————————————————————————
  // Настройка скорости прокрутки
  // ———————————————————————————————
  const firstPauseMultiplier = 0.4; // ← ПЕРВЫЙ СЛАЙД ДЕРЖИТСЯ ДОЛЬШЕ

  const total = services.length;

  // ———————————————————————————————
  // Выравниваем подзаголовок по активному пункту
  // ———————————————————————————————
  const positionSubtitle = (index: number) => {
    if (!subtitleRef.current || !titleRefs.current[index] || !sectionRef.current)
      return;

    const titleRect = titleRefs.current[index]!.getBoundingClientRect();
    const sectionRect = sectionRef.current!.getBoundingClientRect();

    gsap.to(subtitleRef.current, {
      top: titleRect.top - sectionRect.top,
      duration: 0.20,
      ease: "power2.out",
    });
  };

  // ———————————————————————————————
  // Анимация листания видео
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
  }, [active]);

  // ———————————————————————————————
  // ЛОГИКА WHEEL: шагами + блокировка скролла страницы
  // ———————————————————————————————
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const handleWheel = (event: WheelEvent) => {
      const delta = event.deltaY;

      // блокируем основной скролл
      event.preventDefault();

      if (isAnimating.current) return;

      // скорость листания — первый пункт медленнее
      const threshold =
        active === 0 ? 10 * firstPauseMultiplier : 10;

      if (Math.abs(delta) < threshold) return;

      // вниз
      if (delta > 0) {
        if (active < total - 1) {
          isAnimating.current = true;
          setActive((p) => p + 1);
        }
      }

      // вверх
      if (delta < 0) {
        if (active > 0) {
          isAnimating.current = true;
          setActive((p) => p - 1);
        }
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [active]);

  // ———————————————————————————————
  // Клик по пункту
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
      {/* —————— ВИДЕО СТЕК —————— */}
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

      {/* затемнение для читабельности */}
      <div className="absolute inset-0 bg-black/45 pointer-events-none" />

      {/* —————— СПИСОК УСЛУГ —————— */}
      <div className="absolute bottom-12 left-12 z-20 flex flex-col gap-2">
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
</div>

        ))}
      </div>

      {/* —————— ПОДЗАГОЛОВОК —————— */}
      <div
        ref={subtitleRef}
        className="absolute right-12 w-[360px] max-w-[40vw] text-left text-base md:text-lg leading-snug text-white/85 z-20"
      >
        {services[active].subtitle}
      </div>
    </section>
  );
}
