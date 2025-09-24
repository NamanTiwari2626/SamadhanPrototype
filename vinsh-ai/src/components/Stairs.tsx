import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Stairs({ children, triggerKey }: React.PropsWithChildren<{ triggerKey?: string | number }>) {
  const stairParentRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const vampireFontUrl = new URL('../assets/Vampire Wars.ttf', import.meta.url).toString();

  useEffect(() => {
    const parentEl = stairParentRef.current;
    if (!parentEl) return;

    const stairs = parentEl.querySelectorAll(".stair");

    // Set initial state for smooth GPU transforms
    gsap.set(stairs, {
      yPercent: -100,
      willChange: "transform",
      force3D: true,
    });

    const tl = gsap.timeline();

    tl.set(parentEl, { display: "block" });

    // Slide stairs into view
    tl.to(stairs, {
      yPercent: 0,
      duration: 1.4,
      ease: "power4.out",
      stagger: { each: 0.08, from: "end" },
    });

    // Slide stairs down to reveal page
    tl.to(stairs, {
      yPercent: 100,
      duration: 1.6,
      ease: "power4.inOut",
      stagger: { each: 0.12, from: "end" },
    }, "+=0.15");

    // Hide overlay and reset for next run
    tl.set(parentEl, { display: "none" });
    tl.set(stairs, { yPercent: -100, clearProps: "willChange,force3D" });

    if (pageRef.current) {
      gsap.from(pageRef.current, {
        opacity: 0,
        delay: 1.1,
        duration: 0.8,
        scale: 1.01,
        ease: "power2.out",
      });
    }

    return () => {
      tl.kill();
    };
  }, [triggerKey]);

  const letters = ["V", "I", "N", "S", "H"];

  return (
    <div>
      <style>{`
        @font-face {
          font-family: 'Vampire Wars';
          src: url('${vampireFontUrl}') format('truetype');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
      `}</style>
      <div ref={stairParentRef} className="fixed inset-0 z-[9999]" style={{ display: 'none' }}>
        <div className="h-full w-full flex">
          {letters.map((letter, idx) => (
            <div
              key={idx}
              className="stair h-full flex-1 bg-black flex items-center justify-center"
              style={{
                backgroundColor: '#000',
                borderRight: idx !== letters.length - 1 ? '2px solid white' : undefined,
              }}
            >
              <span
                className="text-white select-none"
                style={{
                  fontFamily: 'Vampire Wars, Dune_Rise, Bethaine, Arial, sans-serif',
                  fontSize: '10vw',
                  letterSpacing: '0.05em',
                }}
              >
                {letter}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div ref={pageRef}>{children}</div>
    </div>
  );
}

