import Navbar from "@/components/Navbar";
import Hero from "@/sections/Hero";
import WeAre from "@/sections/WeAre"; // ← ТВОЯ СЕКЦИЯ

export default function Home() {
  return (
    <main className="relative w-full bg-black text-white">
      {/* Навигация */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* We Are Section (с фиксацией скролла и закрашиванием слов) */}
      <WeAre />

      {/* 
        ↓↓↓ сюда пойдут следующие секции сайта:
        <Services />
        <Projects />
        <Contacts />
      */}
    </main>
  );
}
