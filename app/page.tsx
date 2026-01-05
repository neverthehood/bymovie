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
    // Loader максимум 700ms — дальше не мешаем LCP
    const t = setTimeout(() => {
      setShowLoader(false);
    }, 700);

    return () => clearTimeout(t);
  }, []);

  return (
    <main className="relative w-full bg-black text-white overflow-x-hidden">
      <Navbar />

      {/* Loader — OVERLAY, не блокирует layout */}
      {showLoader && (
        <div className="fixed inset-0 z-[9999] pointer-events-none">
          <Loader />
        </div>
      )}

      {/* Hero = LCP */}
      <Hero />

      <WeAre />
      <ServicesSection />
      <HowWeWork />
      <ProjectsSection />
      <Footer />
    </main>
  );
}
