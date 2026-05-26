"use client";

import { useState, useEffect, useRef } from "react";
import { useGameStore } from "@/store/useGameStore";
import { soundManager } from "@/components/shared/SoundManager";

// Dot positions for each face (1-6) on a 3x3 grid (0-indexed)
const DOT_PATTERNS: number[][] = [
  [4],                     // 1 – center
  [0, 8],                  // 2 – top-right, bottom-left
  [0, 4, 8],               // 3
  [0, 2, 6, 8],            // 4
  [0, 2, 4, 6, 8],         // 5
  [0, 2, 3, 5, 6, 8],      // 6
];

// Helper to render dots on a face
function renderFaceDots(val: number) {
  const dots = DOT_PATTERNS[val - 1] ?? [];
  return Array.from({ length: 9 }).map((_, i) => (
    <div key={i} className="flex items-center justify-center">
      {dots.includes(i) && (
        <div className="dice-cube-dot" />
      )}
    </div>
  ));
}

// 3D Die Face Component
interface Die3DProps {
  value: number;
  rolling: boolean;
  rotation: { x: number; y: number };
}

function Die3D({ value, rolling, rotation }: Die3DProps) {
  return (
    <div className="dice-scene select-none">
      <div
        className={`dice-cube ${rolling ? "rolling" : ""}`}
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        }}
      >
        <div className="dice-cube-face dice-face-1">{renderFaceDots(1)}</div>
        <div className="dice-cube-face dice-face-2">{renderFaceDots(2)}</div>
        <div className="dice-cube-face dice-face-3">{renderFaceDots(3)}</div>
        <div className="dice-cube-face dice-face-4">{renderFaceDots(4)}</div>
        <div className="dice-cube-face dice-face-5">{renderFaceDots(5)}</div>
        <div className="dice-cube-face dice-face-6">{renderFaceDots(6)}</div>
      </div>
    </div>
  );
}

// Map dice value to its front-facing 3D rotation angles
const getFaceRotation = (val: number, spinCount: number) => {
  const extraSpins = spinCount * 1440; // multiple full spins
  switch (val) {
    case 1: return { x: extraSpins + 0, y: extraSpins + 0 };
    case 6: return { x: extraSpins + 0, y: extraSpins + 180 };
    case 2: return { x: extraSpins - 90, y: extraSpins + 0 };
    case 5: return { x: extraSpins + 90, y: extraSpins + 0 };
    case 3: return { x: extraSpins + 0, y: extraSpins + 90 };
    case 4: return { x: extraSpins + 0, y: extraSpins - 90 };
    default: return { x: 0, y: 0 };
  }
};

export default function Dice() {
  const {
    participants,
    isSpinning,
    setSpinning,
    setWinner,
    triggerDiceRoll,
    diceMode,
    setDiceMode,
    setView
  } = useGameStore();

  const [rolling, setRolling] = useState(false);
  const [face1, setFace1] = useState(1);
  const [face2, setFace2] = useState(6);
  const [spinCount, setSpinCount] = useState(1);

  // Rotations states
  const [rot1, setRot1] = useState({ x: 0, y: 0 });
  const [rot2, setRot2] = useState({ x: 0, y: 180 });

  const [resultText, setResultText] = useState<string | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const tickRef = useRef<number | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, []);

  const rollDice = async () => {
    if (rolling || isSpinning || participants.length < 2) return;

    setRolling(true);
    setResultText(null);

    // Incremet spins count
    const nextSpin = spinCount + 1;
    setSpinCount(nextSpin);

    // Initial random wild spins
    setRot1({
      x: nextSpin * 1440 + Math.floor(Math.random() * 270),
      y: nextSpin * 1440 + Math.floor(Math.random() * 270),
    });
    setRot2({
      x: nextSpin * 1440 + Math.floor(Math.random() * 270),
      y: nextSpin * 1440 + Math.floor(Math.random() * 270),
    });

    // Call store trigger
    const result = await triggerDiceRoll();
    if (!result) {
      setRolling(false);
      return;
    }

    const { selectedIndex, winner, dice1, dice2 } = result;

    const rollDuration = 1800;

    // Play tick sounds rapidly
    let tickCount = 0;
    tickRef.current = window.setInterval(() => {
      soundManager.playTick();
      tickCount++;
      if (tickCount >= 14 && tickRef.current) {
        clearInterval(tickRef.current);
      }
    }, 100);

    // Settle on final target rotations midway through
    setTimeout(() => {
      setRot1(getFaceRotation(dice1, nextSpin));
      setRot2(getFaceRotation(dice2, nextSpin));
      setFace1(dice1);
      setFace2(dice2);
    }, 1100);

    // Roll complete
    setTimeout(() => {
      if (tickRef.current) clearInterval(tickRef.current);

      soundManager.playReveal();
      setResultText(`🎲 Total: ${dice1 + dice2} → Winner decided!`);

      setTimeout(() => {
        setWinner(winner, selectedIndex);
        setSpinning(false);
        setRolling(false);
      }, 500);
    }, rollDuration + 60);
  };

  const disabled = rolling || isSpinning || participants.length < 2;

  // Dice Modes descriptions
  const modeDesc = {
    classic: "Classic: Sum of both dice decides who pays the bill.",
    double: "Double: Two unlucky players get picked to split the bill.",
    lucky: "Lucky Escape: One player escapes, remaining players spin.",
    chaos: "Chaos: Sum of dice triggers unexpected crazy rules!",
    elimination: "Elimination: Gradually eliminate players each round.",
    troll: "Troll: Extreme rules to annoy your friends."
  };

  return (
    <div
      id="dice-section"
      className="flex flex-col items-center gap-6 w-full max-w-sm px-4 py-2"
    >
      {/* Selector screen pill */}
      <div className="flex items-center justify-between w-full">
        <button
          onClick={() => setView("dice-modes")}
          className="text-xs font-black px-3 py-1.5 rounded-full hover:opacity-85 transition"
          style={{ background: "var(--accent-light)", color: "var(--text-accent)" }}
        >
          Modes Guide 📋
        </button>
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          Dice Mode: {diceMode}
        </span>
      </div>

      {/* 3D Dice display */}
      <div className="flex items-center justify-center gap-8 my-4 py-4 min-h-[140px]">
        <Die3D value={face1} rolling={rolling} rotation={rot1} />
        <Die3D value={face2} rolling={rolling} rotation={rot2} />
      </div>

      {/* Score Sum indicator */}
      <div className="flex flex-col items-center gap-1.5">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Rolled</span>
        <div
          className="w-16 h-16 rounded-3xl flex items-center justify-center text-2xl font-black shadow-lg"
          style={{
            background: rolling ? "var(--accent-light)" : "var(--card-bg)",
            color: "var(--text-accent)",
            border: "2px solid var(--card-border)",
            transition: "background 0.3s, color 0.3s"
          }}
        >
          {rolling ? "?" : face1 + face2}
        </div>
      </div>

      {/* Dice Mode Selector mockup */}
      <div className="w-full flex flex-col gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 self-start">Choose Mode</span>
        <div className="grid grid-cols-4 gap-2">
          {[
            { id: "classic", label: "Classic", icon: "🎲" },
            { id: "double", label: "Double", icon: "👥" },
            { id: "lucky", label: "Lucky", icon: "🍀" },
            { id: "chaos", label: "Chaos", icon: "😈" },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => { soundManager.playTick(); setDiceMode(mode.id as any); }}
              disabled={rolling}
              className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1 border-2 text-xs font-black transition-all ${diceMode === mode.id
                  ? "border-[#6c3bff] bg-[#6c3bff]/10 text-[#6c3bff] dark:border-[#a47cfc] dark:bg-[#a47cfc]/10 dark:text-[#a47cfc]"
                  : "border-var(--card-border) bg-var(--card-bg) text-slate-500"
                }`}
            >
              <span className="text-lg">{mode.icon}</span>
              <span className="text-[10px]">{mode.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Helper Description */}
      <p className="text-xs font-semibold text-center leading-relaxed h-8 text-slate-500 dark:text-slate-400">
        {modeDesc[diceMode]}
      </p>

      {/* Roll Button */}
      <button
        id="roll-dice-btn"
        onClick={rollDice}
        disabled={disabled}
        className="btn-primary w-full justify-center py-4 rounded-2xl shadow-xl transition-all"
        style={
          disabled
            ? { background: "var(--sub-accent)", boxShadow: "none", cursor: "not-allowed" }
            : {
              background: "linear-gradient(135deg, #ff6d00 0%, #ff4081 100%)",
              boxShadow: "0 6px 20px rgba(255,109,0,0.3)",
            }
        }
      >
        {rolling ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
            Rolling…
          </span>
        ) : (
          <>🎲 Roll Dice</>
        )}
      </button>

      {participants.length < 2 && (
        <p className="text-xs font-bold text-center text-red-500 animate-pulse">
          ⚠️ Add at least 2 friends first!
        </p>
      )}
    </div>
  );
}
