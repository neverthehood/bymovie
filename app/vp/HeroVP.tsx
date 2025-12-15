"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export default function HeroVP() {
  const topMask = useRef<HTMLDivElement | null>(null);
  const bottomMask = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!topMask.current || !bottomMask.current) return;

    gsap.set(topMask.current, { yPercent: 30 });
    gsap.set(bottomMask.current, { yPercent: -30 });

    gsap.timeline()
      .to(topMask.current, {
        yPercent: -50,
        duration: 1.4,
        ease: "power3.inOut",
      }, 0)
      .to(bottomMask.current, {
        yPercent: 50,
        duration: 1.4,
        ease: "power3.inOut",
      }, 0);

  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      {/* Background video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="https://vfq5uwwui8otjfkn.public.blob.vercel-storage.com/12_ShowReel_BY_Movie_004.webm" type="video/webm" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Title */}
      <div className="relative z-20 flex h-full items-center justify-center">
        <h1 className="
          text-white text-center font-bold uppercase
          text-5xl md:text-7xl leading-[1.05] tracking-tight
        ">
          Virtual<br />
          Production<br />
          LED Wall
        </h1>
      </div>

      {/* Masks */}
      <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
        <div
          ref={topMask}
          className="
            absolute left-1/2 -translate-x-1/2 top-[-30vh]
            w-[220vw] h-[80vh]
            bg-black rounded-b-[40%]
          "
        />
        <div
          ref={bottomMask}
          className="
            absolute left-1/2 -translate-x-1/2 bottom-[-30vh]
            w-[220vw] h-[80vh]
            bg-black rounded-t-[40%]
          "
        />
      </div>
    </section>
  );
}
