"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { useGameStore } from "@/store/useGameStore";
import { soundManager } from "@/components/shared/SoundManager";

// Load react-custom-roulette dynamically on the client side only
const Wheel = dynamic(
  () => import("react-custom-roulette").then((mod) => mod.Wheel),
  { ssr: false }
);

// WhoPay bright color palette for wheel segments
const SEGMENT_COLORS = [
  { bg: "#ff4081", text: "#ffffff" }, // pink
  { bg: "#2979ff", text: "#ffffff" }, // blue
  { bg: "#00c853", text: "#ffffff" }, // green
  { bg: "#ffd600", text: "#1a0a4d" }, // yellow
  { bg: "#ff6d00", text: "#ffffff" }, // orange
  { bg: "#6c3bff", text: "#ffffff" }, // purple
  { bg: "#00bcd4", text: "#ffffff" }, // teal
  { bg: "#f44336", text: "#ffffff" }, // red
];

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
  const tickIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startMechanicalTicks = () => {
    if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
    let delay = 60;
    let elapsed = 0;
    const totalSpinTime = 11000;
    const tick = () => {
      soundManager.playTick();
      elapsed += delay;
      if (elapsed < totalSpinTime * 0.5) delay = 80;
      else if (elapsed < totalSpinTime * 0.75) delay = 180;
      else if (elapsed < totalSpinTime * 0.9) delay = 350;
      else delay = 600;
      if (elapsed < totalSpinTime - 800)
        tickIntervalRef.current = setTimeout(tick, delay);
    };
    tickIntervalRef.current = setTimeout(tick, delay);
  };

  useEffect(() => {
    const handle = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(handle);
  }, []);

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

  useEffect(() => {
    return () => {
      if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
    };
  }, []);

  const handleStopSpinning = () => {
    setMustSpin(false);
    setSpinning(false);
    if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
    soundManager.playReveal();
    if (wheelIndex !== null && participants[wheelIndex]) {
      setWinner(participants[wheelIndex], wheelIndex, "spin");
    }
  };

  if (!mounted) {
    return (
      <div
        className="w-[280px] h-[280px] md:w-[360px] md:h-[360px] rounded-full flex items-center justify-center"
        style={{ border: "4px dashed #c5bae8", background: "#f8f5ff" }}
      >
        <div className="text-center">
          <div
            className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-3"
            style={{ borderColor: "#6c3bff", borderTopColor: "transparent" }}
          />
          <p className="text-sm font-bold" style={{ color: "#7b6db5" }}>
            Loading Wheel…
          </p>
        </div>
      </div>
    );
  }

  const data = participants.map((name, i) => {
    const col = SEGMENT_COLORS[i % SEGMENT_COLORS.length];
    return {
      option: name.length > 10 ? name.slice(0, 9) + "…" : name,
      style: { backgroundColor: col.bg, textColor: col.text },
    };
  });

  return (
    <div className="relative flex flex-col items-center select-none">
      {/* Outer glow ring */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(108,59,255,0.12) 0%, transparent 70%)",
          transform: "scale(1.15)",
        }}
      />

      {/* White card wrapper */}
      <div
        className="relative rounded-full p-3 flex items-center justify-center"
        style={{
          background: "#ffffff",
          boxShadow: "0 8px 40px rgba(108,59,255,0.2), 0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        {participants.length < 2 ? (
          <div
            className="w-[280px] h-[280px] md:w-[360px] md:h-[360px] rounded-full flex items-center justify-center text-center p-8"
            style={{ background: "#f8f5ff" }}
          >
            <div>
              <div className="text-5xl mb-3">👥</div>
              <p className="font-bold text-sm" style={{ color: "#6c3bff" }}>
                Add at least 2 friends to spin the wheel!
              </p>
            </div>
          </div>
        ) : (
          <div className="relative">
            {/* Pointer arrow */}
            <div
              className="absolute top-[-6px] left-1/2 z-30 pointer-events-none"
              style={{ transform: "translateX(-50%)" }}
            >
              <div
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: "14px solid transparent",
                  borderRight: "14px solid transparent",
                  borderTop: "22px solid #ffd600",
                  filter: "drop-shadow(0 2px 6px rgba(255,214,0,0.7))",
                }}
              />
            </div>

            <Wheel
              mustStartSpinning={mustSpin}
              prizeNumber={wheelIndex}
              data={data}
              onStopSpinning={handleStopSpinning}
              outerBorderColor="#ffffff"
              outerBorderWidth={4}
              innerRadius={18}
              innerBorderColor="#ffffff"
              innerBorderWidth={4}
              radiusLineColor="rgba(255,255,255,0.6)"
              radiusLineWidth={2}
              fontSize={13}
            />
          </div>
        )}
      </div>

      {/* Drop shadow pill */}
      <div
        className="mt-4 rounded-full"
        style={{
          width: "60%",
          height: "8px",
          background: "rgba(108,59,255,0.15)",
          filter: "blur(6px)",
        }}
      />
    </div>
  );
}
