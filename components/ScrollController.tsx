"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollContext } from "./ScrollContext";

// Важно: ScrollTrigger используется здесь глобально,
// он уже подключен в секциях WeAre и HowWeWork
declare const ScrollTrigger: any;

export default function ScrollController({
  children,
}: {
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isAutoRef = useRef(false);
  const [current, setCurrent] = useState(0);

  const SNAP_LIMIT = 3; // 0 Hero, 1 WeAre, 2 Services, 3 HowWeWork

  // Мягкий ease
  const ease = (x: number) => -(Math.cos(Math.PI * x) - 1) / 2;

  const scrollToSection = (targetIndex: number) => {
    const container = containerRef.current;
    if (!container) return;

    const sections = Array.from(
      container.querySelectorAll<HTMLElement>("section[data-scroll]")
    );

    const target = sections[targetIndex];
    if (!target) return;

    const start = window.scrollY;
    const end = target.offsetTop;
    const duration = 550;
    const startTime = performance.now();

    isAutoRef.current = true;

    const step = (now: number) => {
      const t = Math.min(1, (now - startTime) / duration);
      const v = start + (end - start) * ease(t);

      window.scrollTo(0, v);

      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        isAutoRef.current = false;
        setCurrent(targetIndex);
      }
    };

    requestAnimationFrame(step);
  };

  useEffect(() => {
    const handler = (e: WheelEvent) => {
      // если идет автодоскролл — блокируем управление
      if (isAutoRef.current) {
        e.preventDefault();
        return;
      }

      // проверяем PIN секции WeAre (чтобы не перескакивало!)
      const weArePin = ScrollTrigger?.getById?.("weare-pin");
      if (weArePin?.isActive) {
        // WeAre pinned → запрещаем автолистание
        return;
      }

      const container = containerRef.current;
      if (!container) return;

      const direction = e.deltaY > 0 ? 1 : -1;
      const nextIndex = current + direction;

      // после HowWeWork обычный скролл
      if (current >= SNAP_LIMIT) return;

      if (nextIndex < 0 || nextIndex > SNAP_LIMIT) return;

      e.preventDefault();
      scrollToSection(nextIndex);
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
