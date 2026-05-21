"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { useGameStore } from "@/store/useGameStore";
import { soundManager } from "@/components/shared/SoundManager";

// Load react-custom-roulette dynamically on the client side only
// to prevent SSR/hydration mismatch error from canvas rendering
const Wheel = dynamic(
  () => import("react-custom-roulette").then((mod) => mod.Wheel),
  { ssr: false }
);

export default function SpinWheel() {
  const {
    participants,
    isSpinning,
    winnerIndex,
    setSpinning,
    setWinner,
  } = useGameStore();

  const [mounted, setMounted] = useState(false);
  const [wheelIndex, setWheelIndex] = useState(0);
  const [mustSpin, setMustSpin] = useState(false);
  
  // Track ticks during spinning
  const tickIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Simulates the decelerating woodblock mechanical clicks of a real casino wheel
  const startMechanicalTicks = () => {
    if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);

    let delay = 60; // Initial fast ticking speed (ms)
    let elapsed = 0;
    const totalSpinTime = 11000; // react-custom-roulette default is around 10-11 seconds

    const tick = () => {
      soundManager.playTick();
      elapsed += delay;

      // Gradually increase delay to slow down the ticks as the wheel decelerates
      if (elapsed < totalSpinTime * 0.5) {
        delay = 80;
      } else if (elapsed < totalSpinTime * 0.75) {
        delay = 180;
      } else if (elapsed < totalSpinTime * 0.9) {
        delay = 350;
      } else {
        delay = 600;
      }

      if (elapsed < totalSpinTime - 800) {
        tickIntervalRef.current = setTimeout(tick, delay);
      }
    };

    tickIntervalRef.current = setTimeout(tick, delay);
  };

  useEffect(() => {
    const handle = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(handle);
  }, []);

  // When a spin is triggered and we receive a target winnerIndex
  useEffect(() => {
    if (winnerIndex !== null && isSpinning && !mustSpin) {
      const handle = setTimeout(() => {
        setWheelIndex(winnerIndex);
        setMustSpin(true);
        startMechanicalTicks();
      }, 0);
      return () => clearTimeout(handle);
    }
  }, [winnerIndex, isSpinning, mustSpin]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
    };
  }, []);

  const handleStopSpinning = () => {
    setMustSpin(false);
    setSpinning(false);
    
    if (tickIntervalRef.current) {
      clearInterval(tickIntervalRef.current);
    }

    // Play reveal sound
    soundManager.playReveal();

    if (wheelIndex !== null && participants[wheelIndex]) {
      setWinner(participants[wheelIndex], wheelIndex);
    }
  };

  if (!mounted) {
    return (
      <div className="w-[300px] h-[300px] md:w-[420px] md:h-[420px] rounded-full border border-dashed border-neon-purple/20 flex items-center justify-center animate-pulse">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-neon-pink border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-neon-purple/80 font-mono tracking-widest uppercase">Booting Wheel...</p>
        </div>
      </div>
    );
  }

  // Map participants array into structure react-custom-roulette expects
  const data = participants.map((name, i) => {
    // Generate beautiful neon sectors with high contrast
    const colors = ["#ff007a", "#9d00ff", "#00f0ff", "#13092b", "#39ff14", "#2c1a5e"];
    const bg = colors[i % colors.length];
    
    // Choose high contrast text color (black for cyan/green, white for pink/purple)
    const text = (bg === "#00f0ff" || bg === "#39ff14") ? "#07050f" : "#ffffff";

    return {
      option: name.length > 10 ? name.slice(0, 10) + "..." : name,
      style: {
        backgroundColor: bg,
        textColor: text,
      },
    };
  });

  return (
    <div className="relative flex flex-col items-center select-none">
      {/* Decorative Outer Neon Ring Glow */}
      <div className="absolute inset-0 rounded-full bg-neon-purple/5 blur-2xl border border-neon-purple/10 pointer-events-none scale-105" />

      {/* Outer Casino Glow Ring Border */}
      <div className="relative p-3 rounded-full bg-[#0b081a] border border-white/5 shadow-[0_0_50px_rgba(157,0,255,0.15)] flex items-center justify-center">
        {participants.length < 2 ? (
          <div className="w-[300px] h-[300px] md:w-[420px] md:h-[420px] rounded-full bg-[#110e26] border border-white/10 flex items-center justify-center text-center p-6">
            <p className="text-neon-pink text-sm font-mono leading-relaxed">
              ⚠️ ADD AT LEAST 2 FRIENDS TO SPIN THE WHEEL!
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* The Pointer (Arrow) placed on top of the wheel */}
            <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 z-30 pointer-events-none filter drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="transform rotate-180"
              >
                <path
                  d="M12 2L22 17H2L12 2Z"
                  fill="#00f0ff"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <Wheel
              mustStartSpinning={mustSpin}
              prizeNumber={wheelIndex}
              data={data}
              onStopSpinning={handleStopSpinning}
              outerBorderColor="#ffffff"
              outerBorderWidth={2}
              innerRadius={15}
              innerBorderColor="#00f0ff"
              innerBorderWidth={3}
              radiusLineColor="#07050f"
              radiusLineWidth={1}
            />
          </div>
        )}
      </div>

      {/* Decorative Glow Dot Bottom shadow */}
      <div className="w-4/5 h-[8px] mt-6 bg-neon-pink/10 rounded-full blur-md animate-pulse-glow" />
    </div>
  );
}
