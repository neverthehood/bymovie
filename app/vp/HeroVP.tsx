"use client";

export default function HeroVP() {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/assets/video/vp-hero.webm" type="video/webm" />
        <source src="/assets/video/vp-hero.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Title */}
      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="
          text-white text-center font-bold
          text-5xl md:text-7xl leading-[1.1] tracking-tight
        ">
          VIRTUAL<br/>
          PRODUCTION<br/>
          LED WALL
        </h1>
      </div>
    </section>
  );
}
