import Navbar from "./Navbar";
import HeroVP from "./HeroVP";
import LedWallSection from "./LedWallSection";
import Gallery from "./Gallery";
import Footer from "@/sections/Footer";

export default function VPPage() {
  return (
    <main className="w-full bg-black text-white">
    <Navbar />
      <HeroVP />
      <LedWallSection />
      <Gallery />
      <Footer />
    </main>
  );
}
