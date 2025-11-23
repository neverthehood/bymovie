"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const text =
  "We are BY Movie, a full-service studio in the world of virtual media production. Over 10 years we work at the intersection of technology and visual art.";

export default function WeAre() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const words = el.querySelectorAll<HTMLElement>(".word");
    if (!words.length) return;

    const isMobile = window.innerWidth < 768;
    const distance = isMobile ? 800 : 1500; // длина скролла для анимации

    const ctx = gsap.context(() => {
      gsap.set(words, { color: "rgba(255,255,255,0.18)" });

      // pin секции
      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: `+=${distance}`,
        pin: true,
        scrub: true,
      });

      // закрашивание слов
      gsap.to(words, {
        color: "white",
        stagger: isMobile ? 0.2 : 0.12,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: `+=${distance}`,
          scrub: true,
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
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
          text-[24px] md:text-[58px]
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
