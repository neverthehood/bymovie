"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";

const steps = [
  { title: "IDEA", desc: "Discuss the task,\nfind a style, collect references." },
  { title: "PRE-PRODUCTION", desc: "Creating a 3D-scene in Unreal Engine..." },
  { title: "SHOOTING", desc: "Choosing the type of technology..." },
  { title: "POST-PRODUCTION", desc: "Editing, VFX, compositing..." },
  { title: "DONE", desc: "Releasing your masterpiece" },
];

export default function HowWeWork() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // DESKTOP: горизонтальный скролл по вертикальному
  useLayoutEffect(() => {
    if (isMobile) return;

    const section = sectionRef.current;
    const sticky = stickyRef.current;
    const track = trackRef.current;
    if (!section || !sticky || !track) return;

    const onResize = () => {
      const vh = window.innerHeight;
      const SCROLL_SPAN = vh * 2; // 2 экрана вертикального скролла под анимацию
      section.style.height = `${vh + SCROLL_SPAN}px`;
    };

    onResize();

    const onScroll = () => {
      if (!section || !sticky || !track) return;

      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const SCROLL_SPAN = vh * 2;

      // секция не в экране — ничего не делаем
      if (rect.bottom <= 0 || rect.top >= vh) return;

      // 0 (начало анимации) — когда верх секции дошёл до верха вьюпорта
      const offsetInside = Math.min(Math.max(-rect.top, 0), SCROLL_SPAN);
      const t = offsetInside / SCROLL_SPAN; // 0..1

      const containerWidth = sticky.clientWidth;
      const contentWidth = track.scrollWidth;
      const maxShift = Math.max(contentWidth - containerWidth, 0);

      const shift = -t * maxShift;
      gsap.set(track, { x: shift });
    };

    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onResize);

    // сразу прогнать один раз
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (section) section.style.height = "";
    };
  }, [isMobile]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-black text-white overflow-visible"
    >
      {/* sticky-контейнер на 100vh */}
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen flex flex-col justify-center px-6"
      >
        <h2 className="text-center text-5xl font-bold mb-12 pb-16">
          HOW WE WORK
        </h2>

        {/* DESKTOP: горизонтальные карточки */}
        {!isMobile && (
          <div className="relative w-full overflow-hidden">
            <div
              ref={trackRef}
              className="flex gap-[24px] pl-[24px] pr-[24px]"
            >
              {steps.map((step, i) => (
                <div
                  key={i}
                  className="w-[40vw] min-w-[40vw] h-[340px] bg-[#F1FF9C] flex-shrink-0 px-12 py-12 rounded-[4px] shadow-[0_0_0_1px_#00000015]"
                >
                  <div className="text-[#101010] h-full flex flex-col justify-between">
                    <div>
                      <div className="text-[18px] mb-1 opacity-50">
                        [{i + 1}]
                      </div>

                      <h3 className="text-[46px] font-bold tracking-tight mb-6">
                        {step.title}
                      </h3>
                    </div>

                    <p className="text-[22px] whitespace-pre-line leading-tight text-[#101010]">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MOBILE: простая вертикальная колонка */}
        {isMobile && (
          <div className="relative w-full overflow-hidden px-2">
            <div className="flex flex-col gap-4">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className="w-full bg-[#F1FF9C] px-6 py-6 rounded-lg"
                >
                  <h3 className="text-[28px] font-bold mb-3 text-[#101010]">
                    {step.title}
                  </h3>
                  <p className="text-[16px] whitespace-pre-line leading-tight text-[#101010]">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
