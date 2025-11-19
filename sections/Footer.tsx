import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-black text-white pt-28 pb-0 px-6 lg:px-20">
      
      {/* MAIN GRID */}
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">

        {/* LEFT SIDE */}
        <div>
          <h2 className="text-5xl lg:text-7xl font-bold mb-10 leading-tight">
            LET’S SHOOT!
          </h2>

          <p className="text-lg mb-4">
            Contact us in any convenient way.
          </p>

          <p className="text-lg mb-10 leading-snug">
            We are always in touch and really<br />
            excited about any creative challenges
          </p>

          {/* SOCIAL ICONS — single row on mobile */}
          <div className="flex gap-10 text-xl flex-wrap">
            <a href="#" className="hover:text-[#D7F000] transition">Instagram</a>
            <a href="#" className="hover:text-[#D7F000] transition">Telegram</a>
            <a href="#" className="hover:text-[#D7F000] transition">WhatsApp</a>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="text-xl">

          {/* EMAIL */}
          <div className="mb-12">
            <div className="text-white/60 mb-2 text-base">Email</div>
            <a 
              href="mailto:studio@bymovie.by" 
              className="text-4xl block leading-tight break-all"
            >
              studio@bymovie.by
            </a>
          </div>

          {/* PHONES */}
          <div className="mb-12">
            <div className="text-white/60 mb-2 text-base">For calls</div>
            <div className="text-4xl leading-snug">
              +375 (29) 348 06 82<br />
              +375 (29) 343 38 61
            </div>

            {/* small icons row */}
            <div className="flex gap-4 text-3xl mt-4 text-white/40">
              <span>📨</span>
              <span>📞</span>
              <span>💬</span>
            </div>
          </div>

          {/* LOCATIONS */}
          <div className="mb-10">
            <div className="text-white/60 mb-2 text-base">Locations</div>
            <div className="text-4xl leading-snug">
              Minsk<br />
              Warsaw
            </div>
          </div>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="mt-16 pt-10 border-t border-white/10 max-w-[1600px] mx-auto flex flex-col lg:flex-row justify-between text-white/50 text-sm gap-4">
        <span>Copyright © 2025</span>

        <div className="flex gap-6">
          <a href="#" className="hover:text-white">Terms & Conditions</a>
          <a href="#" className="hover:text-white">Privacy Policy</a>
        </div>
      </div>

      {/* YELLOW BACKGROUND LOGO */}
      <div className="w-full mt-6">
        <Image
          src="/assets/footer/BY MOVIE.png"
          alt="BY MOVIE"
          width={3000}
          height={1000}
          className="w-full h-auto object-cover select-none pointer-events-none"
          priority
        />
      </div>
    </footer>
  );
}
