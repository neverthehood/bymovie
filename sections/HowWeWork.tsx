"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { title: "IDEA", desc: "Discuss the task,\nfind a style, collect references." },
  { title: "PRE-PRODUCTION", desc: "Creating a 3D-scene in Unreal Engine..." },
  { title: "SHOOTING", desc: "Choosing the type of technology..." },
  { title: "POST-PRODUCTION", desc: "Editing, VFX, compositing..." },
  { title: "DONE", desc: "Releasing your masterpiece" },
];

export default function HowWeWork() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const [isMobile, setIsMobile] = useState(false);

  // ----------------------------
  // Correct mobile detection
  // ----------------------------
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
    if (!section || cards.length < 2) return;

    const ctx = gsap.context(() => {
      // DESKTOP — горизонтальный режим
      if (!isMobile) {
        const CW = 570;
        const GAP = 16;
        const OVERLAP = (CW + GAP) * 0.65; // карточка заезжает только на 65%
        const totalDistance = OVERLAP * (cards.length - 1);
        const viewport = window.innerWidth;

        ScrollTrigger.create({
          trigger: section,
          start: "top+=50 top",
          end: `+=${totalDistance}`,
          scrub: true,
          pin: true,
          pinSpacing: true,
          onUpdate: (self) => {
            const t = self.progress;

            cards.forEach((card, i) => {
              if (i === 0) {
                // первая карточка стоит, только фильтр
                const sat = calcSaturation(t, i);
                gsap.set(card, { x: 0, filter: `saturate(${sat})` });
                return;
              }

              const rawX = -t * totalDistance;

              const lastLimit = -(CW * i - (viewport - CW));
              const overlapLimit = -(OVERLAP * i);
              const limit = Math.max(lastLimit, overlapLimit);

              const sat = calcSaturation(t, i);

              gsap.set(card, {
                x: Math.max(rawX, limit),
                filter: `saturate(${sat})`,
              });
            });
          },
        });
      }

      // MOBILE — вертикальный режим
      else {
        const CH = 260;
        const GAP = 16;
        const OVERLAP = (CH + GAP) * 0.7; // 70% перекрытия
        const totalDistance = OVERLAP * (cards.length - 1);

        ScrollTrigger.create({
          trigger: section,
          start: "top+=50 top",
          end: `+=${totalDistance}`,
          scrub: true,
          pin: true,
          pinSpacing: false,
          onUpdate: (self) => {
            const t = self.progress;

            cards.forEach((card, i) => {
              if (i === 0) {
                const sat = calcSaturation(t, i);
                gsap.set(card, { y: 0, filter: `saturate(${sat})` });
                return;
              }

              const rawY = -t * totalDistance;
              const limit = -(OVERLAP * i);
              const sat = calcSaturation(t, i);

              gsap.set(card, {
                y: Math.max(rawY, limit),
                filter: `saturate(${sat})`,
              });
            });
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, [isMobile]);

  // отдельная маленькая функция для насыщенности
  const calcSaturation = (t: number, index: number) => {
    // t: 0 → 1; index: 0,1,2...
    // Более тёмные (менее насыщенные) — ПЕРВЫЕ карточки при продвижении скролла
    const base = 1 - t; // чем дальше скролл, тем меньше
    const indexOffset = index * 0.18; // дальше по списку — светлее
    const raw = base - indexOffset; // может уйти в минус
    const sat = 0.4 + Math.max(0, raw) * 0.6; // clamp ~ [0.4, 1.0]
    return Math.max(0.4, Math.min(1, sat));
  };

  return (
    <section
      ref={sectionRef}
      data-scroll
      className="relative w-full min-h-screen bg-black text-white overflow-hidden pt-40 pb-0"
    >
      <h2 className="text-center text-5xl font-bold mb-20">HOW WE WORK</h2>

      {/* DESKTOP — горизонтальный лейаут */}
      {!isMobile && (
        <div className="relative w-full overflow-hidden">
          <div className="flex gap-[16px] pl-[16px]">
            {steps.map((step, i) => (
              <div
                key={i}
                ref={(el) => {
                  cardsRef.current[i] = el;
                }}
                className="w-[570px] h-[290px] bg-[#F1FF9C] flex-shrink-0 px-10 py-10"
              >
                <div className="text-[#101010]">
                  <h3 className="text-[48px] font-bold tracking-tight mb-4">
                    {step.title}
                  </h3>
                  <p className="text-[20px] whitespace-pre-line leading-tight text-[#101010]">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MOBILE — вертикальный лейаут */}
      {isMobile && (
        <div className="relative w-full overflow-hidden px-4">
          <div className="flex flex-col gap-[16px]">
            {steps.map((step, i) => (
              <div
                key={i}
                ref={(el) => {
                  cardsRef.current[i] = el;
                }}
                className="w-full h-[260px] bg-[#F1FF9C] px-8 py-8"
              >
                <div className="text-[#101010]">
                  <h3 className="text-[36px] font-bold tracking-tight mb-3">
                    {step.title}
                  </h3>
                  <p className="text-[18px] whitespace-pre-line leading-tight text-[#101010]">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* небольшой буфер, чтобы следующие секции не прилипали впритык */}
      <div className="h-40 md:h-60" />
    </section>
  );
}
