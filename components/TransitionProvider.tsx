"use client";

import { createContext, useContext, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";

interface TransitionContextType {
  startTransition: (url: string) => void;
}

const TransitionContext = createContext<TransitionContextType>({
  startTransition: () => {},
});

export const useTransition = () => useContext(TransitionContext);

export default function TransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const startTransition = async (url: string) => {
    if (!overlayRef.current) return;

    // Fade to black
    await gsap.to(overlayRef.current, {
      opacity: 1,
      duration: 0.35,
      ease: "power2.out",
    });

    router.push(url);

    // Fade in new page
    setTimeout(() => {
      gsap.to(overlayRef.current!, {
        opacity: 0,
        duration: 0.4,
        ease: "power2.inOut",
      });
    }, 100);
  };

  return (
    <TransitionContext.Provider value={{ startTransition }}>
      {children}

      {/* BLACK OVERLAY */}
      <div
        ref={overlayRef}
        className="pointer-events-none fixed inset-0 z-[9999] bg-black opacity-0"
      />
    </TransitionContext.Provider>
  );
}
