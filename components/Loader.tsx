"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Loader({
  onFinished,
}: {
  onFinished?: () => void;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const leftBarRef = useRef<HTMLDivElement>(null);
  const rightBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(wrapperRef.current, {
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
          onComplete: () => {
            onFinished?.();
          },
        });
      },
    });

    tl.to({}, {
      duration: 1.2,
      ease: "none",
      onUpdate() {
        const p = Math.floor(tl.progress() * 100);

        if (textRef.current) {
          textRef.current.textContent = `LOADING ${p}%`;
        }

        if (leftBarRef.current && rightBarRef.current) {
          leftBarRef.current.style.width = `${p / 2}%`;
          rightBarRef.current.style.width = `${p / 2}%`;
        }
      },
    });

    return () => {
      tl.kill();
    };
  }, [onFinished]);

  return (
    <div
      ref={wrapperRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black text-white"
    >
      <div
        ref={textRef}
        className="mb-8 select-none text-sm tracking-widest text-[#D7F000]"
      >
        LOADING 0%
      </div>

      <div className="relative h-[2px] w-full max-w-none overflow-hidden">
        <div
          ref={leftBarRef}
          className="absolute top-0 left-1/2 h-full bg-[#D7F000]"
          style={{ transform: "translateX(-100%)", width: 0 }}
        />
        <div
          ref={rightBarRef}
          className="absolute top-0 left-1/2 h-full bg-[#D7F000]"
          style={{ width: 0 }}
        />
      </div>

      <div className="absolute bottom-10 select-none text-[10px] tracking-wider opacity-60">
        VIRTUAL PRODUCTION TECHNOLOGIES FOR ANY TASK
      </div>
    </div>
  );
}
