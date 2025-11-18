"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollContext } from "./ScrollContext";
import gsap from "gsap";

// импортируем, но регистрируем только в браузере
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ScrollController({
  children,
}: {
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isAutoRef = useRef(false);
  const [current, setCurrent] = useState(0);

  const SNAP_LIMIT = 3;

  // мягкий ease
  const ease = (x: number) => -(Math.cos(Math.PI * x) - 1) / 2;

  const scrollToSection = (index: number) => {
    const root = containerRef.current;
    if (!root) return;

    const sections = Array.from(
      root.querySelectorAll<HTMLElement>("section[data-scroll]")
    );

    const target = sections[index];
    if (!target) return;

    const start = window.scrollY;
    const end = target.offsetTop;
    const duration = 550;
    const t0 = performance.now();

    isAutoRef.current = true;

    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / duration);
      const y = start + (end - start) * ease(t);

      window.scrollTo(0, y);

      if (t < 1) requestAnimationFrame(step);
      else {
        isAutoRef.current = false;
        setCurrent(index);
      }
    };

    requestAnimationFrame(step);
  };

  useEffect(() => {
    // ⛔️ Регистрируем ScrollTrigger только на клиенте
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    const handler = (e: WheelEvent) => {
      if (isAutoRef.current) {
        e.preventDefault();
        return;
      }

      const root = containerRef.current;
      if (!root) return;

      // безопасная проверка ScrollTrigger
      const weArePin = ScrollTrigger.getById?.("weare-pin");

      if (current === 1 && weArePin?.isActive) {
        return;
      }

      const direction = e.deltaY > 0 ? 1 : -1;
      const next = current + direction;

      if (current >= SNAP_LIMIT) return;
      if (next < 0 || next > SNAP_LIMIT) return;

      e.preventDefault();
      scrollToSection(next);
    };

    window.addEventListener("wheel", handler, { passive: false });
    return () => window.removeEventListener("wheel", handler as any);
  }, [current]);

  return (
    <ScrollContext.Provider value={current}>
      <div ref={containerRef}>{children}</div>
    </ScrollContext.Provider>
  );
}
