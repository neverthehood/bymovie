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

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  //
  // MAIN SCROLL EVENT — the core logic
  //
  useEffect(() => {
    const handler = () => {
      const sec = sectionRef.current;
      if (!sec) return;

      const rect = sec.getBoundingClientRect();
      const sectionTop = sec.offsetTop;

      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      // how far we scrolled *inside* the long section
      const progress = (scrollY - sectionTop) / vh;

      // snap to integer safely
      let idx = Math.round(progress);

      idx = Math.max(0, Math.min(services.length - 1, idx));

      if (idx !== active) {
        setActive(idx);
      }
    };

    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, [active]);

  //
  // DESKTOP — move subtitle vertically to be aligned with active title
  //
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
      y: centerY - 40,
      duration: 0.4,
      ease: "power2.out",
    });
  }, [active, isMobile]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-black text-white"
      style={{
        height: `${services.length * 100}vh`, // VERY IMPORTANT
      }}
    >
      {/* sticky viewport (always 100vh) */}
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen overflow-hidden"
      >
        {/* ---- background videos ---- */}
        <div className="absolute inset-0 flex flex-col transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateY(-${active * 100}%)`,
          }}
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

        <div className="absolute inset-0 bg-black/45" />

        {/* ---- desktop ---- */}
        {!isMobile && (
          <>
            <div className="absolute bottom-12 left-12 z-20 flex flex-col gap-4">
              {services.map((s, i) => (
                <div
                  key={s.title}
                  ref={(el) => (titleRefs.current[i] = el)}
                  onClick={() => {
                    window.scrollTo({
                      top:
                        sectionRef.current!.offsetTop + i * window.innerHeight,
                      behavior: "smooth",
                    });
                  }}
                  className={`
                    uppercase text-4xl font-bold cursor-pointer transition-all
                    ${i === active ? "text-[#D7F000] scale-105" : "text-white/30"}
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

        {/* ---- mobile ---- */}
        {isMobile && (
          <div className="absolute inset-0 p-6 z-20 flex flex-col justify-end">
            <div className="text-[#D7F000] text-[32px] font-black uppercase">
              {services[active].title}
            </div>

            <div className="text-white/90 text-[18px] mt-2 whitespace-pre-line">
              {services[active].subtitle}
            </div>

            <div className="flex flex-col gap-3 mt-6 opacity-90 mb-10">
              {services.map((s, i) => (
                <div
                  key={s.title}
                  onClick={() =>
                    window.scrollTo({
                      top:
                        sectionRef.current!.offsetTop + i * window.innerHeight,
                      behavior: "smooth",
                    })
                  }
                  className={`
                    uppercase text-[22px] font-bold transition-all
                    ${i === active ? "text-[#D7F000]" : "text-white/30"}
                  `}
                >
                  {s.title}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
