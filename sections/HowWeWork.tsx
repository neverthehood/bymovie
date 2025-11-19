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

  const fadeValues = [1, 0.9, 0.82, 0.74, 0.66]; // C-medium

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

      // ===== DESKTOP =====
      if (!isMobile) {
        const CW = 570;
        const GAP = 16;
        const OVERLAP = (CW + GAP) * 0.65;
        const totalDistance = OVERLAP * (cards.length - 1);

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
    const rawX = -t * totalDistance;
    const limit = -(OVERLAP * i);

    // --- ДИНАМИКА ДЛЯ ПЕРВЫХ КАРТОЧЕК ---
    // обратный индекс
    const depthIndex = cards.length - 1 - i;

    // снижение насыщенности
    const saturation = 1 - t * (0.18 * depthIndex);
    const satClamped = Math.max(0.35, saturation);

    gsap.set(card, {
      x: Math.max(rawX, limit),
      filter: `saturate(${satClamped})`
    });
  });
},


        });
      }

      // ===== MOBILE =====
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

    const depthIndex = cards.length - 1 - i;

    const saturation = 1 - t * (0.18 * depthIndex);
    const satClamped = Math.max(0.35, saturation);

    gsap.set(card, {
      y: Math.max(rawY, limit),
      filter: `saturate(${satClamped})`
    });
  });
},


        });
      }
    }, section);

    return () => ctx.revert();
  }, [isMobile]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen bg-black text-white overflow-hidden pt-40"
    >
      <h2 className="text-center text-5xl font-bold mb-20">HOW WE WORK</h2>

      {/* DESKTOP */}
      {!isMobile && (
        <div className="relative w-full overflow-hidden">
          <div className="flex gap-[16px] pl-[16px]">
            {steps.map((step, i) => (
              <div
                key={i}
                ref={(el: HTMLDivElement | null) => {
                  cardsRef.current[i] = el;
                }}
                className="w-[570px] h-[290px] bg-[#F1FF9C] flex-shrink-0 px-10 py-10"
              >
                <h3 className="text-[48px] font-bold mb-4 text-[#101010]">
                  {step.title}
                </h3>
                <p className="text-[20px] whitespace-pre-line text-[#101010]">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MOBILE */}
      {isMobile && (
        <div className="relative w-full overflow-hidden px-4">
          <div className="flex flex-col gap-[16px]">
            {steps.map((step, i) => (
              <div
                key={i}
                ref={(el: HTMLDivElement | null) => {
                  cardsRef.current[i] = el;
                }}
                className="w-full h-[260px] bg-[#F1FF9C] px-8 py-8"
              >
                <h3 className="text-[36px] font-bold mb-3 text-[#101010]">
                  {step.title}
                </h3>
                <p className="text-[18px] whitespace-pre-line text-[#101010]">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Отступ под Projects */}
      <div className="h-40 md:h-60"></div>
    </section>
  );
}
