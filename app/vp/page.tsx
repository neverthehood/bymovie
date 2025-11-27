import Navbar from "./Navbar";
import HeroVP from "./HeroVP";
import LedWallSection from "./LedWallSection";
import GallerySlider from "./GallerySlider";
import Footer from "@/sections/Footer";

const teamImages = Array.from({ length: 15 }).map((_, i) => ({
  src: `/assets/gallery/team-${i + 1}.jpg`,
  alt: `Team member ${i + 1}`,
}));

export default function VPPage() {
  return (
    <main className="w-full bg-black text-white">
      <Navbar />
      <HeroVP />
      <LedWallSection />

      <GallerySlider images={teamImages} />

      <Footer />
    </main>
  );
}