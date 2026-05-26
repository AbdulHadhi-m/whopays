"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useGameStore } from "@/store/useGameStore";

const COLORS = ["#7c3aed", "#ec4899", "#06b6d4", "#facc15"];

function genParticles() {
  return Array.from({ length: 20 }, (_, i) => ({
    w: Math.random() * 6 + 2,
    h: Math.random() * 6 + 2,
    l: Math.random() * 100,
    t: Math.random() * 100,
    c: COLORS[i % 4],
    o: 0.3 + Math.random() * 0.3,
    dur: 6 + Math.random() * 8,
    delay: Math.random() * 5,
  }));
}

function FloatingParticles() {
  const particles = useMemo(() => genParticles(), []);
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${p.w}px`,
            height: `${p.h}px`,
            left: `${p.l}%`,
            top: `${p.t}%`,
            background: p.c,
            opacity: p.o,
            animation: `particle-float ${p.dur}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
            boxShadow: `0 0 6px ${p.c}`,
          }}
        />
      ))}
    </div>
  );
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setTheme } = useGameStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    setTheme(savedTheme || "light");
    requestAnimationFrame(() => setMounted(true));
  }, [setTheme]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f0ff] dark:bg-[#0a0a1a]">
        <div className="w-12 h-12 border-4 border-[#7c3aed] border-t-transparent rounded-full animate-spin shadow-lg shadow-[#7c3aed]/20" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-payspin-bg dark:bg-payspin-dark-bg text-[var(--foreground)] transition-colors duration-300 relative">
      <FloatingParticles />

      {/* ── Main Content Area ── */}
      <main className="flex-1 flex flex-col relative min-w-0 h-screen overflow-hidden z-10">
        <div className="hidden lg:block absolute top-[5%] right-[10%] w-96 h-96 rounded-full pointer-events-none opacity-10 dark:opacity-5 bg-[#7c3aed] blur-[100px]" />
        <div className="hidden lg:block absolute bottom-[5%] left-[5%] w-80 h-80 rounded-full pointer-events-none opacity-10 dark:opacity-5 bg-[#ec4899] blur-[90px]" />

        <div className="flex-1 flex flex-col relative text-[var(--foreground)] transition-colors duration-300 z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
