"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export default function Hero() {
  // DESKTOP refs
  const topMaskRef = useRef<HTMLDivElement | null>(null);
  const bottomMaskRef = useRef<HTMLDivElement | null>(null);
  const maskWrapperRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // MOBILE refs
  const mTopMask = useRef<HTMLDivElement | null>(null);
  const mBottomMask = useRef<HTMLDivElement | null>(null);
  const mWrapper = useRef<HTMLDivElement | null>(null);
  const mTitle = useRef<HTMLHeadingElement | null>(null);
  const mButton = useRef<HTMLButtonElement | null>(null);

  // DESKTOP ANIMATION (не трогаем!)
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (!topMaskRef.current || !bottomMaskRef.current || !maskWrapperRef.current) return;

      gsap.set(topMaskRef.current, { yPercent: 30 });
      gsap.set(bottomMaskRef.current, { yPercent: -30 });

      const tl = gsap.timeline();

      tl.to(
        topMaskRef.current,
        { yPercent: -50, duration: 1.5, ease: "power3.inOut" },
        0
      )
        .to(
          bottomMaskRef.current,
          { yPercent: 50, duration: 1.5, ease: "power3.inOut" },
          0
        )
        .fromTo(
          titleRef.current,
          { autoAlpha: 0, y: 40 },
          { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" },
          "-=0.5"
        )
        .fromTo(
          buttonRef.current,
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" },
          "-=0.3"
        );
    });

    return () => ctx.revert();
  }, []);

  // MOBILE ANIMATION
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (!mTopMask.current || !mBottomMask.current || !mWrapper.current) return;

      gsap.set(mTopMask.current, { yPercent: 25 });
      gsap.set(mBottomMask.current, { yPercent: -25 });

      const tl = gsap.timeline();

      tl.to(
        mTopMask.current,
        {
          yPercent: -30,
          duration: 1.2,
          ease: "power3.inOut",
        },
        0
      )
        .to(
          mBottomMask.current,
          {
            yPercent: 30,
            duration: 1.2,
            ease: "power3.inOut",
          },
          0
        )
        .fromTo(
          mTitle.current,
          { autoAlpha: 0, y: 30 },
          { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" },
          "-=0.4"
        )
        .fromTo(
          mButton.current,
          { autoAlpha: 0, y: 15 },
          { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" },
          "-=0.3"
        );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-black">

      {/* =============== DESKTOP VERSION =============== */}
      <div className="hidden md:block relative h-screen w-full overflow-hidden">

        {/* VIDEO */}
        <video
  autoPlay
  loop
  muted
  playsInline
  className="absolute inset-0 h-full w-full object-cover"
>
  <source src="/assets/video/hero.webm" type="video/webm" />
  <source src="/assets/video/hero.mp4" type="video/mp4" />
</video>


        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/40" />

        {/* TITLE */}
        <div className="relative z-20 flex h-full flex-col items-center justify-center px-4">
          <h1
            ref={titleRef}
            className="font-anybody text-center font-extrabold uppercase leading-[0.9] text-white text-[40px] sm:text-[64px] md:text-[88px] lg:text-[110px] xl:text-[130px] max-w-[1600px] mx-auto">
            <span className="block">THE FUTURE OF</span>
            <span className="block">MEDIA PRODUCTION</span>
            <span className="block">IS ALREADY HERE</span>
          </h1>
        </div>

        {/* BUTTON */}
        <button
          ref={buttonRef}
          className="absolute bottom-8 right-8 z-50 rounded-full bg-[#D7F000] px-6 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-black">
          BY MOVIE VP PAVILION
        </button>

        {/* MASKS */}
        <div ref={maskWrapperRef} className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
          <div
            ref={topMaskRef}
            className="absolute left-1/2 -translate-x-1/2 top-[-30vh]
                       w-[160vw] h-[80vh] bg-black rounded-b-[40%] blur-[18px]"
          />
          <div
            ref={bottomMaskRef}
            className="absolute left-1/2 -translate-x-1/2 bottom-[-30vh] w-[160vw] h-[80vh] bg-black rounded-t-[40%] blur-[18px]"/>
        </div>
      </div>

      {/* =============== MOBILE VERSION =============== */}
      <div className="block md:hidden relative h-screen w-full overflow-hidden">

        {/* VIDEO */}
        <video
          src="/assets/video/hero.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-black/35" />

        {/* TEXT */}
        <div className="relative z-20 flex h-full flex-col items-center justify-center px-4">
          <h1
            ref={mTitle}
            className="font-anybody text-center font-extrabold uppercase leading-[1]
                       text-white text-[32px]"
          >
            <span className="block">THE FUTURE OF</span>
            <span className="block">MEDIA PRODUCTION</span>
            <span className="block">IS ALREADY HERE</span>
          </h1>
        </div>

        <div className="flex justify-center md:justify-end">
  <button
    ref={mButton}
    className="
      rounded-full 
      bg-[#D7F000] 
      px-5 py-2 
      text-[10px] 
      font-semibold 
      uppercase 
      tracking-[0.18em] 
      text-black
    "
  >
    BY MOVIE VP PAVILION
  </button>
</div>


        {/* MOBILE MASKS */}
        <div ref={mWrapper} className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
          <div
            ref={mTopMask}
            className="absolute left-1/2 -translate-x-1/2 top-[-26vh] w-[200vw] h-[50vh] bg-black rounded-b-[30%] blur-[14px]"/>
          <div
            ref={mBottomMask}
            className="absolute left-1/2 -translate-x-1/2 bottom-[-26vh]
                       w-[200vw] h-[50vh] bg-black rounded-t-[30%] blur-[14px]"
          />
        </div>
      </div>
    </section>
  );
}
