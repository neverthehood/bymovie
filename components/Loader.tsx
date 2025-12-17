"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";

export default function Loader({
  onFinished,
}: {
  onFinished?: () => void;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    gsap.to({}, {
      duration: 1.2,
      ease: "none",
      onUpdate: function () {
        const p = Math.floor(this.progress() * 100);
        setProgress(p);
      },
      onComplete: () => {
        gsap.to(".loader-wrapper", {
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
          onComplete: () => {
            onFinished?.(); // ← безопасно
          },
        });
      },
    });
  }, [onFinished]);

  return (
    <div className="loader-wrapper fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black text-white pointer-events-none">
      <div className="mb-8 select-none text-sm tracking-widest text-[#D7F000]">
        LOADING {progress}%
      </div>

      <div className="relative h-[2px] w-full max-w-none overflow-hidden">
        <div
          className="absolute top-0 left-1/2 h-full bg-[#D7F000]"
          style={{ width: `${progress / 2}%`, transform: "translateX(-100%)" }}
        />
        <div
          className="absolute top-0 left-1/2 h-full bg-[#D7F000]"
          style={{ width: `${progress / 2}%` }}
        />
      </div>

      <div className="absolute bottom-10 select-none text-[10px] tracking-wider opacity-60">
        VIRTUAL PRODUCTION TECHNOLOGIES FOR ANY TASK
      </div>
    </div>
  );
}
