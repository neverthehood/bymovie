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

  // mounted guard + mobile flag
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile using matchMedia + mounted guard
  useEffect(() => {
    setIsMounted(true);

    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => {
      const mobile = mq.matches;
      setIsMobile(mobile);
    };

    update();

    const handler = () => update();
    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    } else {
      mq.addListener(handler);
      return () => mq.removeListener(handler);
    }
  }, []);

  // ----------------------------
  // DESKTOP horizontal scroll (unchanged)
  // ----------------------------
  useLayoutEffect(() => {
    if (!isMounted || isMobile) return;

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
  }, [isMounted, isMobile]);

  // ----------------------------
  // MOBILE stacking motion (stacked layout -> slight napolzanie on scroll)
  // ----------------------------
  useLayoutEffect(() => {
    if (!isMounted || !isMobile) return;

    const section = sectionRef.current;
    if (!section) return;

    const cards = mobileCardsRef.current;
    const n = steps.length;

    // Tunable parameters:
    // FIRST_STACK_TOP_VH - how far from viewport top the first card top sits in initial stacked layout
    // CARD_HEIGHT_VH - card height (fraction of vh)
    // SEPARATOR_PX - visible gap between stacked cards initially
    // OVERLAP_RATIO - how much next card overlaps previous when stopped (fraction of card height)
    // Adjusted to keep headings visible and move stack lower
    // ↓↓↓ ТУТ МЕНЯЕМ ТОЛЬКО ЭТИ ПАРАМЕТРЫ ↓↓↓

    // сколько первая карточка опущена вниз (0.42 идеальное значение)
    const FIRST_STACK_TOP_VH = 0.42;

    // высота карточки
    const CARD_HEIGHT_VH = 0.44;

    // расстояние между карточками в сложенном состоянии (можно оставить)
    const SEPARATOR_PX = 20;

    // насколько сильно карточки наползают друг на друга (делаем меньше!)
    const OVERLAP_RATIO = 0.28;


    const recomputeHeights = () => {
      const vh = window.innerHeight;
      // section tall enough so sticky locks while all cards arrive
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
      const progress = offsetInside / totalScrollable; // 0..1
      const stepProgress = progress * (n - 1); // 0..(n-1)

      // px constants
      const cardHeight = Math.round(vh * CARD_HEIGHT_VH);
      const overlapPx = Math.round(cardHeight * OVERLAP_RATIO);

      // initial stacked top (top of first card) in px relative to viewport
      const firstStackTop = Math.round(vh * FIRST_STACK_TOP_VH);

      // viewport center
      const centerY = Math.round(vh / 2);

      for (let i = 0; i < n; i++) {
        const card = cards[i];
        if (!card) continue;

        // stacked top (px) - vertical column with separator
        const stackedTop = firstStackTop + i * (cardHeight + SEPARATOR_PX);
        const stackedCenterOffset = stackedTop - centerY + Math.round(cardHeight / 2);

        // final top in overlapped layout (smaller gap -> overlap)
        const finalTop = firstStackTop + i * overlapPx;
        const finalCenterOffset = finalTop - centerY + Math.round(cardHeight / 2);

        // local progress for card i
        const raw = stepProgress - (i - 1);

        if (i === 0) {
          // first card pinned (keep it below header, visible)
          card.style.transform = `translate(-50%, -50%) translateY(${finalCenterOffset}px)`;
          card.style.zIndex = `${600}`;
          continue;
        }

        if (raw <= 0) {
          // still in stacked layout
          card.style.transform = `translate(-50%, -50%) translateY(${stackedCenterOffset}px)`;
          card.style.zIndex = `${100 + i}`;
          continue;
        }

        const stage = Math.min(raw, 1);
        // interpolate stacked->final (very subtle napolzanie)
        const offset = Math.round(stackedCenterOffset + (finalCenterOffset - stackedCenterOffset) * stage);

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
      window.removeEventListener("resize", () => {
        recomputeHeights();
        onScroll();
      });
      // cleanup inline styles (optional)
      section.style.height = "";
      cards.forEach((card) => {
        if (!card) return;
        card.style.transform = "";
        card.style.zIndex = "";
      });
    };
  }, [isMounted, isMobile]);

  // ----------------------------
  // RENDER
  // ----------------------------
  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-black text-white overflow-visible"
      data-scroll
    >
      <div
        ref={stickyRef}
        className="sticky overflow-hidden top-0 h-screen flex flex-col px-4 pt-44" /* big pt to push header+stack down */
      >
        <h2 className="text-center text-4xl md:text-5xl font-bold mb-6">
          HOW WE WORK
        </h2>

        {/* DESKTOP (unchanged) */}
        {isMounted && !isMobile && (
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

        {/* MOBILE (stack) */}
        {isMounted && isMobile && (
          <div className="relative flex-1 mt-0">
            {steps.map((step, i) => (
              <div
                key={i}
                ref={(el) => { mobileCardsRef.current[i] = el; }}
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