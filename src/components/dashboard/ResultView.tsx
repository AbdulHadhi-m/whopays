"use client";

import React, { useEffect, useRef } from "react";
import { useGameStore } from "@/store/useGameStore";
import { soundManager } from "@/components/shared/SoundManager";

export default function ResultView() {
  const { winner, setWinner, setView } = useGameStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    const colors = ["#FFD016", "#1D2433", "#FF4D4D", "#4D96FF", "#6BCB77"];
    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      x: number;
      y: number;
      size: number;
      color: string;
      vx: number;
      vy: number;
      gravity: number;
      rotation: number;
      rotationSpeed: number;
      opacity: number;

      constructor() {
        this.x = canvas!.width / 2;
        this.y = canvas!.height / 2;
        this.size = Math.random() * 8 + 4;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.vx = (Math.random() - 0.5) * 15;
        this.vy = (Math.random() - 0.5) * 15 - 10;
        this.gravity = 0.3;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 10;
        this.opacity = 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.rotation += this.rotationSpeed;
        this.opacity -= 0.005;
      }

      draw() {
        ctx!.save();
        ctx!.translate(this.x, this.y);
        ctx!.rotate((this.rotation * Math.PI) / 180);
        ctx!.globalAlpha = Math.max(0, this.opacity);
        ctx!.fillStyle = this.color;
        ctx!.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx!.restore();
      }
    }

    const createBurst = () => {
      for (let i = 0; i < 150; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      particles = particles.filter((p) => p.opacity > 0);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", resize);
    resize();

    // Trigger burst on load
    const timeoutId = setTimeout(() => {
      createBurst();
      animate();
    }, 300);

    return () => {
      window.removeEventListener("resize", resize);
      clearTimeout(timeoutId);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleNextRound = () => {
    soundManager.playTick();
    setWinner(null, null);
    setView("spin"); 
  };

  const handleBackHome = () => {
    soundManager.playTick();
    setWinner(null, null);
    setView("home");
  };

  return (
    <div className="flex-1 bg-white dark:bg-[#0a0a1a] text-[#1D2433] dark:text-white font-sans overflow-hidden flex flex-col items-center h-full relative transition-colors duration-300">
      <style dangerouslySetInnerHTML={{__html: `
        .button-shadow {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        
        .confetti-canvas {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 50;
        }

        .halo {
          position: absolute;
          width: 320px;
          height: 320px;
          background: radial-gradient(circle, #FFD016 0%, transparent 70%);
          border-radius: 50%;
          z-index: 0;
        }

        /* Micro-interactions */
        .btn-interaction {
          transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .btn-interaction:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        .btn-interaction:active {
          transform: translateY(1px) scale(0.98);
        }

        @keyframes slide-up-fade {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-halo {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.15); opacity: 0.1; }
        }
        .animate-slide-up-fade {
          animation: slide-up-fade 0.8s ease-out forwards;
        }
        .animate-pulse-halo {
          animation: pulse-halo 3s ease-in-out infinite;
        }
      `}} />

      <canvas ref={canvasRef} className="confetti-canvas" />

      {/* BEGIN: NavigationHeader */}
      <header className="w-full flex items-center justify-between px-6 py-4 z-10" data-purpose="app-top-bar">
        <button onClick={handleBackHome} aria-label="Go back" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
          <svg className="h-6 w-6 text-[#1D2433] dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"></path>
          </svg>
        </button>
        <h1 className="text-xl font-bold">Result</h1>
        <div className="w-10"></div>
      </header>
      {/* END: NavigationHeader */}

      {/* BEGIN: MainContent */}
      <main className="flex-1 w-full max-w-md flex flex-col items-center px-8 pt-4 pb-12 relative z-10">
        {/* BEGIN: CharacterIllustration */}
        <div className="relative w-full aspect-square max-w-[280px] flex items-center justify-center mb-8" data-purpose="character-container">
          <div className="halo animate-pulse-halo dark:opacity-20"></div>
          <img alt="Winning Mascot" className="w-full h-full object-contain relative z-10" src="/logos/whopayLogo.svg" />
        </div>
        {/* END: CharacterIllustration */}

        {/* BEGIN: ResultMessage */}
        <div className="text-center mb-auto opacity-0 animate-slide-up-fade" data-purpose="result-text-area">
          <h2 className="text-4xl font-extrabold mb-3">{winner || "Someone"} Pays!</h2>
          <p className="text-lg font-semibold text-[#1D2433] dark:text-gray-300 flex items-center justify-center gap-1">
            Better luck next time <span className="text-xl">😅</span>
          </p>
        </div>
        {/* END: ResultMessage */}

        {/* BEGIN: ActionButtons */}
        <div className="w-full space-y-4 mt-8 z-10" data-purpose="navigation-buttons">
          <button onClick={handleNextRound} className="w-full bg-[#FFD016] hover:bg-[#e6bb12] dark:hover:bg-[#FFD016]/90 text-[#1D2433] font-bold py-4 rounded-2xl text-lg button-shadow btn-interaction transition-colors" data-purpose="new-round-btn">
            New Round
          </button>
          <button onClick={handleBackHome} className="w-full bg-white dark:bg-transparent dark:hover:bg-white/5 text-[#1D2433] dark:text-white border-2 border-gray-100 dark:border-gray-700 font-bold py-4 rounded-2xl text-lg button-shadow btn-interaction transition-colors" data-purpose="back-home-btn">
            Back to Home
          </button>
        </div>
        {/* END: ActionButtons */}
      </main>
      {/* END: MainContent */}
    </div>
  );
}
