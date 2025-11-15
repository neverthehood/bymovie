import Navbar from "@/components/Navbar";
import Hero from "@/sections/Hero";
import WeAre from "@/sections/WeAre"; 
import ServicesSection from "@/app/components/ServicesSection";


export default function Home() {
  return (
    <main className="relative w-full bg-black text-white">
      {/* Навигация */}
      <Navbar />
      {/* Hero Section */}
      <Hero />
      {/* We Are Section (с фиксацией скролла и закрашиванием слов) */}
      <WeAre />
      {/* Services */}
      <ServicesSection />
      {/* 
        ↓↓↓ сюда пойдут следующие секции сайта:
        <Projects />
        <Contacts />
      */}
    </main>
  );
}
