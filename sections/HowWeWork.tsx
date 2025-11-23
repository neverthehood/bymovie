"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

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
  const desktopTrackRef = useRef<HTMLDivElement | null>(null);
  const mobileCardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ----------------------------
  // DESKTOP horizontal scroll
  // ----------------------------
  useLayoutEffect(() => {
    if (isMobile) return;

    const section = sectionRef.current;
    const sticky = stickyRef.current;
    const track = desktopTrackRef.current;

    if (!section || !sticky || !track) return;

    const onResize = () => {
      const vh = window.innerHeight;
      const extra = vh * 2;
      section.style.height = `${vh + extra}px`;
    };

    const onScroll = () => {
      if (!section || !sticky || !track) return;

      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const extra = vh * 2;

      if (rect.bottom <= 0 || rect.top >= vh) return;

      const offsetInside = Math.min(Math.max(-rect.top, 0), extra);
      const t = offsetInside / extra;

      const cw = sticky.clientWidth;
      const tw = track.scrollWidth;
      const maxShift = Math.max(tw - cw, 0);

      track.style.transform = `translateX(${-t * maxShift}px)`;
    };

    onResize();
    onScroll();

    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      section.style.height = "";
      track.style.transform = "";
    };
  }, [isMobile]);

  // ----------------------------
  // MOBILE stacking motion
  // ----------------------------
  useLayoutEffect(() => {
    if (!isMobile) return;

    const section = sectionRef.current;
    if (!section) return;

    const cards = mobileCardsRef.current;
    const n = steps.length;

    const recomputeHeights = () => {
      const vh = window.innerHeight;
      section.style.height = `${vh + vh * (n - 1)}px`;
    };

    const onScroll = () => {
      const sticky = stickyRef.current;
      const section = sectionRef.current;
      if (!sticky || !section) return;

      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;

      const totalScrollable = section.offsetHeight - vh;
      if (totalScrollable <= 0) return;

      const offsetInside = Math.min(Math.max(-rect.top, 0), totalScrollable);
      const progress = offsetInside / totalScrollable;
      const stepProgress = progress * (n - 1);

      const startY = vh * 0.9; // нижняя стартовая позиция
      const overlap = 85; // расстояние в финальном стеке

      cards.forEach((card, i) => {
        if (!card) return;

        if (i === 0) {
          card.style.transform = `translate(-50%, -50%) translateY(0px)`;
          card.style.opacity = "0.75";
          card.style.zIndex = "200";
          return;
        }

        const raw = stepProgress - (i - 1);

        if (raw <= 0) {
          card.style.transform = `translate(-50%, -50%) translateY(${startY}px)`;
          card.style.opacity = "0";
          card.style.zIndex = `${50 - i}`;
          return;
        }

        const stage = Math.min(raw, 1);
        const finalY = i * overlap;
        const y = startY + (finalY - startY) * stage;

        card.style.transform = `translate(-50%, -50%) translateY(${y}px)`;

        // opacity: верхние темнее, нижние светлее (как ты выбрал)
        const finalOpacity = 0.75 + (i / (n - 1)) * 0.25;
        const opacity = finalOpacity * stage;
        card.style.opacity = opacity.toString();

        card.style.zIndex = `${200 + i}`;
      });
    };

    recomputeHeights();
    onScroll();

    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", () => {
      recomputeHeights();
      onScroll();
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [isMobile]);

  // ----------------------------
  // RENDER
  // ----------------------------
  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-black text-white overflow-visible"
      data-scroll
    >
      <div ref={stickyRef} className="sticky top-0 h-screen flex flex-col px-4 pt-24">
        <h2 className="text-center text-4xl md:text-5xl font-bold mb-10">
          HOW WE WORK
        </h2>

        {/* DESKTOP */}
        {!isMobile && (
          <div className="relative flex-1 flex items-center">
            <div
              ref={desktopTrackRef}
              className="flex gap-6 pl-6 pr-6 will-change-transform"
            >
              {steps.map((step, i) => (
                <div
                  key={i}
                  className="w-[40vw] min-w-[40vw] h-[340px] bg-[#F1FF9C] px-12 py-12 shadow-[0_0_0_1px_rgba(0,0,0,0.15)]"
                >
                  <div className="text-[#101010] h-full flex flex-col justify-between">
                    <div>
                      <div className="text-[18px] mb-1 opacity-50">[{i + 1}]</div>
                      <h3 className="text-[40px] font-bold tracking-tight mb-6">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-[20px] whitespace-pre-line leading-tight text-[#101010]">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MOBILE */}
        {isMobile && (
          <div className="relative flex-1 mt-2">
            {steps.map((step, i) => (
              <div
                key={i}
                ref={(el) => (mobileCardsRef.current[i] = el)}
                className="
                  absolute left-1/2 top-1/2
                  w-[90vw] max-w-[440px]
                  -translate-x-1/2 -translate-y-1/2
                  bg-[#F1FF9C]
                  px-6 py-8
                  shadow-[0_0_0_1px_rgba(0,0,0,0.2)]
                "
              >
                <div className="text-center text-[18px] text-[#555] font-semibold mb-3">
                  [{i + 1}]
                </div>
                <h3 className="text-center text-[26px] font-bold mb-4 text-[#101010]">
                  {step.title}
                </h3>
                <p className="text-center text-[16px] leading-snug whitespace-pre-line text-[#101010]">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
