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

  // MOBILE detection
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
      ScrollTrigger.getAll().forEach((t) => t.kill());

      // ╔═══════════════════════════════════════╗
      // ║ DESKTOP — полностью как в рабочей версии ║
      // ╚═══════════════════════════════════════╝
      if (!isMobile) {
        const CW = 570;
        const GAP = 16;
        const STOP = (CW + GAP) / 2;
        const viewport = window.innerWidth;

        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "+=800",
          scrub: true,
          pin: true,
          pinSpacing: true,

          onUpdate: (self) => {
            const t = self.progress;

            cards.forEach((card, i) => {
              if (i === 0) return;

              const rawX = -t * (STOP * (cards.length - 1));
              let limit = -(STOP * i);

              if (i === cards.length - 1) {
                const fullStop = -(CW * i - (viewport - CW));
                limit = fullStop;
              }

              gsap.set(card, { x: Math.max(rawX, limit) });
            });
          },
        });
      }

      // ╔══════════════════════════════════════════╗
      // ║ MOBILE — новая версия с overlap + saturation ║
      // ╚══════════════════════════════════════════╝
      else {
        const CH = 260;
        const GAP = 16;
        const OVERLAP = (CH + GAP) * 0.7;
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
              const rawY = -t * totalDistance;
              const limit = -(OVERLAP * i);

              // насыщенность — только для УПЕРХНИХ
              const sat = calcSaturationMobile(t, i);

              gsap.set(card, {
                y: i === 0 ? 0 : Math.max(rawY, limit),
                filter: `saturate(${sat})`,
              });
            });
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, [isMobile]);

  // мягкое уменьшение насыщенности на мобилке (верхние — более блеклые)
  const calcSaturationMobile = (t: number, index: number) => {
    const fade = 0.85 - t * 0.7; // тень по мере скролла
    const offset = 1 - index * 0.12; // каждая следующая карточка насыщеннее
    return Math.max(0.55, Math.min(1, fade * offset));
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen bg-black text-white overflow-hidden pt-40 pb-0"
    >
      <h2 className="text-center text-5xl font-bold mb-20">HOW WE WORK</h2>

      {/* DESKTOP layout */}
      {!isMobile && (
        <div className="relative w-full overflow-hidden">
          <div className="flex gap-[16px] pl-[16px]">
            {steps.map((step, i) => (
              <div
                key={i}
                ref={(el) => (cardsRef.current[i] = el)}
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

      {/* MOBILE layout */}
      {isMobile && (
        <div className="relative w-full overflow-hidden px-4">
          <div className="flex flex-col gap-[16px]">
            {steps.map((step, i) => (
              <div
                key={i}
                ref={(el) => (cardsRef.current[i] = el)}
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
    </section>
  );
}
