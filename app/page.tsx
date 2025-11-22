import Navbar from "@/components/Navbar";
import Hero from "@/sections/Hero";
import WeAre from "@/sections/WeAre";
import ServicesSection from "@/sections/ServicesSection";
import HowWeWork from "@/sections/HowWeWork";
import ProjectsSection from "@/sections/ProjectsSection";
import Footer from "@/sections/Footer";
import ScrollController from "@/components/ScrollController";
import ScrollFlow from "@/components/ScrollFlow";


export default function Page() {
  return (
    <main className="relative w-full bg-black text-white">
      <Navbar />

      <Hero />
      <WeAre />
      <ServicesSection />
      <HowWeWork />
      <ProjectsSection />
      <Footer />
    </main>
  );
}

