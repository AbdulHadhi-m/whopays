"use client";

import { useState, useEffect } from "react";
import { useGameStore } from "@/store/useGameStore";
import { soundManager } from "@/components/shared/SoundManager";
import SpinWheel from "@/components/wheel/SpinWheel";
import ResultModal from "@/components/ui/ResultModal";
import RecentSpins from "@/components/shared/RecentSpins";
import { motion } from "framer-motion";
import {
  UserPlus,
  Trash2,
  Volume2,
  VolumeX,
  CreditCard,
  Plus,
  Sparkles,
  Users,
  Shuffle
} from "lucide-react";

export default function WhoPaysGamePage() {
  const {
    participants,
    isSpinning,
    addParticipant,
    removeParticipant,
    clearParticipants,
    triggerSpin,
  } = useGameStore();

  const [newPlayerName, setNewPlayerName] = useState("");
  const [isMuted, setIsMuted] = useState(false);

  // Sync mute state with our Sound Manager
  useEffect(() => {
    soundManager.setMute(isMuted);
  }, [isMuted]);

  const handleAddPlayer = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const name = newPlayerName.trim();
    if (!name) return;
    
    // Play quick tick sound feedback on player addition
    soundManager.playTick();
    
    addParticipant(name);
    setNewPlayerName("");
  };

  const handleSpinClick = async () => {
    if (participants.length < 2 || isSpinning) return;
    
    // Play initial button tick
    soundManager.playTick();

    // Trigger state spin
    const targetIdx = await triggerSpin();
    
    if (targetIdx !== null) {
      // The wheel component is listening for this target index via useEffect and will initiate the rotation automatically.
    }
  };

  const handleMuteToggle = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
  };

  return (
    <div className="min-h-screen bg-[#07050f] text-white py-12 px-4 md:px-8 relative overflow-x-hidden">
      {/* Decorative Neon Spheres */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-neon-purple/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-neon-pink/5 blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        
        {/* Title / Hero Banner */}
        <div className="text-center mb-10 relative">
          {/* Neon Glow text background effect */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-pink/10 border border-neon-pink/20 text-neon-pink text-xs font-mono tracking-widest uppercase mb-4"
          >
            <Sparkles size={12} className="animate-spin" />
            <span>Meme-Fueled Roulette</span>
          </motion.div>

          <motion.h1
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-none mb-3"
          >
            <span className="text-white">Who</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan text-neon-pink">Pays</span>
            <span className="text-neon-cyan">?</span>
          </motion.h1>

          <p className="text-sm md:text-base text-gray-400 font-medium tracking-wide max-w-md mx-auto">
            Stop arguing. Let the wheel of cash decide who buys dinner. 💸
          </p>

          {/* Sound Controls Header */}
          <div className="absolute top-2 right-[-60px] hidden lg:block">
            <button
              onClick={handleMuteToggle}
              className="p-3 rounded-full bg-[#120e29] border border-white/5 text-gray-400 hover:text-white transition-all hover:border-neon-cyan/30"
              title={isMuted ? "Unmute sounds" : "Mute sounds"}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          
          {/* Left Column: Glassmorphic Control Card */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="glass-panel rounded-3xl p-6 border border-white/5 relative overflow-hidden">
              {/* Corner glowing strip */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-neon-pink to-neon-purple" />
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Users className="text-neon-pink w-5 h-5" />
                  <h2 className="text-lg font-bold tracking-wide">
                    SQUAD LIST
                  </h2>
                </div>
                
                <span className="text-xs font-mono bg-neon-purple/20 text-neon-purple border border-neon-purple/30 px-3 py-1 rounded-full">
                  {participants.length} Players
                </span>
              </div>

              {/* Add Player Input Form */}
              <form onSubmit={handleAddPlayer} className="flex gap-2 mb-6">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={newPlayerName}
                    onChange={(e) => setNewPlayerName(e.target.value)}
                    placeholder="Enter name..."
                    maxLength={18}
                    disabled={isSpinning}
                    className="w-full py-3.5 px-4 pr-10 rounded-2xl bg-[#0b081a] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-neon-pink transition-colors text-sm"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    <UserPlus size={16} />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSpinning}
                  className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-neon-pink to-neon-purple text-white hover:opacity-90 transition-opacity font-bold text-sm cursor-pointer shrink-0"
                >
                  <Plus size={18} />
                </button>
              </form>

              {/* Player Scroll Panel */}
              <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1 mb-6">
                {participants.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 text-xs font-mono">
                    SQUAD IS EMPTY! ADD FRIENDS.
                  </div>
                ) : (
                  participants.map((player, idx) => (
                    <div
                      key={idx}
                      className="group flex items-center justify-between p-3.5 rounded-2xl bg-[#0f0b24] border border-white/5 hover:border-neon-purple/30 hover:bg-[#130d2d] transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-neon-purple/20 to-neon-cyan/20 border border-neon-purple/30 flex items-center justify-center text-xs font-mono font-bold text-neon-cyan">
                          {idx + 1}
                        </div>
                        <span className="text-sm font-semibold text-gray-200">
                          {player}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          soundManager.playTick();
                          removeParticipant(idx);
                        }}
                        disabled={isSpinning}
                        className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-neon-pink p-1 hover:bg-neon-pink/10 rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Control Panel Buttons */}
              <div className="flex gap-2 border-t border-white/5 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playTick();
                    clearParticipants();
                  }}
                  disabled={isSpinning || participants.length === 0}
                  className="flex-1 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-gray-400 hover:text-white transition-all flex items-center justify-center gap-1.5 border border-white/5"
                >
                  <Trash2 size={13} />
                  CLEAR ALL
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playTick();
                    // Starter funny templates
                    clearParticipants();
                    const templates = ["Rizzler ⚡", "Slay 💅", "Chad 👑", "Alpha 🐺", "Sigma 🧬", "Sus 🤫"];
                    templates.forEach((name) => addParticipant(name));
                  }}
                  disabled={isSpinning}
                  className="flex-1 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-gray-400 hover:text-white transition-all flex items-center justify-center gap-1.5 border border-white/5"
                >
                  <Shuffle size={13} />
                  MEME TEMPLATE
                </button>
              </div>

            </div>

            {/* Mobile Sound Control Bar */}
            <div className="lg:hidden flex items-center justify-between p-4 rounded-2xl bg-[#0f0b24] border border-white/5">
              <span className="text-xs font-mono text-gray-400">AUDIO CONTROLLER</span>
              <button
                onClick={handleMuteToggle}
                className="py-2 px-4 rounded-xl bg-white/5 border border-white/10 text-gray-400 flex items-center gap-2 hover:text-white text-xs font-mono"
              >
                {isMuted ? (
                  <>
                    <VolumeX size={14} className="text-neon-pink" />
                    <span>MUTED</span>
                  </>
                ) : (
                  <>
                    <Volume2 size={14} className="text-neon-cyan" />
                    <span>SOUND ON</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Right Column: Rotating Spin Wheel */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-4">
            
            <div className="relative mb-8">
              <SpinWheel />
            </div>

            {/* Neon Custom Glow Launch Trigger Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              disabled={isSpinning || participants.length < 2}
              onClick={handleSpinClick}
              className={`px-12 py-5 rounded-3xl font-extrabold tracking-widest text-base shadow-lg transition-all relative z-10 cursor-pointer overflow-hidden ${
                isSpinning || participants.length < 2
                  ? "bg-gray-800 text-gray-600 border border-gray-700 cursor-not-allowed"
                  : "bg-gradient-to-r from-neon-purple via-neon-pink to-neon-cyan text-white shadow-neon-pink/20 border border-white/10"
              }`}
            >
              {/* Spinner Inner Glow Line */}
              <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity" />
              
              {isSpinning ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>SPINNING FOR BILL...</span>
                </div>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <CreditCard size={18} className="animate-pulse" />
                  SPIN THE WHEEL ⚡
                </span>
              )}
            </motion.button>
            
          </div>

        </div>

        {/* Shame Activity Ledger Wall Feed */}
        <div className="w-full max-w-4xl">
          <RecentSpins />
        </div>

      </div>

      {/* Floating Animated modals */}
      <ResultModal />
    </div>
  );
}
