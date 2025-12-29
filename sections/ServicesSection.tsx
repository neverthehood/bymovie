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

  const mobileProgressRef = useRef(0);

  // detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  //
  // MAIN SCROLL HANDLER — НЕ ТРОГАЕМ
  //
  useEffect(() => {
    const handler = () => {
      const sec = sectionRef.current;
      if (!sec) return;

      const sectionTop = sec.offsetTop;
      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      let idx = active;

      if (isMobile) {
        const sectionHeight = sec.offsetHeight;
        const scrollInside = scrollY - sectionTop;

        const normalizedRaw = scrollInside / (sectionHeight - vh);
        const normalized = Math.max(0, Math.min(1, normalizedRaw));

        const targetProgress = normalized * services.length;

        const SMOOTHING = 0.058;
        mobileProgressRef.current +=
          (targetProgress - mobileProgressRef.current) * SMOOTHING;

        idx = Math.floor(mobileProgressRef.current);

        if (idx >= services.length - 1) {
          idx = services.length - 1;
          mobileProgressRef.current = services.length - 1;
        }
      } else {
        const rawProgress =
          ((scrollY - sectionTop) / vh) * services.length;

        idx = Math.floor(rawProgress);
      }

      idx = Math.max(0, Math.min(services.length - 1, idx));

      if (idx !== active) {
        setActive(idx);
      }
    };

    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, [active, isMobile]);

  //
  // DESKTOP subtitle animation — НЕ ТРОГАЕМ
  //
  useEffect(() => {
    if (isMobile) return;

    const subtitle = subtitleRef.current;
    const title = titleRefs.current[active];
    const sticky = stickyRef.current;

    if (!subtitle || !title || !sticky) return;

    const tRect = title.getBoundingClientRect();
    const sRect = sticky.getBoundingClientRect();

    const centerY =
      tRect.top + tRect.height / 2 - sRect.top;

    gsap.to(subtitle, {
      y: centerY - 30,
      duration: 0.4,
      ease: "power2.out",
    });
  }, [active, isMobile]);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative w-full bg-black text-white"
      style={{
        height: isMobile
          ? `${services.length * 62 + 30}vh`
          : `${services.length * 40 - 10}vh`,
      }}
    >
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen overflow-hidden"
      >
        {/* background images */}
        <div
          className="absolute inset-0 flex flex-col transition-transform duration-700 ease-in-out"
          style={{ transform: `translateY(-${active * 100}%)` }}
        >
          {services.map((s, i) => (
            <img
              key={i}
              src={isMobile ? s.imgMobile || s.img : s.img}
              alt={s.title}
              className="h-screen w-full object-cover flex-shrink-0"
            />
          ))}
        </div>

        <div className="absolute inset-0 bg-black/45" />

        {/* ===== DESKTOP — НЕ ТРОГАЕМ ===== */}
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

        {/* ===== MOBILE — НЕ ТРОГАЕМ ===== */}
        {isMobile && (
          <div className="absolute inset-0 p-6 z-20 flex flex-col justify-end">
            <div className="flex flex-col gap-6 opacity-90 mb-14">
              {services.map((s, i) => (
                <div key={s.title}>
                  <div
                    onClick={() => {
                      setActive(i);
                      mobileProgressRef.current = i;
                    }}
                    className={`
                      uppercase text-[26px] leading-[1.15] font-bold
                      transition-colors duration-300
                      ${i === active ? "text-[#DBFE02]" : "text-white/30"}
                    `}
                  >
                    {s.title}
                  </div>

                  {i === active && (
                    <div className="text-white/90 text-[18px] mt-2 whitespace-pre-line">
                      {s.subtitle}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
