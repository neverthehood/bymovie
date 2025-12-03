import Navbar from "./Navbar";
import HeroVP from "./HeroVP";
import LedWallSection from "./LedWallSection";
import GallerySlider from "./GallerySlider";
import Footer from "@/sections/Footer";

const portfolioImages = Array.from({ length: 15 }).map((_, i) => ({
  src: `/assets/gallery/team-${i + 1}.webp`,
  alt: `portfolio ${i + 1}`,
}));

export default function VPPage() {
  return (
    <main className="w-full bg-black text-white">
      <Navbar />
      <HeroVP />
      <LedWallSection />

      <GallerySlider images={portfolioImages} />

      <Footer />
    </main>
  );
}