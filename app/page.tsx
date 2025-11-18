import Navbar from "@/components/Navbar";
import Hero from "@/sections/Hero";
import WeAre from "@/sections/WeAre";
import ServicesSection from "@/sections/ServicesSection";
import HowWeWork from "@/sections/HowWeWork";
import ProjectsSection from "@/sections/ProjectsSection";
import Footer from "@/sections/Footer";
import ScrollController from "@/components/ScrollController";

export default function Page() {
  return (
    <main className="relative w-full bg-black text-white">
      <Navbar />

      <ScrollController>
        <>
          <section data-scroll>
            <Hero />
          </section>

          <section data-scroll>
            <WeAre />
          </section>

          <section data-scroll>
            <ServicesSection />
          </section>

          <section data-scroll>
            <HowWeWork />
          </section>

          <section data-scroll>
            <ProjectsSection />
          </section>

          <section data-scroll>
            <Footer />
          </section>
        </>
      </ScrollController>
    </main>
  );
}
