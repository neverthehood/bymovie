"use client";

import { useLayoutEffect, useRef, useState, useEffect } from "react";
import gsap from "gsap/dist/gsap";
import Loader from "@/components/Loader";
import Link from "next/link";

export default function Hero() {
  const [loaded, setLoaded] = useState(false);

  // ============================
  // DESKTOP refs
  // ============================
  const topMaskRef = useRef<HTMLDivElement | null>(null);
  const bottomMaskRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const buttonRef = useRef<HTMLAnchorElement | null>(null);

  // ============================
  // MOBILE refs
  // ============================
  const mTopMask = useRef<HTMLDivElement | null>(null);
  const mBottomMask = useRef<HTMLDivElement | null>(null);
  const mTitle = useRef<HTMLHeadingElement | null>(null);
  const mButton = useRef<HTMLAnchorElement | null>(null);

  // ============================
  // DESKTOP ANIMATION (LCP SAFE)
  // ============================
  useLayoutEffect(() => {
    if (!topMaskRef.current || !bottomMaskRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set([topMaskRef.current, bottomMaskRef.current], {
        willChange: "transform",
      });

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

      // ❗ БЕЗ opacity — LCP-safe
      gsap.fromTo(
        titleRef.current,
        { y: 40 },
        { y: 0, duration: 0.6, ease: "power2.out", delay: 0.9 }
      );

      gsap.fromTo(
        buttonRef.current,
        { y: 20 },
        { y: 0, duration: 0.5, ease: "power2.out", delay: 1.1 }
      );
    });

    return () => ctx.revert();
  }, []);

  // ============================
  // MOBILE ANIMATION
  // ============================
  useLayoutEffect(() => {
    if (!mTopMask.current || !mBottomMask.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        mTopMask.current,
        { yPercent: 25 },
        { yPercent: -30, duration: 1.2, ease: "power3.inOut" }
      );

      gsap.fromTo(
        mBottomMask.current,
        { yPercent: -25 },
        { yPercent: 30, duration: 1.2, ease: "power3.inOut" }
      );

      gsap.fromTo(
        mTitle.current,
        { y: 30 },
        { y: 0, duration: 0.6, ease: "power2.out", delay: 0.8 }
      );

      gsap.fromTo(
        mButton.current,
        { y: 15 },
        { y: 0, duration: 0.5, ease: "power2.out", delay: 1 }
      );
    });

    return () => ctx.revert();
  }, []);

  // ============================
  // RENDER
  // ============================
  return (
    <>
      {!loaded && (
        <div className="fixed inset-0 z-[9999]">
          <Loader onFinished={() => setLoaded(true)} />
        </div>
      )}


      <section className="relative w-full overflow-hidden bg-black">
        {/* DESKTOP */}
        <div className="hidden md:block relative h-screen w-full overflow-hidden">
          <video
            autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              poster="/hero-poster.webp"
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source
              src="https://vfq5uwwui8otjfkn.public.blob.vercel-storage.com/12_ShowReel_BY_Movie_004.webm"
              type="video/webm"
            />
          </video>

          <div className="absolute inset-0 bg-black/40" />

          <div className="relative z-20 flex h-full flex-col items-center justify-center px-4">
            {/* ✅ LCP ELEMENT — ВИДЕН СРАЗУ */}
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
              bg-[length:200%_200%]
              animate-[gradientMove_6s_ease_infinite]
              shadow-[0_0_12px_rgba(215,240,0,0.4)]
              transition-all duration-300
              hover:scale-105 hover:shadow-[0_0_20px_rgba(215,240,0,0.8)]
              active:scale-95
            "
          >
            BY MOVIE VP PAVILION
          </Link>

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
        </div>

        {/* MOBILE */}
        <div className="block md:hidden relative h-screen w-full overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster="/hero-poster.webp"
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source
              src="https://vfq5uwwui8otjfkn.public.blob.vercel-storage.com/12_ShowReel_BY_Movie_004.webm"
              type="video/webm"
            />
          </video>

          <div className="absolute inset-0 bg-black/35" />

          <div className="relative z-20 flex h-full flex-col items-center justify-center px-4">
            <h1
              ref={mTitle}
              className="
                font-anybody text-center font-extrabold uppercase
                leading-[1] text-white text-[32px]
              "
            >
              <span className="block">THE FUTURE OF</span>
              <span className="block">MEDIA PRODUCTION</span>
              <span className="block">IS ALREADY HERE</span>
            </h1>
          </div>

          <Link
            ref={mButton}
            href="/vp"
            className="
              absolute bottom-8 right-8 z-50 rounded-full
              px-6 py-2 text-xs font-semibold uppercase tracking-[0.18em]
              text-black
              bg-gradient-to-r from-[#D7F000] via-[#F7FF65] to-[#D7F000]
              bg-[length:200%_200%]
              animate-[gradientMove_6s_ease_infinite]
              shadow-[0_0_12px_rgba(215,240,0,0.4)]
            "
          >
            BY MOVIE VP PAVILION
          </Link>

          <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
            <div
              ref={mTopMask}
              className="absolute left-1/2 -translate-x-1/2 top-[-26vh]
                w-[200vw] h-[50vh] bg-black rounded-b-[30%]"
            />
            <div
              ref={mBottomMask}
              className="absolute left-1/2 -translate-x-1/2 bottom-[-26vh]
                w-[200vw] h-[50vh] bg-black rounded-t-[30%]"
            />
          </div>
        </div>
      </section>
    </>
  );
}
