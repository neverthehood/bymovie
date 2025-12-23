"use client";

import { useEffect, useRef, useState } from "react";
import { services } from "@/app/data/servicesData";
import gsap from "gsap";

export default function ServicesSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const subtitleRef = useRef<HTMLDivElement | null>(null);
  const titleRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [active, setActive] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // =========================
  // Detect mobile
  // =========================
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // =========================
  // SCROLL HANDLER
  // =========================
  useEffect(() => {
    const handler = () => {
      const sec = sectionRef.current;
      if (!sec) return;

      const sectionTop = sec.offsetTop;
      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      // нормализованный прогресс
      const rawProgress = (scrollY - sectionTop) / vh;

      let idx = active;

      if (isMobile) {
        // 🔥 MOBILE — более стабильная логика
        const step = 0.9; // нужно почти 1 экран
        idx = Math.round(rawProgress / step);
      } else {
        // DESKTOP — как было
        idx = Math.floor(rawProgress);
      }

      idx = Math.max(0, Math.min(services.length - 1, idx));

      if (idx !== active) {
        setActive(idx);
      }
    };

    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [active, isMobile]);

  // =========================
  // DESKTOP subtitle follow
  // =========================
  useEffect(() => {
    if (isMobile) return;

    const subtitle = subtitleRef.current;
    const title = titleRefs.current[active];
    const sticky = stickyRef.current;

    if (!subtitle || !title || !sticky) return;

    const tRect = title.getBoundingClientRect();
    const sRect = sticky.getBoundingClientRect();

    const centerY = tRect.top + tRect.height / 2 - sRect.top;

    gsap.to(subtitle, {
      y: centerY - 30,
      duration: 0.4,
      ease: "power2.out",
    });
  }, [active, isMobile]);

  // =========================
  // RENDER
  // =========================
  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative w-full bg-black text-white"
      style={{
        height: `${services.length * 40 - 10}vh`,
      }}
    >
      <div ref={stickyRef} className="sticky top-0 h-screen overflow-hidden">

        {/* BACKGROUND IMAGES */}
        <div
          className="absolute inset-0 flex flex-col transition-transform duration-700 ease-in-out"
          style={{ transform: `translateY(-${active * 100}%)` }}
        >
          {services.map((s, i) => (
            <img
              key={i}
              src={s.img}
              alt={s.title}
              className="h-screen w-full object-cover flex-shrink-0"
            />
          ))}
        </div>

        <div className="absolute inset-0 bg-black/45" />

        {/* ================= DESKTOP ================= */}
        {!isMobile && (
          <>
            <div className="absolute bottom-12 left-12 z-20 flex flex-col gap-4">
              {services.map((s, i) => (
                <div
                  key={s.title}
                  ref={(el) => {
                    titleRefs.current[i] = el;
                  }}
                  onClick={() => setActive(i)}
                  className={`
                    uppercase text-4xl font-bold cursor-pointer transition-all
                    ${i === active ? "text-[#DBFE02] scale-105" : "text-white/30"}
                  `}
                >
                  {s.title}
                </div>
              ))}
            </div>

            <div
              ref={subtitleRef}
              className="absolute right-16 text-xl text-white/80 w-[500px] whitespace-pre-line z-20"
            >
              {services[active].subtitle}
            </div>
          </>
        )}

        {/* ================= MOBILE ================= */}
        {isMobile && (
          <div className="absolute inset-0 p-6 z-20 flex flex-col justify-end">
            <div className="flex flex-col gap-6 mb-12">
              {services.map((s, i) => {
                const isActive = i === active;

                return (
                  <div key={s.title}>
                    <div
                      onClick={() => {
                        const top =
                          sectionRef.current!.offsetTop +
                          i * window.innerHeight;
                        window.scrollTo({ top, behavior: "smooth" });
                      }}
                      className={`
                        uppercase font-bold leading-tight transition-all
                        ${isActive
                          ? "text-[#DBFE02] text-[28px]"
                          : "text-white/30 text-[22px]"}
                      `}
                    >
                      {s.title}
                    </div>

                    {isActive && (
                      <div className="text-white/90 text-[17px] mt-2 whitespace-pre-line">
                        {s.subtitle}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
