"use client";

import { useState } from "react";
import Loader from "@/components/Loader";
import Navbar from "@/components/Navbar";
import Hero from "@/sections/Hero";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <main className="relative w-full bg-black text-white">
      <Navbar />
      {!isLoaded && <Loader onFinished={() => setIsLoaded(true)} />}
      {isLoaded && <Hero />}
    </main>
  );
}
