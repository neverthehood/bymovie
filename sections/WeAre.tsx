"use client";

import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function WeAre() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current || !textRef.current) return;

    const ctx = gsap.context(() => {
      const text = textRef.current!;
      const letters: HTMLElement[] = [];

      // Split into spans
      text.querySelectorAll("p").forEach((p) => {
        const chars = p.textContent!
          .split("")
          .map((c) => `<span class="letter inline-block opacity-20">${c}</span>`)
          .join("");

        p.innerHTML = chars;
      });

      text.querySelectorAll(".letter").forEach((l) =>
        letters.push(l as HTMLElement)
      );

      gsap.to(letters, {
        color: "#ffffff",
        opacity: 1,
        stagger: 0.004,
        ease: "none",
        scrollTrigger: {
  trigger: sectionRef.current,
  start: "top top+=100",   // ← очень важно
  end: "bottom+=200% top",
  scrub: true,
  pin: true,
  pinSpacing: true,
},

      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen bg-black text-white flex items-center justify-center px-6"
    >
      <div ref={textRef} className="max-w-[1000px] text-center leading-tight">
        <p className="text-[32px] md:text-[52px] font-light opacity-20">
          WE ARE A CREATIVE TEAM WORKING AT THE CROSSROADS OF TECHNOLOGY AND CINEMA.
        </p>

        <p className="mt-10 text-[32px] md:text-[52px] font-light opacity-20">
          WE DESIGN FUTURE-PROOF MEDIA PIPELINES AND IMMERSIVE VISUAL EXPERIENCES.
        </p>

        <p className="mt-10 text-[32px] md:text-[52px] font-light opacity-20">
          WE BUILD THE NEW ERA OF MEDIA PRODUCTION.
        </p>
      </div>
    </section>
  );
}
