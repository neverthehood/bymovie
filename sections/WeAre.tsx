"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const text =
  "We are BY Movie, a full-service studio in the world of virtual media production. Over 10 years we work at the intersection of technology and visual art.";

export default function WeAre() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const words = content.querySelectorAll<HTMLElement>(".word");
    if (!words.length) return;

    gsap.set(words, { color: "rgba(255,255,255,0.15)" });

    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      // -----------------------------
      // PIN only the inner text block
      // -----------------------------
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: isMobile ? "+=70%" : "+=120%",
        pin: content,
        pinSpacing: true,
        scrub: true,
      });

      // -----------------------------
      // Word coloring animation
      // -----------------------------
      gsap.to(words, {
        color: "white",
        stagger: isMobile ? 0.20 : 0.12,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: isMobile ? "+=70%" : "+=120%",
          scrub: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-scroll
      className="w-full min-h-screen flex items-center justify-center bg-black px-6"
    >
      <div
        ref={contentRef}
        className="max-w-[900px] mx-auto text-center font-anybody text-[36px] md:text-[58px] leading-[1.2]"
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
