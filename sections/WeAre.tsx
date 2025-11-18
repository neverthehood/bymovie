"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function WeAre() {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const text =
    "We are BY Movie, a full-service studio in the world of virtual media production. Over 10 years we work at the intersection of technology and visual art.";

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const words = section.querySelectorAll<HTMLElement>(".word");
    if (!words.length) return;

    const isMobile = window.innerWidth < 768;

    // GSAP CONTEXT
    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { color: "rgba(255,255,255,0.15)" },
        {
          color: "rgba(255,255,255,1)",
          stagger: isMobile ? 0.20 : 0.12,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: isMobile ? "+=70%" : "+=120%",
            scrub: true,
            pin: true,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="
        w-full min-h-screen
        flex items-center justify-center
        bg-black px-4
      "
    >
      <div
        className="
          mx-auto text-center font-anybody
          leading-[1.2] tracking-tight
          max-w-[950px] md:text-[58px] text-[26px]
        "
      >
        {text.split(" ").map((w, i) => (
          <span
            key={i}
            className="word inline-block mr-[0.28em]"
          >
            {w}
          </span>
        ))}
      </div>
    </section>
  );
}
