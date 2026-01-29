"use client";

import { useLayoutEffect, useRef, useState, useEffect } from "react";
import gsap from "gsap";
import Loader from "@/components/Loader";
import Link from "next/link";

export default function Hero() {
  const [videoReady, setVideoReady] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // когда видео готово → завершаем loader
  useEffect(() => {
    if (!videoReady) return;

    const timeout = setTimeout(() => {
      setLoaded(true);
    }, 400); // лёгкая пауза чтобы красиво завершился loader

    return () => clearTimeout(timeout);
  }, [videoReady]);

  // StrictMode safe
  useEffect(() => {
    if (!loaded) return;
    const id = requestAnimationFrame(() => setIsReady(true));
    return () => cancelAnimationFrame(id);
  }, [loaded]);

  // ============================
  // REFS (не меняем)
  // ============================

  const topMaskRef = useRef<HTMLDivElement | null>(null);
  const bottomMaskRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const mTopMask = useRef<HTMLDivElement | null>(null);
  const mBottomMask = useRef<HTMLDivElement | null>(null);
  const mTitle = useRef<HTMLHeadingElement | null>(null);
  const mButton = useRef<HTMLButtonElement | null>(null);

  // ============================
  // DESKTOP ANIMATION
  // ============================

  useLayoutEffect(() => {
    if (!isReady) return;

    const ctx = gsap.context(() => {
      if (!topMaskRef.current || !bottomMaskRef.current) return;

      gsap.set(topMaskRef.current, { yPercent: 30 });
      gsap.set(bottomMaskRef.current, { yPercent: -30 });

      const tl = gsap.timeline();

      tl.to(topMaskRef.current, {
        yPercent: -50,
        duration: 1.5,
        ease: "power3.inOut",
      }, 0)
        .to(bottomMaskRef.current, {
          yPercent: 50,
          duration: 1.5,
          ease: "power3.inOut",
        }, 0)
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
  }, [isReady]);

  // ============================
  // MOBILE ANIMATION
  // ============================

  useLayoutEffect(() => {
    if (!isReady) return;

    const ctx = gsap.context(() => {
      if (!mTopMask.current || !mBottomMask.current) return;

      gsap.set(mTopMask.current, { yPercent: 25 });
      gsap.set(mBottomMask.current, { yPercent: -25 });

      const tl = gsap.timeline();

      tl.to(mTopMask.current, {
        yPercent: -30,
        duration: 1.2,
        ease: "power3.inOut",
      }, 0)
        .to(mBottomMask.current, {
          yPercent: 30,
          duration: 1.2,
          ease: "power3.inOut",
        }, 0)
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
  }, [isReady]);

  // ============================
  // RENDER
  // ============================

  return (
    <>
      {!loaded && <Loader />}

      <section
        className={`relative w-full overflow-hidden bg-black transition-opacity duration-700 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* DESKTOP */}
        <div className="hidden md:block relative h-screen w-full overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            onLoadedData={() => setVideoReady(true)}
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source
              src="https://pub-6b170c422cda4d44a90de5f670525527.r2.dev/Show_fin.webm"
              type="video/webm"
            />
          </video>

          <div className="absolute inset-0 bg-black/40" />

          <div className="relative z-20 flex h-full flex-col items-center justify-center px-4">
            <h1
              ref={titleRef}
              className="font-anybody text-center font-extrabold uppercase leading-[0.9]
                text-white text-[40px] sm:text-[64px] md:text-[88px] lg:text-[110px]
                xl:text-[130px] max-w-[1600px] mx-auto"
            >
              <span className="block">THE FUTURE OF</span>
              <span className="block">MEDIA PRODUCTION</span>
              <span className="block">IS ALREADY HERE</span>
            </h1>
          </div>
        </div>

        {/* MOBILE */}
        <div className="block md:hidden relative h-screen w-full overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            onLoadedData={() => setVideoReady(true)}
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source
              src="https://pub-6b170c422cda4d44a90de5f670525527.r2.dev/Show_fin_mobile.webm"
              type="video/webm"
            />
          </video>
        </div>
      </section>
    </>
  );
}
