"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/sections/Hero";
import Loader from "@/components/Loader";
import WeAre from "@/sections/WeAre";
import ServicesSection from "@/sections/ServicesSection";
import HowWeWork from "@/sections/HowWeWork";
import ProjectsSection from "@/sections/ProjectsSection";
import Footer from "@/sections/Footer";

export default function Page() {
  const [heroReady, setHeroReady] = useState(false);

  return (
    <main className="relative w-full bg-black text-white">
      <Navbar />

      {!heroReady && <Loader />}

      <Hero onReady={() => setHeroReady(true)} />

      <WeAre />
      <ServicesSection />
      <HowWeWork />
      <ProjectsSection />
      <Footer />
    </main>
  );
}
