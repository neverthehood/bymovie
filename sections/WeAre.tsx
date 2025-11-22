"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const text =
  "We are BY Movie, a full-service studio in the world of virtual media production. Over 10 years we work at the intersection of technology and visual art.";

export default function WeAre() {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const words = Array.from(
      section.querySelectorAll<HTMLElement>(".word")
    );
    if (!words.length) return;

    const STEP = 80; // длина одного "шага" по скроллу
    const total = STEP * words.length;

    const ctx = gsap.context(() => {
      // стартовый цвет
      gsap.set(words, { color: "rgba(255,255,255,0.18)" });

      let lastIndex = -1;

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${total}`,
        pin: true,
        scrub: true,
        onUpdate(self) {
          const progress = self.progress; // 0..1
          let index = Math.floor(progress * words.length);

          if (index < 0) index = 0;
          if (index >= words.length) index = words.length - 1;

          if (index === lastIndex) return;
          lastIndex = index;

          // красим слова дискретно: всё до текущего – белое, остальное – полупрозрачное
          words.forEach((w, i) => {
            gsap.to(w, {
              color: i <= index ? "#ffffff" : "rgba(255,255,255,0.18)",
              duration: 0.25,
              ease: "none",
              overwrite: "auto",
            });
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
      className="
        w-full min-h-screen
        flex items-center justify-center
        bg-black px-6
      "
    >
      <div
        className="
          max-w-[980px] mx-auto text-center font-anybody
          leading-[1.2] tracking-tight
          text-[32px] md:text-[58px]
        "
      >
        {text.split(" ").map((w, i) => (
          <span key={i} className="word inline-block mr-[0.32em]">
            {w}
          </span>
        ))}
      </div>
    </section>
  );
}
