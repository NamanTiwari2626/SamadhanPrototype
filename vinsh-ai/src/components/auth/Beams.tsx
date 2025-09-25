"use client";

import type { FC } from "react";

interface BeamsProps {
  beamWidth?: number;
  beamHeight?: number;
  beamNumber?: number;
  lightColor?: string;
  speed?: number;
  noiseIntensity?: number;
  scale?: number;
  rotation?: number;
}

const Beams: FC<BeamsProps> = ({
  beamWidth = 2,
  beamHeight = 15,
  beamNumber = 20,
  lightColor = "#E50914",
  speed = 2,
  noiseIntensity = 1.75,
  scale = 0.2,
  rotation = 233,
}) => {
  return (
    <>
      <style jsx global>{`
        @keyframes beamPulse {
          0%, 100% {
            opacity: 0.3;
            transform: scaleY(0.8) translateY(-10%);
          }
          50% {
            opacity: 0.8;
            transform: scaleY(1.2) translateY(5%);
          }
        }
        
        @keyframes beamPulseReverse {
          0%, 100% {
            opacity: 0.2;
            transform: scaleY(1.1) translateY(5%);
          }
          50% {
            opacity: 0.6;
            transform: scaleY(0.9) translateY(-5%);
          }
        }
      `}</style>

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            transform: `rotate(${rotation}deg)`,
            transformOrigin: "center center",
          }}
        >
          {Array.from({ length: beamNumber }).map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${(i / beamNumber) * 100}%`,
                top: "0%",
                width: `${beamWidth}px`,
                height: "200%",
                background: `linear-gradient(
                  180deg,
                  transparent 0%,
                  ${lightColor}15 20%,
                  ${lightColor}30 50%,
                  ${lightColor}15 80%,
                  transparent 100%
                )`,
                filter: "blur(1px)",
                animation: `beamPulse ${3 + (i % 3)}s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
                opacity: 0.6,
                boxShadow: `
                  0 0 10px ${lightColor}20,
                  0 0 20px ${lightColor}10,
                  0 0 40px ${lightColor}05
                `,
              }}
            />
          ))}

          {Array.from({ length: Math.floor(beamNumber / 2) }).map((_, i) => (
            <div
              key={`secondary-${i}`}
              className="absolute"
              style={{
                left: `${((i * 2 + 1) / beamNumber) * 100}%`,
                top: "0%",
                width: `${beamWidth * 0.5}px`,
                height: "200%",
                background: `linear-gradient(
                  180deg,
                  transparent 0%,
                  ${lightColor}20 30%,
                  ${lightColor}40 50%,
                  ${lightColor}20 70%,
                  transparent 100%
                )`,
                filter: "blur(0.5px)",
                animation: `beamPulseReverse ${4 + (i % 2)}s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`,
                opacity: 0.4,
                boxShadow: `
                  0 0 5px ${lightColor}15,
                  0 0 10px ${lightColor}08
                `,
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Beams;


