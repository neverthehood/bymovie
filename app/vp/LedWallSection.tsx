import Image from "next/image";

export default function LedWallSection() {
  return (
    <section className="w-full py-20 px-0 md:px-20 bg-black text-white">
      <div className="mx-auto">

        {/* IMAGE */}
        <div className="w-full md:max-w-[1600px] md:mx-auto">
          <Image
            src="https://pub-6b170c422cda4d44a90de5f670525527.r2.dev/BMVP_Screen-_2_.webp"
            alt="LED Wall"
            width={1600}
            height={900}
            className="w-full h-auto md:rounded-lg"
            priority
            unoptimized
          />
        </div>

        {/* TEXT */}
        <div className="max-w-[1200px] mx-auto px-6 md:px-0">
          <p className="mt-10 text-lg leading-relaxed text-white/80">
            VP using LED-wall is a trending technological approach to solving artistic tasks
            in the preparation and production of video content. The essence of the
            technology is the combination of a virtual 3D scene and real objects in the frame.
          </p>

          <p className="mt-6 text-lg leading-relaxed text-white/80">
            Tracking of a physical camera in a virtual environment creates a parallax
            effect. Thus, viewers get a feeling of presence in the location, rather
            than an “image on the background of something”. The whole system runs on
            the Unreal Engine game engine.
          </p>
        </div>

      </div>
    </section>
  );
}
