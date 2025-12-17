"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";

export default function Hero() {
  const topMaskRef = useRef<HTMLDivElement | null>(null);
  const bottomMaskRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const buttonRef = useRef<HTMLAnchorElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // ============================
  // GSAP — AFTER FIRST PAINT
  // ============================
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!topMaskRef.current || !bottomMaskRef.current) return;

      gsap.fromTo(
        topMaskRef.current,
        { yPercent: 30 },
        { yPercent: -50, duration: 1.5, ease: "power3.inOut" }
      );

      gsap.fromTo(
        bottomMaskRef.current,
        { yPercent: -30 },
        { yPercent: 50, duration: 1.5, ease: "power3.inOut" }
      );

      gsap.fromTo(
        titleRef.current,
        { y: 40 },
        { y: 0, duration: 0.6, ease: "power2.out", delay: 0.8 }
      );

      gsap.fromTo(
        buttonRef.current,
        { y: 20 },
        { y: 0, duration: 0.5, ease: "power2.out", delay: 1 }
      );
    });

    return () => ctx.revert();
  }, []);

  // ============================
  // VIDEO — LOAD ON IDLE
  // ============================
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const loadVideo = () => {
      v.src =
        "https://vfq5uwwui8otjfkn.public.blob.vercel-storage.com/12_ShowReel_BY_Movie_004.webm";
      v.play().then(() => {
        v.classList.remove("opacity-0");
        v.classList.add("opacity-100");
      });
    };

    if ("requestIdleCallback" in window) {
      // @ts-ignore
      requestIdleCallback(loadVideo);
    } else {
      setTimeout(loadVideo, 1200);
    }
  }, []);

  return (
    <section className="relative w-full h-screen bg-black overflow-hidden">
      {/* LCP BACKGROUND (INSTANT) */}
      <div
        className="absolute inset-0 bg-center bg-cover"
        style={{ backgroundImage: "url('/hero-poster.webp')" }}
      />

      {/* VIDEO (AFTER) */}
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="none"
        className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700"
      />

      <div className="absolute inset-0 bg-black/40" />

      {/* CONTENT */}
      <div className="relative z-20 flex h-full flex-col items-center justify-center px-4">
        <h1
          ref={titleRef}
          className="
            font-anybody text-center font-extrabold uppercase
            leading-[0.9] text-white
            text-[40px] sm:text-[64px] md:text-[88px]
            lg:text-[110px] xl:text-[130px]
            max-w-[1600px] mx-auto
          "
        >
          <span className="block">THE FUTURE OF</span>
          <span className="block">MEDIA PRODUCTION</span>
          <span className="block">IS ALREADY HERE</span>
        </h1>
      </div>

      <Link
        ref={buttonRef}
        href="/vp"
        className="
          fixed bottom-8 right-8 z-50 rounded-full
          px-6 py-2 text-xs font-semibold uppercase tracking-[0.18em]
          text-black
          bg-gradient-to-r from-[#D7F000] via-[#F7FF65] to-[#D7F000]
          shadow-[0_0_12px_rgba(215,240,0,0.4)]
          transition-all duration-300
          hover:scale-105
        "
      >
        BY MOVIE VP PAVILION
      </Link>

      {/* MASKS */}
      <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
        <div
          ref={topMaskRef}
          className="absolute left-1/2 -translate-x-1/2 top-[-30vh]
            w-[220vw] h-[80vh] bg-black rounded-b-[40%]"
        />
        <div
          ref={bottomMaskRef}
          className="absolute left-1/2 -translate-x-1/2 bottom-[-30vh]
            w-[220vw] h-[80vh] bg-black rounded-t-[40%]"
        />
      </div>
    </section>
  );
}
