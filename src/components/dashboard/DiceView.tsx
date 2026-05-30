"use client";

import { useState, useEffect, useRef } from "react";
import { useGameStore } from "@/store/useGameStore";
import { soundManager } from "@/components/shared/SoundManager";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Volume2, VolumeX, Plus, X, Users, Dices } from "lucide-react";

const FACE_COLORS = [
  { bg: "from-white to-white", border: "border-black/20", dot: "bg-black" },
  { bg: "from-white to-white", border: "border-black/20", dot: "bg-black" },
  { bg: "from-white to-white", border: "border-black/20", dot: "bg-black" },
  { bg: "from-white to-white", border: "border-black/20", dot: "bg-black" },
  { bg: "from-white to-white", border: "border-black/20", dot: "bg-black" },
  { bg: "from-white to-white", border: "border-black/20", dot: "bg-black" },
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
    <div className="grid grid-cols-3 grid-rows-3 gap-0.5 w-8 h-8 absolute top-1.5 left-1.5 opacity-15">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="flex items-center justify-center">
          {dots.includes(i) && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
        </div>
      ))}
    </div>
  );
}

// Helper to render face with participant name
function renderFaceContent(val: number, name: string) {
  const isLong = name.length > 10;
  const isVeryLong = name.length > 13;
  const fontSize = isVeryLong ? "text-[9px]" : isLong ? "text-[11px]" : "text-xs";

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center select-none bg-white relative overflow-hidden">
      <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest leading-none z-10">
        #{val}
      </span>
      <div className={`${fontSize} font-black text-slate-800 uppercase tracking-wide leading-tight break-all line-clamp-2 px-1 z-10`}>
        {name}
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
    setActiveGroupId,
  } = useGameStore();

  const [rolling, setRolling] = useState(false);
  const [settling, setSettling] = useState(false);
  const [faceNames, setFaceNames] = useState<string[]>([]);
  const [spinCount, setSpinCount] = useState(1);
  const [slowMo, setSlowMo] = useState(false);
  const [showGroupPicker, setShowGroupPicker] = useState(false);

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

    const sp = slowMo ? 2.5 : 1;
    const spSuffix = slowMo ? "s" : "";

    setRolling(true);
    setSettling(false);
    if (soundEnabled) soundManager.playTick();

    const nextSpin = spinCount + 1;
    setSpinCount(nextSpin);

    document.documentElement.style.setProperty("--dice-transition-duration", slowMo ? "6s" : "2.8s");
    document.documentElement.style.setProperty("--dice-tumble-duration", slowMo ? "1.2s" : "0.45s");

    setRot1({
      x: nextSpin * 1440 + Math.floor(Math.random() * 360) + 180,
      y: nextSpin * 1440 + Math.floor(Math.random() * 360) + 180,
      z: nextSpin * 1440 + Math.floor(Math.random() * 360) + 90,
    });

    const result = await triggerDiceRoll();
    if (!result) {
      setRolling(false);
      setSettling(false);
      return;
    }

    const { selectedIndex, winner: winnerName, dice1 } = result;
    const rollDuration = Math.round(1800 * sp);

    const nextFaces = [...faceNames];
    nextFaces[dice1 - 1] = participants[selectedIndex];

    let pool = participants.filter((_, idx) => idx !== selectedIndex);
    if (pool.length === 0) pool = [participants[selectedIndex]];

    for (let i = 0; i < 6; i++) {
      if (i !== dice1 - 1) {
        nextFaces[i] = pool[i % pool.length] || "WhoPay? 🎲";
      }
    }
    setFaceNames(nextFaces);

    let tickCount = 0;
    if (soundEnabled) {
      tickRef.current = window.setInterval(() => {
        soundManager.playTick();
        tickCount++;
        if (tickCount >= 14 && tickRef.current) {
          clearInterval(tickRef.current);
        }
      }, Math.round(100 * sp));
    }

    setTimeout(() => {
      setRot1(getFaceRotation(dice1, nextSpin));
    }, Math.round(1000 * sp));

    setTimeout(() => {
      setRolling(false);
      setSettling(true);
    }, Math.round(1400 * sp));

    setTimeout(() => {
      if (tickRef.current) clearInterval(tickRef.current);

      if (soundEnabled) soundManager.playReveal();

      setTimeout(() => {
        setWinner(winnerName, selectedIndex, "dice");
        setSpinning(false);
        setSettling(false);
      }, Math.round(1200 * sp));
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
          perspective: 900px;
          display: inline-block;
          filter: drop-shadow(0 15px 40px rgba(0,0,0,0.25)) drop-shadow(0 5px 15px rgba(0,0,0,0.1));
        }
        .dark .dice-scene-classic {
          filter: drop-shadow(0 15px 40px rgba(0,0,0,0.5)) drop-shadow(0 5px 15px rgba(0,0,0,0.2));
        }
        .dice-cube-classic {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          transition: transform var(--dice-transition-duration, 2.8s) cubic-bezier(0.05, 0.85, 0.08, 1);
          background: #e8e8e8;
          box-shadow: 
            0 0 0 1px rgba(0,0,0,0.08),
            inset 0 0 30px rgba(0,0,0,0.06);
        }
        .dice-cube-classic.idle {
          animation: idleSpin 10s ease-in-out infinite;
        }
        @keyframes idleSpin {
          0% { transform: rotateX(-15deg) rotateY(0deg) rotateZ(0deg); }
          25% { transform: rotateX(-20deg) rotateY(90deg) rotateZ(5deg); }
          50% { transform: rotateX(-10deg) rotateY(180deg) rotateZ(-5deg); }
          75% { transform: rotateX(-20deg) rotateY(270deg) rotateZ(5deg); }
          100% { transform: rotateX(-15deg) rotateY(360deg) rotateZ(0deg); }
        }
        .dice-cube-face-classic {
          position: absolute;
          width: 170px;
          height: 170px;
          background: linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%);
          border: 2px solid #1a1a2e;
          box-shadow: 
            inset 0 -8px 16px rgba(0,0,0,0.06),
            inset 0 8px 16px rgba(255,255,255,0.9);
          display: flex;
          padding: 0;
          backface-visibility: hidden;
          transition: background 0.3s, border-color 0.3s, box-shadow 0.3s;
        }
        .dark .dice-cube-face-classic {
          background: linear-gradient(145deg, #f8f8f8 0%, #e8e8e8 100%);
        }
        .dice-cube-classic.rolling .dice-cube-face-classic {
          background: #e0e0e0;
          border-color: #333;
          box-shadow: 0 0 30px rgba(0,0,0,0.2);
        }
        .dark .dice-cube-classic.rolling .dice-cube-face-classic {
          background: #d0d0d0;
        }
        .dice-cube-classic.rolling {
          animation: boxJellyTumble var(--dice-tumble-duration, 0.45s) cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite;
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
          background: radial-gradient(circle, rgba(0,0,0,0.06) 0%, transparent 60%);
          border-radius: 50%;
          z-index: 0;
          animation: pulseGlow 3s ease-in-out infinite;
        }
        .dark .glow-halo {
          background: radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 60%);
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

        <div className="text-center flex-1 mx-1">
          <h1 className="text-sm md:text-xl font-black uppercase tracking-wider text-[#1D2433] dark:text-white leading-none truncate">
            Roll the Dice
          </h1>
        </div>

        <button
          onClick={() => {
            soundManager.playTick();
            setSoundEnabled(!soundEnabled);
          }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-[1rem] border-4 border-slate-100 dark:border-slate-800 bg-white dark:bg-[#12122a] shadow-sm font-black text-[10px] text-slate-700 dark:text-white uppercase tracking-wider hover:scale-[1.03] active:scale-[0.97] transition-all"
        >
          {soundEnabled ? (
            <Volume2 size={13} className="text-black dark:text-white" />
          ) : (
            <VolumeX size={13} className="text-slate-400" />
          )}
          <span>{soundEnabled ? "Sound" : "Muted"}</span>
        </button>
        <button
          onClick={() => { soundManager.playTick(); setSlowMo(!slowMo); }}
          className={`flex items-center gap-1 px-3 py-2 rounded-[1rem] border-4 bg-white dark:bg-[#12122a] shadow-sm font-black text-[10px] uppercase tracking-wider hover:scale-[1.03] active:scale-[0.97] transition-all ${slowMo ? "border-black dark:border-white text-black dark:text-white" : "border-slate-100 dark:border-slate-800 text-slate-400"}`}
        >
          <span className={slowMo ? "opacity-100" : "opacity-40"}>🐢</span>
          <span>Slow</span>
        </button>
      </header>
      {/* END: Header Section */}

      <main className="flex-1 w-full max-w-md mx-auto px-5 pt-2 flex flex-col items-center gap-5">
        {/* Active group selector dropdown */}
        <div className="relative">
          <motion.div
            whileHover={{ scale: 1.03 }}
            onClick={() => setShowGroupPicker(!showGroupPicker)}
            className="px-4 py-2 rounded-full bg-white dark:bg-[#12122a] border-4 border-slate-100 dark:border-slate-800 text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-[0_4px_12px_rgba(124,58,237,0.04)] select-none"
          >
            <span>👥 {activeGroup.name}</span>
            <span className="text-[9px] text-black/50 dark:text-white/50 flex items-center gap-1">({participants.length}) <svg className={`w-4 h-4 transition-transform duration-300 ease-in-out ${showGroupPicker ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"/></svg></span>
          </motion.div>
          {showGroupPicker && (
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-64 bg-white dark:bg-[#12122a] rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-xl z-50">
              {groups.map((g) => (
                <button
                  key={g.id}
                  onClick={() => { soundManager.playTick(); setActiveGroupId(g.id); setShowGroupPicker(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                    g.id === activeGroupId ? "bg-blue-50 dark:bg-blue-900/20" : ""
                  }`}
                >
                  <span className="text-lg">{g.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate block">{g.name}</span>
                    <span className="text-[10px] text-slate-400">{g.members.length} members</span>
                  </div>
                  {g.id === activeGroupId && (
                    <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* BEGIN: Dice Display Area (no box) */}
        <div className="w-full flex flex-col items-center relative">
          
          {/* Single Large 3D Dice Display Box */}
          <div className="relative w-full min-h-[220px] flex items-center justify-center py-6 overflow-visible dice-wrapper-glow">
            
            {/* Radial background backlight glow */}
            <div className="glow-halo" />

            {/* Scattered Floating Shapes */}
            <div className="absolute top-0 left-6 text-2xl confetti-float-1 select-none opacity-30 z-0">◆</div>
            <div className="absolute bottom-2 left-10 text-2xl confetti-float-3 select-none opacity-30 z-0">●</div>
            <div className="absolute top-1/3 left-2 text-xl confetti-float-2 select-none opacity-20 z-0">■</div>
            <div className="absolute top-4 right-8 text-2xl confetti-float-2 select-none opacity-30 z-0">▲</div>
            <div className="absolute bottom-4 right-6 text-2xl confetti-float-1 select-none opacity-25 z-0">◆</div>
            <div className="absolute top-1/3 right-2 text-xl confetti-float-3 select-none opacity-25 z-0">●</div>
            <div className="absolute top-10 left-1/4 text-2xl confetti-float-4 select-none opacity-20 z-0">■</div>
            <div className="absolute bottom-8 right-1/4 text-2xl confetti-float-4 select-none opacity-25 z-0">▲</div>

            {/* Single Large 3D name-based white Die */}
            <Die3D names={faceNames} rotation={rot1} rolling={rolling} settling={settling} />
          </div>

          <div className="h-24"></div>

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
                    background: "#3b82f6",
                    borderColor: "#2563eb",
                    color: "#ffffff",
                    boxShadow: "0 6px 0 #2563eb"
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
              className="px-5 py-3.5 rounded-[1.2rem] bg-[#3b82f6] text-white text-xs font-black uppercase tracking-wider border-4 border-[#2563eb] shadow-[0_4px_0_#2563eb] active:translate-y-[2px] active:shadow-none hover:-translate-y-[1px] transition-all select-none flex items-center gap-1.5"
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
