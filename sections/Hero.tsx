"use client";

import { useLayoutEffect, useRef, useState, useEffect } from "react";
import gsap from "gsap";
import Loader from "@/components/Loader";
import Link from "next/link";

export default function Hero() {
  const [progress, setProgress] = useState(0);
  const [videoReady, setVideoReady] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const progressRef = useRef(0);

  // =========================
  // VIDEO LOAD DETECTION
  // =========================
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoaded = () => {
      setVideoReady(true);
    };

    video.addEventListener("loadeddata", handleLoaded);

    return () => {
      video.removeEventListener("loadeddata", handleLoaded);
    };
  }, []);

  // =========================
  // PROGRESS SIMULATION
  // =========================
  useEffect(() => {
    let raf: number;

    const animate = () => {
      if (progressRef.current < 90) {
        progressRef.current += 0.8; // стартует сразу
      }

      if (videoReady && progressRef.current < 100) {
        progressRef.current += 2.5; // ускорение к финалу
      }

      if (progressRef.current >= 100) {
        progressRef.current = 100;
        setProgress(100);
        setLoaded(true);
        return;
      }

      setProgress(progressRef.current);
      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(raf);
  }, [videoReady]);

  // StrictMode fix
  useEffect(() => {
    if (!loaded) return;
    const id = requestAnimationFrame(() => setIsReady(true));
    return () => cancelAnimationFrame(id);
  }, [loaded]);

  // =========================
  // DESKTOP ANIMATION (оставляем как было)
  // =========================
  const topMaskRef = useRef<HTMLDivElement | null>(null);
  const bottomMaskRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);

  useLayoutEffect(() => {
    if (!isReady) return;

    const ctx = gsap.context(() => {
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
          { autoAlpha: 1, y: 0, duration: 0.6 },
          "-=0.5"
        );
    });

    return () => ctx.revert();
  }, [isReady]);

  // =========================
  // RENDER
  // =========================
  return (
    <>
      {!loaded && <Loader progress={progress} />}

      <section
        className={`
          relative w-full overflow-hidden bg-black
          transition-opacity duration-700
          ${loaded ? "opacity-100" : "opacity-0"}
        `}
      >
        <div className="relative h-screen w-full overflow-hidden">

          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src="https://pub-6b170c422cda4d44a90de5f670525527.r2.dev/Show_fin.webm" type="video/webm" />
          </video>

          <div className="absolute inset-0 bg-black/40" />

          <div className="relative z-20 flex h-full flex-col items-center justify-center px-4">
            <h1
              ref={titleRef}
              className="font-anybody text-center font-extrabold uppercase leading-[0.9]
                text-white text-[40px] sm:text-[64px] md:text-[88px]"
            >
              THE FUTURE OF MEDIA PRODUCTION IS ALREADY HERE
            </h1>
          </div>

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
      </section>
    </>
  );
}
