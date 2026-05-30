"use client";

import { useState, useEffect, useRef } from "react";
import { useGameStore } from "@/store/useGameStore";
import { soundManager } from "@/components/shared/SoundManager";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Volume2, VolumeX, Plus, X, Info, Users, Dices } from "lucide-react";

const FACE_COLORS = [
  { bg: "from-[#ff6b6b]/40 to-[#ee5a24]/30", border: "border-[#ff6b6b]/50", dot: "bg-[#ff6b6b]" },
  { bg: "from-[#4fc3f7]/40 to-[#0288d1]/30", border: "border-[#4fc3f7]/50", dot: "bg-[#4fc3f7]" },
  { bg: "from-[#69f0ae]/40 to-[#00c853]/30", border: "border-[#69f0ae]/50", dot: "bg-[#69f0ae]" },
  { bg: "from-[#ffd740]/40 to-[#ffab00]/30", border: "border-[#ffd740]/50", dot: "bg-[#ffd740]" },
  { bg: "from-[#b388ff]/40 to-[#7c3aed]/30", border: "border-[#b388ff]/50", dot: "bg-[#b388ff]" },
  { bg: "from-[#ff80ab]/40 to-[#e91e63]/30", border: "border-[#ff80ab]/50", dot: "bg-[#ff80ab]" },
];

// Dot positions for each face (1-6) on a 3x3 grid
const DOT_POSITIONS: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

function renderFaceDots(val: number) {
  const dots = DOT_POSITIONS[val] ?? [];
  return (
    <div className="grid grid-cols-3 grid-rows-3 gap-0.5 w-8 h-8 absolute top-1.5 left-1.5 opacity-40">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="flex items-center justify-center">
          {dots.includes(i) && <div className="w-1.5 h-1.5 rounded-full bg-slate-500 dark:bg-slate-300" />}
        </div>
      ))}
    </div>
  );
}

// Helper to render the custom face content (name instead of dot)
function renderFaceContent(val: number, name: string) {
  const isLong = name.length > 10;
  const isVeryLong = name.length > 13;
  const fontSize = isVeryLong ? "text-[9px]" : isLong ? "text-[11px]" : "text-xs";
  const colors = FACE_COLORS[(val - 1) % FACE_COLORS.length];
  
  return (
    <div className={`w-full h-full flex flex-col items-center justify-center p-1.5 text-center select-none bg-gradient-to-br ${colors.bg} rounded-[5px] border ${colors.border} shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.03)] relative overflow-hidden`}>
      {renderFaceDots(val)}
      <span className="text-[7px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5 leading-none z-10">
        #{val}
      </span>
      <div 
        className={`${fontSize} font-black text-slate-800 dark:text-white uppercase tracking-wide leading-tight break-all line-clamp-2 px-1 z-10 drop-shadow-sm`}
      >
        {name}
      </div>
      <div className="absolute bottom-1 right-1.5 text-[16px] opacity-20 select-none leading-none">
        {["⚀","⚁","⚂","⚃","⚄","⚅"][val - 1]}
      </div>
    </div>
  );
}

// 3D Single Classic Die component showing Names on faces
interface Die3DProps {
  names: string[];
  rotation: { x: number; y: number; z: number };
  rolling: boolean;
  settling?: boolean;
}

function Die3D({ names, rotation, rolling, settling }: Die3DProps) {
  const getFaceName = (index: number) => {
    return names[index] || "WhoPay? 🎲";
  };

  return (
    <div className="dice-scene-classic select-none relative z-10">
      <div
        className={`dice-cube-classic ${rolling ? "rolling" : settling ? "settling" : "idle"}`}
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(${rotation.z}deg)`,
        }}
      >
        <div className="dice-cube-face-classic dice-face-classic-1">{renderFaceContent(1, getFaceName(0))}</div>
        <div className="dice-cube-face-classic dice-face-classic-2">{renderFaceContent(2, getFaceName(1))}</div>
        <div className="dice-cube-face-classic dice-face-classic-3">{renderFaceContent(3, getFaceName(2))}</div>
        <div className="dice-cube-face-classic dice-face-classic-4">{renderFaceContent(4, getFaceName(3))}</div>
        <div className="dice-cube-face-classic dice-face-classic-5">{renderFaceContent(5, getFaceName(4))}</div>
        <div className="dice-cube-face-classic dice-face-classic-6">{renderFaceContent(6, getFaceName(5))}</div>
      </div>
    </div>
  );
}

// Map dice value to its front-facing 3D rotation angles
const getFaceRotation = (val: number, spinCount: number) => {
  const extraSpins = spinCount * 1440; // multiple full spins
  switch (val) {
    case 1: return { x: extraSpins + 0, y: extraSpins + 0, z: extraSpins + 0 };
    case 6: return { x: extraSpins + 0, y: extraSpins + 180, z: extraSpins + 0 };
    case 2: return { x: extraSpins - 90, y: extraSpins + 0, z: extraSpins + 0 };
    case 5: return { x: extraSpins + 90, y: extraSpins + 0, z: extraSpins + 0 };
    case 3: return { x: extraSpins + 0, y: extraSpins + 90, z: extraSpins + 0 };
    case 4: return { x: extraSpins + 0, y: extraSpins - 90, z: extraSpins + 0 };
    default: return { x: 0, y: 0, z: 0 };
  }
};

const getInitialFaces = (list: string[]) => {
  const defaultNames = ["Alex 😎", "Jamie 🌟", "Sam 🎉", "Taylor 🔥", "Morgan 💫", "You 👆"];
  const res: string[] = [];
  for (let i = 0; i < 6; i++) {
    res.push(list[i] || defaultNames[i] || "WhoPay? 🎲");
  }
  return res;
};

export default function DiceView() {
  const {
    participants,
    addParticipant,
    removeParticipant,
    isSpinning,
    setSpinning,
    winner,
    winnerIndex,
    setWinner,
    triggerDiceRoll,
    diceMode,
    soundEnabled,
    setSoundEnabled,
    setView,
    activeGroupId,
    groups,
  } = useGameStore();

  const [rolling, setRolling] = useState(false);
  const [settling, setSettling] = useState(false);
  const [faceNames, setFaceNames] = useState<string[]>([]);
  const [spinCount, setSpinCount] = useState(1);

  // Rotation states (X, Y, Z)
  const [rot1, setRot1] = useState({ x: 0, y: 0, z: 0 });

  const [newPlayerName, setNewPlayerName] = useState("");
  const [errorToast, setErrorToast] = useState<string | null>(null);

  const tickRef = useRef<number | null>(null);

  // Synchronize face names dynamically as participants are added or removed
  useEffect(() => {
    setFaceNames(getInitialFaces(participants));
  }, [participants]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, []);

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newPlayerName.trim();
    if (!name) return;
    if (name.length > 15) {
      triggerError("Name is too long!");
      return;
    }
    if (participants.includes(name)) {
      triggerError("Player already exists!");
      return;
    }
    soundManager.playTick();
    addParticipant(name);
    setNewPlayerName("");
  };

  const triggerError = (msg: string) => {
    setErrorToast(msg);
    setTimeout(() => setErrorToast(null), 2000);
  };

  const rollDice = async () => {
    if (rolling || isSpinning || participants.length < 2) return;

    setRolling(true);
    setSettling(false);
    if (soundEnabled) soundManager.playTick();

    // Increment spins count
    const nextSpin = spinCount + 1;
    setSpinCount(nextSpin);

    // Initial wild multi-axis tumbling spin (X, Y, Z)
    setRot1({
      x: nextSpin * 1440 + Math.floor(Math.random() * 360) + 180,
      y: nextSpin * 1440 + Math.floor(Math.random() * 360) + 180,
      z: nextSpin * 1440 + Math.floor(Math.random() * 360) + 90,
    });

    // Call store trigger
    const result = await triggerDiceRoll();
    if (!result) {
      setRolling(false);
      setSettling(false);
      return;
    }

    const { selectedIndex, winner: winnerName, dice1 } = result;
    const rollDuration = 1800;

    // Dynamically align faceNames so that the winning face (dice1) holds the selected winner name
    const nextFaces = [...faceNames];
    
    // Set winning face (dice1 is 1-based, so index is dice1 - 1)
    nextFaces[dice1 - 1] = participants[selectedIndex];

    // Distribute remaining participants to the other 5 faces
    let pool = participants.filter((_, idx) => idx !== selectedIndex);
    if (pool.length === 0) pool = [participants[selectedIndex]];

    for (let i = 0; i < 6; i++) {
      if (i !== dice1 - 1) {
        nextFaces[i] = pool[i % pool.length] || "WhoPay? 🎲";
      }
    }
    setFaceNames(nextFaces);

    // Play tick sounds rapidly if enabled
    let tickCount = 0;
    if (soundEnabled) {
      tickRef.current = window.setInterval(() => {
        soundManager.playTick();
        tickCount++;
        if (tickCount >= 14 && tickRef.current) {
          clearInterval(tickRef.current);
        }
      }, 100);
    }

    // Settle on final target rotations midway through
    setTimeout(() => {
      setRot1(getFaceRotation(dice1, nextSpin));
    }, 1000);

    // Remove rolling class early so transition takes over for slow settle
    setTimeout(() => {
      setRolling(false);
      setSettling(true);
    }, 1400);

    // Roll complete - show result
    setTimeout(() => {
      if (tickRef.current) clearInterval(tickRef.current);

      if (soundEnabled) soundManager.playReveal();

      setTimeout(() => {
        setWinner(winnerName, selectedIndex, "dice");
        setSpinning(false);
        setSettling(false);
      }, 1200);
    }, rollDuration + 60);
  };

  const activeGroup = groups.find((g) => g.id === activeGroupId) || { name: "Weekend Squad", members: participants };
  const disabled = rolling || isSpinning || participants.length < 2;

  return (
    <div className="flex-1 flex flex-col bg-[#faf8ff] dark:bg-[#0a0a1a] text-gray-900 dark:text-white font-sans h-full relative transition-colors duration-300 pb-16 overflow-y-auto">
      {/* Cartoon Outlined Dice & Settle properties */}
      <style dangerouslySetInnerHTML={{ __html: `
        .dice-scene-classic {
          width: 170px;
          height: 170px;
          perspective: 700px;
          display: inline-block;
          filter: drop-shadow(0 0 40px rgba(124,58,237,0.2));
        }
        .dice-cube-classic {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          transition: transform 2.8s cubic-bezier(0.05, 0.75, 0.15, 0.95);
        }
        .dice-cube-classic.idle {
          animation: idleSpin 10s ease-in-out infinite;
        }
        @keyframes idleSpin {
          0% { transform: rotateX(-10deg) rotateY(0deg) rotateZ(0deg); }
          25% { transform: rotateX(-15deg) rotateY(90deg) rotateZ(5deg); }
          50% { transform: rotateX(-5deg) rotateY(180deg) rotateZ(-5deg); }
          75% { transform: rotateX(-15deg) rotateY(270deg) rotateZ(5deg); }
          100% { transform: rotateX(-10deg) rotateY(360deg) rotateZ(0deg); }
        }
        .dice-cube-face-classic {
          position: absolute;
          width: 170px;
          height: 170px;
          border-radius: 8px;
          background: linear-gradient(145deg, rgba(255,255,255,0.9), rgba(240,238,255,0.7));
          backdrop-filter: blur(4px);
          border: 3px solid #1a1a2e;
          box-shadow: 
            inset 0 -8px 20px rgba(124, 58, 237, 0.08),
            inset 0 8px 20px rgba(255, 255, 255, 0.7),
            0 12px 40px rgba(124, 58, 237, 0.1);
          display: flex;
          flex-direction: column;
          padding: 12px;
          backface-visibility: hidden;
          transition: background 0.3s, border-color 0.3s, box-shadow 0.3s;
        }
        .dice-cube-face-classic::before {
          content: '';
          position: absolute;
          top: 6px;
          left: 12px;
          right: 12px;
          height: 35%;
          background: linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 100%);
          border-radius: 20px;
          pointer-events: none;
        }
        .dark .dice-cube-face-classic {
          background: linear-gradient(145deg, rgba(30,30,74,0.9), rgba(18,18,42,0.7));
          border-color: rgba(124, 58, 237, 0.3);
        }
        .dice-cube-classic.rolling .dice-cube-face-classic {
          background: linear-gradient(135deg, rgba(124,58,237,0.6), rgba(236,72,153,0.6));
          backdrop-filter: blur(8px);
          border-color: rgba(250,204,21,0.5);
          box-shadow: 0 0 50px rgba(124,58,237,0.3), inset 0 -8px 20px rgba(0,0,0,0.1);
        }
        .dark .dice-cube-classic.rolling .dice-cube-face-classic {
          background: linear-gradient(135deg, rgba(124,58,237,0.7), rgba(236,72,153,0.7));
        }
        .dice-cube-classic.rolling {
          animation: boxJellyTumble 0.45s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite;
        }
        @keyframes boxJellyTumble {
          0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1,1); }
          10% { transform: rotateX(120deg) rotateY(60deg) rotateZ(30deg) scale(1.1,0.9); }
          20% { transform: rotateX(240deg) rotateY(180deg) rotateZ(-30deg) scale(0.9,1.1); }
          30% { transform: rotateX(360deg) rotateY(240deg) rotateZ(60deg) scale(1.08,0.92); }
          40% { transform: rotateX(480deg) rotateY(360deg) rotateZ(-60deg) scale(0.92,1.08); }
          50% { transform: rotateX(600deg) rotateY(420deg) rotateZ(90deg) scale(1.12,0.88); }
          60% { transform: rotateX(720deg) rotateY(540deg) rotateZ(-45deg) scale(0.88,1.12); }
          70% { transform: rotateX(840deg) rotateY(600deg) rotateZ(45deg) scale(1.06,0.94); }
          80% { transform: rotateX(960deg) rotateY(720deg) rotateZ(-90deg) scale(0.94,1.06); }
          90% { transform: rotateX(1020deg) rotateY(780deg) rotateZ(30deg) scale(1.1,0.9); }
          100% { transform: rotateX(1200deg) rotateY(900deg) rotateZ(0deg) scale(1,1); }
        }

        /* Slow settle wobble */
        @keyframes settleWobble {
          0% { transform: scale(1.06,0.94); }
          30% { transform: scale(0.95,1.05); }
          60% { transform: scale(1.02,0.98); }
          100% { transform: scale(1,1); }
        }
        .dice-cube-classic.settling {
          animation: settleWobble 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        .dice-face-classic-1 { transform: rotateY(0deg) translateZ(85px); }
        .dice-face-classic-6 { transform: rotateY(180deg) translateZ(85px); }
        .dice-face-classic-2 { transform: rotateX(90deg) translateZ(85px); }
        .dice-face-classic-5 { transform: rotateX(-90deg) translateZ(85px); }
        .dice-face-classic-3 { transform: rotateY(-90deg) translateZ(85px); }
        .dice-face-classic-4 { transform: rotateY(90deg) translateZ(85px); }

        /* Floating particles behind the die */
        @keyframes floatSlow1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
          50% { transform: translate(-18px, -20px) rotate(12deg) scale(1.1); }
        }
        @keyframes floatSlow2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
          50% { transform: translate(16px, 14px) rotate(-16deg) scale(1.15); }
        }
        @keyframes floatSlow3 {
          0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
          50% { transform: translate(-20px, 12px) rotate(20deg) scale(1.08); }
        }
        @keyframes floatSlow4 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(22px, -10px) rotate(-10deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        .confetti-float-1 { animation: floatSlow1 5.5s ease-in-out infinite; }
        .confetti-float-2 { animation: floatSlow2 7s ease-in-out infinite; }
        .confetti-float-3 { animation: floatSlow3 6.5s ease-in-out infinite; }
        .confetti-float-4 { animation: floatSlow4 8s ease-in-out infinite; }

        .glow-halo {
          position: absolute;
          width: 340px;
          height: 340px;
          background: radial-gradient(circle, rgba(124, 58, 237, 0.2) 0%, rgba(236, 72, 153, 0.08) 40%, transparent 68%);
          border-radius: 50%;
          z-index: 0;
          animation: pulseGlow 3s ease-in-out infinite;
        }
        .dark .glow-halo {
          background: radial-gradient(circle, rgba(124, 58, 237, 0.3) 0%, rgba(236, 72, 153, 0.12) 40%, transparent 68%);
        }

        .dice-wrapper-glow {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      ` }} />

      {/* BEGIN: Header Section in Sidebar Cartoon Model */}
      <header className="w-full flex items-center justify-between px-6 py-4 z-10" data-purpose="app-top-bar">
        <button
          onClick={() => { soundManager.playTick(); setView("home"); }}
          aria-label="Go back"
          className="w-10 h-10 rounded-[1rem] flex items-center justify-center bg-white dark:bg-[#12122a] border-4 border-slate-100 dark:border-slate-800 shadow-sm text-slate-600 dark:text-white hover:scale-[1.03] active:scale-[0.97] transition-all"
        >
          <ArrowLeft size={18} strokeWidth={3} />
        </button>

        <div className="text-center flex-1 mx-3">
          <h1 className="text-xl font-black uppercase tracking-wider text-[#1D2433] dark:text-white leading-none mb-1">
            Roll the Dice
          </h1>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
            Let the dice decide who pays! 🎲
          </p>
        </div>

        <button
          onClick={() => {
            soundManager.playTick();
            setSoundEnabled(!soundEnabled);
          }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-[1rem] border-4 border-slate-100 dark:border-slate-800 bg-white dark:bg-[#12122a] shadow-sm font-black text-[10px] text-slate-700 dark:text-white uppercase tracking-wider hover:scale-[1.03] active:scale-[0.97] transition-all"
        >
          {soundEnabled ? (
            <Volume2 size={13} className="text-purple-600 dark:text-purple-400" />
          ) : (
            <VolumeX size={13} className="text-slate-400" />
          )}
          <span>{soundEnabled ? "Sound" : "Muted"}</span>
        </button>
      </header>
      {/* END: Header Section */}

      <main className="flex-1 w-full max-w-md mx-auto px-5 pt-2 flex flex-col items-center gap-5">
        {/* Active group header pill in Cartoon trim */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          onClick={() => { soundManager.playTick(); setView("group"); }}
          className="px-4 py-2 rounded-full bg-white dark:bg-[#12122a] border-4 border-slate-100 dark:border-slate-800 text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-[0_4px_12px_rgba(124,58,237,0.04)] select-none"
        >
          <span>👥 {activeGroup.name}</span>
          <span className="text-[9px] text-purple-600 dark:text-[#a589ff]">({participants.length} members) ›</span>
        </motion.div>

        {/* BEGIN: Dice Display Area (no box) */}
        <div className="w-full flex flex-col items-center relative">
          
          {/* Single Large 3D Dice Display Box */}
          <div className="relative w-full min-h-[220px] flex items-center justify-center py-6 overflow-visible dice-wrapper-glow">
            
            {/* Radial background backlight glow */}
            <div className="glow-halo" />

            {/* Scattered Floating Confetti Shapes */}
            <div className="absolute top-0 left-6 text-2xl confetti-float-1 select-none opacity-80 z-0">🧡</div>
            <div className="absolute bottom-2 left-10 text-2xl confetti-float-3 select-none opacity-80 z-0">⭐</div>
            <div className="absolute top-1/3 left-2 text-xl confetti-float-2 select-none opacity-60 z-0">🟢</div>
            <div className="absolute top-4 right-8 text-2xl confetti-float-2 select-none opacity-85 z-0">👾</div>
            <div className="absolute bottom-4 right-6 text-2xl confetti-float-1 select-none opacity-70 z-0">🔵</div>
            <div className="absolute top-1/3 right-2 text-xl confetti-float-3 select-none opacity-85 z-0">💖</div>
            <div className="absolute top-10 left-1/4 text-2xl confetti-float-4 select-none opacity-60 z-0">✨</div>
            <div className="absolute bottom-8 right-1/4 text-2xl confetti-float-4 select-none opacity-70 z-0">🎊</div>

            {/* Single Large 3D name-based white Die */}
            <Die3D names={faceNames} rotation={rot1} rolling={rolling} settling={settling} />
          </div>

          {/* Chosen Player Display */}
          <div className="flex flex-col items-center gap-1.5 mb-4">
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Chosen Player 🎯</span>
            <div className="text-xl font-black text-purple-600 dark:text-[#a589ff] uppercase tracking-wide text-center max-w-xs truncate">
              {rolling ? (
                <span className="animate-pulse">Deciding...</span>
              ) : winner ? (
                <span>{participants[winnerIndex ?? 0] || winner}</span>
              ) : (
                <span>Roll to Choose!</span>
              )}
            </div>
          </div>

          {/* Roll Button with thick border and flat 3D lift shadows */}
          <motion.button
            whileHover={disabled ? {} : { scale: 1.01, translateY: -1 }}
            whileTap={disabled ? {} : { scale: 0.99, translateY: 1 }}
            onClick={rollDice}
            disabled={disabled}
            className="w-full py-4 rounded-[1.2rem] font-black uppercase tracking-wider text-sm flex items-center justify-center gap-2.5 transition-all select-none border-4"
            style={
              disabled
                ? { 
                    background: "var(--accent-light)", 
                    color: "var(--text-muted)", 
                    borderColor: "transparent",
                    cursor: "not-allowed",
                    boxShadow: "none"
                  }
                : {
                    background: "#7c3aed",
                    borderColor: "#6d28d9",
                    color: "#ffffff",
                    boxShadow: "0 6px 0 #4c1d95"
                  }
            }
          >
            {rolling ? (
              <span className="flex items-center gap-2.5">
                <span className="w-5 h-5 border-2.5 border-t-transparent border-white rounded-full animate-spin" />
                Spinning...
              </span>
            ) : (
              <>
                <Dices size={20} className="animate-bounce" />
                Roll the Dice
              </>
            )}
          </motion.button>

          {/* Info pill with cartoon outline */}
          <div className="flex items-center gap-2 py-3 px-4 rounded-[1.2rem] bg-[#F0EBFF] dark:bg-[#1f173f] border-2 border-purple-200 dark:border-purple-900 text-purple-600 dark:text-[#b49eff] text-[10px] font-black w-full justify-center select-none mt-5 uppercase tracking-wide">
            <Info size={14} />
            <span>The highest number on the dice wins!</span>
          </div>

        </div>
        {/* END: Dice Display Area */}

        {/* BEGIN: Name Addition / Squad Members section */}
        <div className="w-full flex flex-col gap-3.5 z-10" data-purpose="squad-members-area">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Users size={14} />
              <span>Squad Members ({participants.length})</span>
            </h3>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Mode: {diceMode}</span>
          </div>

          {/* Add Players form with Cartoon Trim */}
          <form onSubmit={handleAddPlayer} className="w-full flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                placeholder="Add friend to squad..."
                maxLength={15}
                className="w-full pl-10 pr-4 py-3.5 rounded-[1.2rem] border-4 border-slate-100 dark:border-slate-800 bg-white dark:bg-[#12122a] text-xs font-black text-slate-800 dark:text-white outline-none focus:border-purple-600 dark:focus:border-[#a589ff] transition-all"
              />
              <Users size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
            <button
              type="submit"
              className="px-5 py-3.5 rounded-[1.2rem] bg-purple-600 text-white text-xs font-black uppercase tracking-wider border-4 border-purple-800 shadow-[0_4px_0_#4c1d95] active:translate-y-[2px] active:shadow-none hover:-translate-y-[1px] transition-all select-none flex items-center gap-1.5"
            >
              <Plus size={14} /> Add
            </button>
          </form>

          {/* Quick interactive participant list */}
          {participants.length === 0 ? (
            <div className="p-6 rounded-2xl border-4 border-dashed border-slate-100 dark:border-slate-800 bg-white/30 dark:bg-white/5 flex flex-col items-center justify-center text-center">
              <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-0.5">Your squad is empty!</p>
              <p className="text-[9px] font-black uppercase text-slate-400/60 tracking-wider">Add names above to roll.</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 justify-center max-h-36 overflow-y-auto p-2 bg-white/40 dark:bg-white/5 border-4 border-slate-100 dark:border-slate-800 rounded-[1.8rem]">
              {participants.map((player, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-1.5 pl-3.5 pr-1.5 py-1.5 rounded-full bg-white dark:bg-[#12122a] border-2 border-slate-100 dark:border-slate-800 shadow-sm text-[10px] font-black uppercase tracking-wider text-slate-800 dark:text-slate-200"
                >
                  <span>{player}</span>
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playTick();
                      removeParticipant(idx);
                    }}
                    aria-label={`Remove ${player}`}
                    className="w-5 h-5 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-850 hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <X size={10} strokeWidth={3} />
                  </button>
                </motion.div>
              ))}
            </div>
          )}

          {participants.length < 2 && (
            <p className="text-[10px] font-black uppercase tracking-widest text-center text-red-500 animate-pulse mt-1 select-none">
              ⚠️ Add at least 2 friends to roll the dice!
            </p>
          )}
        </div>
        {/* END: Name Addition / Squad Members section */}
      </main>

      {/* Floating Error Toast */}
      <AnimatePresence>
        {errorToast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-red-500 text-white font-extrabold text-xs py-3 px-5 rounded-2xl shadow-lg z-50 text-center"
          >
            {errorToast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
