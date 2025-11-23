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

  // DESKTOP track
  const desktopTrackRef = useRef<HTMLDivElement | null>(null);

  // MOBILE cards
  const mobileCardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // detect mobile
  useEffect(() => {
    setIsMounted(true);

    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ----------------------------
  // DESKTOP — ВОЗВРАЩАЕМ СТАРУЮ ПРАВИЛЬНУЮ АНИМАЦИЮ
  // ----------------------------
  useLayoutEffect(() => {
    if (!isMounted || isMobile) return;

    const section = sectionRef.current;
    const sticky = stickyRef.current;
    const track = desktopTrackRef.current;

    if (!section || !sticky || !track) return;

    const onResize = () => {
      const vh = window.innerHeight;
      const SCROLL_SPAN = vh * 2; // старая корректная длина анимации
      section.style.height = `${vh + SCROLL_SPAN}px`;
    };

    onResize();

    const onScroll = () => {
      if (!section || !sticky || !track) return;

      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const SCROLL_SPAN = vh * 2;

      // секция вне экрана → ничего не делаем
      if (rect.bottom <= 0 || rect.top >= vh) return;

      const offsetInside = Math.min(Math.max(-rect.top, 0), SCROLL_SPAN);
      const t = offsetInside / SCROLL_SPAN;

      const containerWidth = sticky.clientWidth;
      const contentWidth = track.scrollWidth;
      const maxShift = Math.max(contentWidth - containerWidth, 0);

      const shift = -t * maxShift;

      gsap.set(track, { x: shift });
    };

    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onResize);

    onScroll(); // сразу обновить

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);

      section.style.height = "";
      track.style.transform = "";
    };
  }, [isMounted, isMobile]);

  // ----------------------------
  // MOBILE — НАША НОВАЯ АНИМАЦИЯ НЕ МЕНЯЕТСЯ
  // ----------------------------
  useLayoutEffect(() => {
    if (!isMounted || !isMobile) return;

    const section = sectionRef.current;
    if (!section) return;

    const cards = mobileCardsRef.current;
    const n = steps.length;

    // ↓↓↓ все параметры остаются как в твоём последнем рабочем варианте ↓↓↓
    const FIRST_STACK_TOP_VH = 0.42;
    const CARD_HEIGHT_VH = 0.44;
    const SEPARATOR_PX = 20;
    const OVERLAP_RATIO = 0.28;

    const recomputeHeights = () => {
      const vh = window.innerHeight;
      section.style.height = `${vh + vh * (n - 1)}px`;
    };

    const onScroll = () => {
      const sticky = stickyRef.current;
      const sec = sectionRef.current;
      if (!sticky || !sec) return;

      const rect = sec.getBoundingClientRect();
      const vh = window.innerHeight;

      const totalScrollable = sec.offsetHeight - vh;
      if (totalScrollable <= 0) return;

      const offsetInside = Math.min(Math.max(-rect.top, 0), totalScrollable);
      const progress = offsetInside / totalScrollable;
      const stepProgress = progress * (n - 1);

      const cardHeight = Math.round(vh * CARD_HEIGHT_VH);
      const overlapPx = Math.round(cardHeight * OVERLAP_RATIO);
      const firstStackTop = Math.round(vh * FIRST_STACK_TOP_VH);
      const centerY = Math.round(vh / 2);

      for (let i = 0; i < n; i++) {
        const card = cards[i];
        if (!card) continue;

        const stackedTop = firstStackTop + i * (cardHeight + SEPARATOR_PX);
        const stackedCenterOffset =
          stackedTop - centerY + Math.round(cardHeight / 2);

        const finalTop = firstStackTop + i * overlapPx;
        const finalCenterOffset =
          finalTop - centerY + Math.round(cardHeight / 2);

        const raw = stepProgress - (i - 1);

        if (i === 0) {
          card.style.transform = `translate(-50%, -50%) translateY(${finalCenterOffset}px)`;
          card.style.zIndex = "600";
          continue;
        }

        if (raw <= 0) {
          card.style.transform = `translate(-50%, -50%) translateY(${stackedCenterOffset}px)`;
          card.style.zIndex = `${100 + i}`;
          continue;
        }

        const stage = Math.min(raw, 1);
        const offset = Math.round(
          stackedCenterOffset +
            (finalCenterOffset - stackedCenterOffset) * stage
        );

        card.style.transform = `translate(-50%, -50%) translateY(${offset}px)`;
        card.style.zIndex = `${600 + i}`;
      }
    };

    recomputeHeights();
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", () => {
      recomputeHeights();
      onScroll();
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      section.style.height = "";
      cards.forEach((c) => c && (c.style.transform = ""));
    };
  }, [isMounted, isMobile]);

  // ----------------------------
  // RENDER
  // ----------------------------
  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-black text-white overflow-visible"
    >
      <div
        ref={stickyRef}
        className="sticky overflow-hidden top-0 h-screen flex flex-col px-4 pt-44"
      >
        <h2 className="text-center text-4xl md:text-5xl font-bold mb-6">
          HOW WE WORK
        </h2>

        {/* DESKTOP — возвращённый трек */}
        {isMounted && !isMobile && (
          <div className="relative flex-1 flex items-center">
            <div
              ref={desktopTrackRef}
              className="flex gap-[24px] pl-[24px] pr-[24px] will-change-transform"
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

        {/* MOBILE — оставляем как есть */}
        {isMounted && isMobile && (
          <div className="relative flex-1 mt-0">
            {steps.map((step, i) => (
              <div
                key={i}
                ref={(el) => (mobileCardsRef.current[i] = el)}
                className="
                  absolute left-1/2
                  w-[90vw] max-w-[440px]
                  -translate-x-1/2
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
