"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/store/useGameStore";
import { triggerConfetti } from "@/components/animations/Confetti";
import { Skull, RotateCcw, X } from "lucide-react";

const MEME_CAPTIONS = [
  "RIZZTAX: You're paying the entire bill! 💸",
  "NO CAP: Your bank account is about to cry! 💀",
  "L + RATIO: Time to buy everybody's dinner! 💳",
  "SUS: Tried to hide in the bathroom, but fate found you! 🤫",
  "COPE HARDER: Get that credit card sliding! 🎭",
  "EMOTIONAL DAMAGE: Absolute rip to your savings! 💔",
  "IT'S A SETUP: The universe chose violence today! ⚡💀",
  "SHEESH: Congratulations, you're the designated sugar daddy! 💅"
];

export default function ResultModal() {
  const { winner, setWinner } = useGameStore();

  // Trigger confetti when a new winner is selected (no state updates inside)
  useEffect(() => {
    if (winner) {
      triggerConfetti();
    }
  }, [winner]);

  const handleClose = () => {
    setWinner(null, null);
  };

  // Compute caption deterministically from the winner's name to avoid state updates in effect
  const captionIndex = winner
    ? Array.from(winner).reduce((acc, char) => acc + char.charCodeAt(0), 0) % MEME_CAPTIONS.length
    : 0;
  const caption = winner ? MEME_CAPTIONS[captionIndex] : "";

  return (
    <AnimatePresence>
      {winner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-[#07050f]/80 backdrop-blur-md"
          />

          {/* Modal Box */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ 
              scale: 1, 
              opacity: 1, 
              y: 0,
              transition: { type: "spring", stiffness: 300, damping: 25 }
            }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl glass-panel-glow-pink p-8 text-center z-10 border border-neon-pink/30 shadow-[0_0_50px_rgba(255,0,122,0.25)]"
          >
            {/* Corner Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
            >
              <X size={20} />
            </button>

            {/* Glowing Accent Ring Background */}
            <div className="absolute -top-12 -left-12 w-32 h-32 bg-neon-pink/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-neon-purple/10 rounded-full blur-2xl pointer-events-none" />

            {/* Dramatic Icon Swell */}
            <motion.div
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1, transition: { delay: 0.15, type: "spring" } }}
              className="mx-auto w-20 h-20 bg-gradient-to-tr from-neon-pink to-neon-purple rounded-2xl flex items-center justify-center shadow-lg shadow-neon-pink/20 mb-6"
            >
              <Skull className="text-white w-10 h-10 animate-bounce" />
            </motion.div>

            {/* Title / Announcement */}
            <h3 className="text-sm font-mono tracking-widest text-neon-cyan uppercase mb-2">
              🚨 FATE HAS SPOKEN 🚨
            </h3>

            <motion.h2
              initial={{ scale: 0.9 }}
              animate={{ scale: [0.9, 1.1, 1], transition: { duration: 0.5 } }}
              className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-neon-pink to-white tracking-tight leading-none mb-4 break-words px-2"
            >
              {winner}
            </motion.h2>

            {/* Meme Caption Card */}
            <div className="bg-[#120e29] border border-white/5 rounded-2xl p-4 mb-8 relative">
              <span className="absolute -top-3 left-4 bg-neon-purple text-[10px] font-mono tracking-wider text-white px-2 py-0.5 rounded-full border border-white/10">
                MEME ANALYSIS
              </span>
              <p className="text-sm text-gray-300 font-medium pt-1">
                {caption}
              </p>
            </div>

            {/* Modal Controls / Call to Action */}
            <div className="flex flex-col gap-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClose}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-neon-pink to-neon-purple text-white font-extrabold text-sm tracking-wider flex items-center justify-center gap-2 hover:shadow-[0_0_25px_rgba(255,0,122,0.5)] transition-all cursor-pointer shadow-md"
              >
                <RotateCcw size={16} />
                SPIN AGAIN ⚡
              </motion.button>
              
              <button
                onClick={handleClose}
                className="w-full py-3 px-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs font-mono tracking-widest text-gray-400 hover:text-white transition-all cursor-pointer"
              >
                CLOSE WINDOW
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
