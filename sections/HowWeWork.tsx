"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";

const steps = [
  {
    title: "IDEA",
    desc: "Discuss the task,\nfind a style, collect references."
  },
  {
    title: "PRE-PRODUCTION",
    desc: "Creating a 3D-scene in Unreal Engine.\nCity, forest, interior, space — everything is possible."
  },
  {
    title: "SHOOTING",
    desc: "Choosing the type of technology:\nLED-filming or on live chromakey.\nWe can realize everything on the set."
  },
  {
    title: "POST-PRODUCTION",
    desc: "Editing, VFX, compositing, color grading.\nFinal touches or nothing if everything is ready at once."
  },
  {
    title: "DONE",
    desc: "Releasing your masterpiece."
  }
];


export default function HowWeWork() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);

  // DESKTOP track
  const desktopTrackRef = useRef<HTMLDivElement | null>(null);

  // MOBILE cards
  const mobileCardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    setMounted(true);

    const check = () => setIsMobile(window.innerWidth < 768);
    check();

    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

 // ------------------------------------------------------
 // DESKTOP — BOOSTED OVERLAP so all cards appear at final
 // ------------------------------------------------------
 useLayoutEffect(() => {
   if (!mounted || isMobile) return;

   const section = sectionRef.current;
   const sticky = stickyRef.current;
   const track = desktopTrackRef.current;
   if (!section || !sticky || !track) return;

   const cards = Array.from(track.children) as HTMLElement[];
   const n = cards.length;

   const overlapBoost = 1.75; // ← ключевой параметр (1.6–1.9 идеально)

   const onResize = () => {
     const vh = window.innerHeight;
     const scrollSpan = vh * 2;
     section.style.height = `${vh + scrollSpan}px`;
   };

   onResize();

   const onScroll = () => {
     const rect = section.getBoundingClientRect();
     const vh = window.innerHeight;
     const scrollSpan = vh * 2;

     const offset = Math.min(Math.max(-rect.top, 0), scrollSpan);
     const progress = offset / scrollSpan;

     const cardWidth = cards[0].offsetWidth;
     const viewportWidth = sticky.clientWidth;

     // минимальное значение чтобы последняя вошла
     const baseOverlap = (viewportWidth - cardWidth) / (n - 1);

     // увеличиваем overlap, чтобы ВСЕ карточки были видны
     const overlapPx = baseOverlap * overlapBoost;

     // первая карточка — фиксирована
     gsap.set(cards[0], { x: 0 });

     for (let i = 1; i < n; i++) {
       const card = cards[i];

       // старт
       const startX = i * (cardWidth + 200);

       // boosted финальная позиция
       const finalX = -i * overlapPx;

       // каскадное движение
       const localProgress = Math.min(
         Math.max(progress * (n - 1) - (i - 1), 0),
         1
       );

       const x = startX + (finalX - startX) * localProgress;

       gsap.set(card, { x });
     }
   };

   window.addEventListener("scroll", onScroll);
   window.addEventListener("resize", onResize);
   onScroll();

   return () => {
     window.removeEventListener("scroll", onScroll);
     window.removeEventListener("resize", onResize);
   };
 }, [mounted, isMobile]);


  // ------------------------------------------------------
  // MOBILE FIXED — earlier movement + safe bottom offset
  // ------------------------------------------------------
  useLayoutEffect(() => {
    if (!mounted || !isMobile) return;

    const section = sectionRef.current;
    if (!section) return;

    const cards = mobileCardsRef.current;
    const n = steps.length;

    const FIRST_TOP_VH = 0.32;
    const CARD_H_VH = 0.44;
    const SEPARATOR = 30;
    const OVERLAP = 0.35;
    const EARLY = 0.2; // start earlier

    const recomputeHeights = () => {
      const vh = window.innerHeight;
      const cardH = vh * CARD_H_VH;
      section.style.height = `${vh + (cardH * 1.1) * (n - 1)}px`;
    };

    const onScroll = () => {
      const sticky = stickyRef.current;
      if (!sticky) return;

      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = section.offsetHeight - vh;

      if (total <= 0) return;

      const offsetInside = Math.min(Math.max(-rect.top, 0), total);
      const progress = offsetInside / total;
      const stepProgress = progress * (n - 1);

      const cardH = Math.round(vh * CARD_H_VH);
      const overlapPx = Math.round(cardH * OVERLAP);
      const firstTop = Math.round(vh * FIRST_TOP_VH);
      const centerY = Math.round(vh / 2);

      for (let i = 0; i < n; i++) {
        const card = cards[i];
        if (!card) continue;

        const stackedTop = firstTop + i * (cardH + SEPARATOR);
        const stackedOffset =
          stackedTop - centerY + Math.round(cardH / 2);

        const finalTop = firstTop + i * overlapPx;
        const finalOffset =
          finalTop - centerY + Math.round(cardH / 2);

        // FIX: start animation earlier
        const raw = stepProgress - (i - 1) + EARLY;

        if (i === 0) {
          card.style.transform = `translate(-50%, -50%) translateY(${finalOffset}px)`;
          card.style.zIndex = "600";
          continue;
        }

        if (raw <= 0) {
          card.style.transform = `translate(-50%, -50%) translateY(${stackedOffset}px)`;
          card.style.zIndex = `${100 + i}`;
          continue;
        }

        const stage = Math.min(raw, 1);
        const offset =
          stackedOffset + (finalOffset - stackedOffset) * stage;

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
  }, [mounted, isMobile]);

  // ------------------------------------------------------
  // RENDER
  // ------------------------------------------------------
  return (
    <section
      id="howwework"
      ref={sectionRef}
      className="relative w-full bg-black text-white overflow-visible"
    >
      <div
        ref={stickyRef}
        className="sticky overflow-hidden top-0 h-screen flex flex-col px-4 pt-44"
      >
        <h2 className="text-center text-4xl md:text-5xl font-bold !mb-28 !-mt-20">
          HOW WE WORK
        </h2>

        {/* DESKTOP */}
        {!isMobile && mounted && (
          <div className="relative flex-1 flex items-center">
            <div
              ref={desktopTrackRef}
              className="relative flex gap-[24px] pl-[24px] pr-[24px] will-change-transform"
            >
              {steps.map((step, i) => (
                <div
                  key={i}
                  className="w-[40vw] min-w-[40vw] h-[340px] bg-[#DBFE02] px-12 py-12 shadow-[0_0_0_1px_rgba(0,0,0,0.15)]"
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
        {isMobile && mounted && (
          <div className="relative flex-1 mt-0">
            {steps.map((step, i) => (
              <div
                key={i}
                ref={(el) => {
                  mobileCardsRef.current[i] = el;
                }}

                className="
                  absolute left-1/2
                  w-[90vw] max-w-[440px]
                  -translate-x-1/2
                  bg-[#D7F000]
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
