"use client";

import { useRef, useLayoutEffect } from "react";
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

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
    if (!section || cards.length < 2) return;

    const CW = 570;
    const GAP = 16;
    const STOP = (CW + GAP) / 2;
    const viewport = window.innerWidth;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=800",
        scrub: true,
        pin: true,
        onUpdate: (self) => {
          const t = self.progress;

          cards.forEach((card, i) => {
            if (i === 0) return;

            // Все едут вместе
            const rawX = -t * (STOP * (cards.length - 1));

            // Общее ограничение (паровозик)
            let limit = -(STOP * i);

            // Доп. логика ДЛЯ ПОСЛЕДНЕЙ
            if (i === cards.length - 1) {
              const fullStop = -(CW * i - (viewport - CW));
              limit = fullStop;
            }

            const x = Math.max(rawX, limit);
            gsap.set(card, { x });
          });
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-scroll
      className="relative w-full min-h-screen bg-black text-white overflow-hidden pt-40 pb-0"
    >
      <h2 className="text-center text-5xl font-bold mb-20">HOW WE WORK</h2>

      <div className="relative w-full overflow-hidden">
        <div className="flex gap-[16px] pl-[16px]">
          {steps.map((step, i) => (
            <div
              key={i}
              ref={(el) => (cardsRef.current[i] = el)}
              className="w-[570px] h-[290px] bg-[#F1FF9C] flex-shrink-0 px-10 py-10 shadow-xl"
            >
              <div className="text-[#101010]">{/* ← исправлено */}
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
    </section>
  );
}
