"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/sections/Hero";
import Loader from "@/components/Loader";
import WeAre from "@/sections/WeAre";
import ServicesSection from "@/sections/ServicesSection";
import HowWeWork from "@/sections/HowWeWork";
import ProjectsSection from "@/sections/ProjectsSection";
import Footer from "@/sections/Footer";

export default function Page() {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    // Loader живёт максимум 1.8s и ВСЁ
    const t = setTimeout(() => {
      setShowLoader(false);
    }, 1800);

    return () => clearTimeout(t);
  }, []);

  return (
    <main className="relative w-full bg-black text-white">
      <Navbar />

      {showLoader && <Loader />}

      <Hero />

      <WeAre />
      <ServicesSection />
      <HowWeWork />
      <ProjectsSection />
      <Footer />
    </main>
  );
}
