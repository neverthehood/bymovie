"use client";

import { useState } from "react";
import Loader from "@/components/Loader";
import Navbar from "@/components/Navbar";
import Hero from "@/sections/Hero";
import WeAre from "@/sections/WeAre";   // ← ВАЖНО

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <main className="relative w-full bg-black text-white">
      {!isLoaded && <Loader onFinished={() => setIsLoaded(true)} />}

      {isLoaded && (
        <>
          <Navbar />
          <Hero />

          {/* ОБЯЗАТЕЛЬНЫЙ промежуточный зазор */}
          <div className="h-[20vh]" />

          <WeAre />  {/* ← ЭТОТ БЛОК ОБЯЗАТЕЛЕН */}

          {/* Для теста можно добавить ещё что-то... */}
          <div className="h-[200vh]" />
        </>
      )}
    </main>
  );
}
