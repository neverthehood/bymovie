"use client";

import { useEffect, useRef } from "react";
import { ScrollContext } from "./ScrollContext";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DISABLE_AUTOSCROLL } from "@/app/config";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ScrollController({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const ease = (x: number) => -(Math.cos(Math.PI * x) - 1) / 2;

  const smoothScrollTo = (y: number) => {
    const start = window.scrollY;
    const duration = 350;
    const t0 = performance.now();

    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / duration);
      const v = start + (y - start) * ease(t);

      window.scrollTo(0, v);

      if (t < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  useEffect(() => {
    const handler = (e: WheelEvent) => {
      if (DISABLE_AUTOSCROLL) return;

      const pinnedActive = ScrollTrigger.getAll().some(
        (t) => t.pin && t.isActive
      );

      if (pinnedActive) {
        // ❗ блокируем нативный scroll, но НЕ выходим
        e.preventDefault();
        return; // GSAP уже перехватил scrollTrigger и работает сам
      }

      const root = containerRef.current;
      if (!root) return;

      const sections = Array.from(
        root.querySelectorAll<HTMLElement>("section[data-scroll]")
      );
      if (sections.length < 2) return;

      const hero = sections[0];
      const weAre = sections[1];

      const scrollY = window.scrollY;
      const heroStopZone = hero.offsetTop + hero.offsetHeight * 0.55;

      // HERO → WEARE автоскролл
      if (scrollY < heroStopZone && e.deltaY > 0) {
        e.preventDefault();
        smoothScrollTo(weAre.offsetTop);
        return;
      }
    };

    window.addEventListener("wheel", handler, { passive: false });
    return () => window.removeEventListener("wheel", handler as any);
  }, []);

  return (
    <ScrollContext.Provider value={0}>
      <div ref={containerRef}>{children}</div>
    </ScrollContext.Provider>
  );
}
