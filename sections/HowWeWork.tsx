"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";

const steps = [
  {
    title: "IDEA",
    desc: "Discuss the task,\nfind a style, collect references.",
  },
  {
    title: "PRE-PRODUCTION",
    desc:
      "Creating a 3D-scene in Unreal Engine.\n" +
      "City, forest, interior, space — everything is possible.",
  },
  {
    title: "SHOOTING",
    desc:
      "Choosing the type of technology:\n" +
      "LED-filming or on live chromakey.\n" +
      "We can realize everything on the set.",
  },
  {
    title: "POST-PRODUCTION",
    desc:
      "Editing, VFX, compositing, color grading.\n" +
      "Final touches or nothing if everything is ready at once.",
  },
  {
    title: "DONE",
    desc: "Releasing your masterpiece.",
  },
];

export default function HowWeWork() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const desktopTrackRef = useRef<HTMLDivElement | null>(null);
  const mobileCardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [active, setActive] = useState(false); // ← ключевая оптимизация

  // ------------------------------------------------------
  // MOUNT + MOBILE DETECTION (НЕ ТРОГАЕМ)
  // ------------------------------------------------------
  useEffect(() => {
    setMounted(true);

    const check = () => setIsMobile(window.innerWidth < 768);
    check();

    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ------------------------------------------------------
  // INTERSECTION OBSERVER (включаем анимации только когда надо)
  // ------------------------------------------------------
  useEffect(() => {
    if (!sectionRef.current) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        setActive(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);

  // ------------------------------------------------------
  // DESKTOP SCROLL ANIMATION (АКТИВНА ТОЛЬКО КОГДА visible)
  // ------------------------------------------------------
  useLayoutEffect(() => {
    if (!mounted || isMobile || !active) return;

    const section = sectionRef.current;
    const sticky = stickyRef.current;
    const track = desktopTrackRef.current;
    if (!section || !sticky || !track) return;

    const cards = Array.from(track.children) as HTMLElement[];
    const n = cards.length;
    const overlapBoost = 1.75;

    const onResize = () => {
      const vh = window.innerHeight;
      section.style.height = `${vh * 3}px`;
    };

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const span = vh * 2;

      const offset = Math.min(Math.max(-rect.top, 0), span);
      const progress = offset / span;

      const cardW = cards[0].offsetWidth;
      const viewportW = sticky.clientWidth;
      const baseOverlap = (viewportW - cardW) / (n - 1);
      const overlap = baseOverlap * overlapBoost;

      gsap.set(cards[0], { x: 0 });

      for (let i = 1; i < n; i++) {
        const startX = i * (cardW + 200);
        const finalX = -i * overlap;

        const local = Math.min(
          Math.max(progress * (n - 1) - (i - 1), 0),
          1
        );

        gsap.set(cards[i], {
          x: startX + (finalX - startX) * local,
        });
      }
    };

    onResize();
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [mounted, isMobile, active]);

  // ------------------------------------------------------
  // MOBILE STACK ANIMATION (ТОЖЕ ТОЛЬКО КОГДА visible)
  // ------------------------------------------------------
  useLayoutEffect(() => {
    if (!mounted || !isMobile || !active) return;

    const section = sectionRef.current;
    if (!section) return;

    const cards = mobileCardsRef.current;
    const n = cards.length;

    const FIRST_TOP_VH = 0.32;
    const CARD_H_VH = 0.44;
    const OVERLAP = 0.35;
    const EXTRA_BOTTOM = 0.25;

    const recompute = () => {
      const vh = window.innerHeight;
      const cardH = vh * CARD_H_VH;
      section.style.height =
        vh + cardH * (n - 1) + vh * EXTRA_BOTTOM + "px";
    };

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = section.offsetHeight - vh;
      if (total <= 0) return;

      const progress = Math.min(Math.max(-rect.top, 0), total) / total;
      const step = progress * (n - 1);

      const cardH = vh * CARD_H_VH;
      const overlapPx = cardH * OVERLAP;
      const firstTop = vh * FIRST_TOP_VH;
      const centerY = vh / 2;

      cards.forEach((card, i) => {
        if (!card) return;

        const stacked =
          firstTop + i * cardH - centerY + cardH / 2;
        const final =
          firstTop + i * overlapPx - centerY + cardH / 2;

        const p = Math.min(Math.max(step - i + 1, 0), 1);
        const y = stacked + (final - stacked) * p;

        card.style.transform =
          `translate(-50%, -50%) translateY(${y}px)`;
        card.style.zIndex = String(600 + i);
      });
    };

    recompute();
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", recompute);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", recompute);
    };
  }, [mounted, isMobile, active]);

  // ------------------------------------------------------
  // RENDER
  // ------------------------------------------------------
  return (
    <section
      id="howwework"
      ref={sectionRef}
      className="relative w-full bg-black text-white"
    >
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen flex flex-col px-4 pt-44"
      >
        <h2 className="text-center text-4xl md:text-5xl font-bold mb-28 -mt-20">
          HOW WE WORK
        </h2>

        {!isMobile && mounted && (
          <div className="flex-1 flex items-center">
            <div
              ref={desktopTrackRef}
              className="flex gap-6 pl-6 pr-6"
            >
              {steps.map((s, i) => (
                <div
                  key={i}
                  className="w-[40vw] min-w-[40vw] h-[340px] bg-[#DBFE02] px-12 py-12"
                >
                  <div className="text-[#101010] h-full flex flex-col justify-between">
                    <div>
                      <div className="opacity-50 mb-1">[{i + 1}]</div>
                      <h3 className="text-4xl font-bold mb-6">
                        {s.title}
                      </h3>
                    </div>
                    <p className="whitespace-pre-line text-lg">
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {isMobile && mounted && (
          <div className="relative flex-1">
            {steps.map((s, i) => (
              <div
                key={i}
                ref={(el) => (mobileCardsRef.current[i] = el)}
                className="absolute left-1/2 w-[90vw] max-w-[440px]
                  -translate-x-1/2 bg-[#D7F000] px-6 py-8"
              >
                <div className="text-center opacity-50 mb-3">
                  [{i + 1}]
                </div>
                <h3 className="text-center text-2xl font-bold mb-4">
                  {s.title}
                </h3>
                <p className="text-center whitespace-pre-line">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
