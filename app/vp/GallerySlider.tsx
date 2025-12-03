"use client";

import { useEffect, useRef, useState } from "react";

type Slide = {
  src: string;
  alt?: string;
};

export default function GallerySlider({ images }: { images: Slide[] }) {

  // --- создаём длинную шину, чтобы loop был реально бесконечным ---
  const base = images;
  const repeats = 30; // можно 30 если хочешь вообще “вечную дорожку”
  const extended = Array.from({ length: repeats }, () => base).flat();

  const middleIndex = Math.floor((extended.length / 2));
  const [index, setIndex] = useState(middleIndex);

  const trackRef = useRef<HTMLDivElement>(null);

  // --- плавное центрирование активной карточки ---
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const activeEl = track.children[index] as HTMLElement;
    if (!activeEl) return;

    const screenWidth = window.innerWidth;

    const offset =
      activeEl.offsetLeft + activeEl.clientWidth / 2 - screenWidth / 2;

    track.style.transition = "transform 0.9s cubic-bezier(0.16,1,0.3,1)";
    track.style.transform = `translateX(-${offset}px)`;

  }, [index]);

  // --- бесшовный loop (вообще без телепортов) ---
  useEffect(() => {
    const len = extended.length;
    const segment = base.length;

    // Если мы ушли слишком далеко вправо → возвращаем в центр НО без анимации
    if (index > len - segment * 5) {
      requestAnimationFrame(() => {
        if (!trackRef.current) return;
        trackRef.current.style.transition = "none";
        setIndex(middleIndex);
      });
    }

    // Если ушли слишком далеко влево
    if (index < segment * 5) {
      requestAnimationFrame(() => {
        if (!trackRef.current) return;
        trackRef.current.style.transition = "none";
        setIndex(middleIndex);
      });
    }
  }, [index, extended.length, base.length, middleIndex]);

  // кнопки
  const next = () => setIndex((i) => i + 1);
  const prev = () => setIndex((i) => i - 1);

  return (
    <section className="w-full bg-black py-16" id="gallery">
      <div className="mx-auto w-full px-4 md:px-8">

        {/* Заголовок + стрелки */}
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-white font-anybody text-xl tracking-[0.25em] uppercase">
          </h2>

          <div className="flex gap-3">
            <button
              onClick={prev}
              className="h-9 w-9 rounded-full border border-white/40 text-white flex items-center justify-center hover:bg-white hover:text-black transition"
            >
              ‹
            </button>
            <button
              onClick={next}
              className="h-9 w-9 rounded-full border border-white/40 text-white flex items-center justify-center hover:bg-white hover:text-black transition"
            >
              ›
            </button>
          </div>
        </div>

        {/* окно */}
        <div className="relative overflow-hidden w-full h-[520px]">

          {/* трек */}
          <div
            ref={trackRef}
            className="absolute left-0 bottom-0 flex gap-8 will-change-transform"
          >
            {extended.map((img, i) => {
              const isActive = i === index;

              return (
                <div
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`
                    cursor-pointer flex items-center h-[520px]
                    ${isActive ? "z-10" : "opacity-40"}
                  `}
                  style={{
                    width: isActive ? "350px" : "200px",
                    transition: isActive
                      ? "all 1s cubic-bezier(0.16,1,0.3,1)"
                      : "opacity 0.5s ease",
                  }}
                >
                  <img
                    src={img.src}
                    alt={img.alt ?? ""}
                    className="object-cover rounded mx-auto"
                    style={{
                      height: isActive ? "500px" : "320px",
                      transform: isActive ? "scale(1.08)" : "scale(1)",
                      transition: isActive
                        ? "all 1s cubic-bezier(0.16,1,0.3,1)"
                        : "opacity 0.5s ease",
                    }}
                  />
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
