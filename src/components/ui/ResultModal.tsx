"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/store/useGameStore";
import { triggerConfetti } from "@/components/animations/Confetti";
import { RotateCcw, X, Share2 } from "lucide-react";

const FUN_CAPTIONS = [
  "Better luck next time! 😅",
  "Fate has spoken — time to pay up! 💸",
  "The wheel never lies! 🎰",
  "No escaping this one! 💳",
  "The dice gods have decided! 🎲",
  "Your wallet's worst nightmare! 😂",
  "Treat everyone well — you're paying! 🍽️",
  "Next time, bring cash! 💰",
];

export default function ResultModal() {
  const { winner, setWinner, setView, lastGameType } = useGameStore();

  useEffect(() => {
    if (winner) triggerConfetti();
  }, [winner]);

  const handleClose = () => {
    setWinner(null, null);
    setView("home");
  };

  const handleNextRound = () => {
    setWinner(null, null);
    setView(lastGameType === "dice" ? "dice" : "spin");
  };

  const captionIndex = winner
    ? Array.from(winner).reduce((acc, c) => acc + c.charCodeAt(0), 0) % FUN_CAPTIONS.length
    : 0;
  const caption = winner ? FUN_CAPTIONS[captionIndex] : "";

  return (
    <AnimatePresence>
      {winner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0"
            style={{ background: "rgba(10,5,30,0.72)", backdropFilter: "blur(10px)" }}
          />

          {/* Card */}
          <motion.div
            initial={{ scale: 0.65, opacity: 0, y: 60 }}
            animate={{
              scale: 1,
              opacity: 1,
              y: 0,
              transition: { type: "spring", stiffness: 340, damping: 22 },
            }}
            exit={{ scale: 0.65, opacity: 0, y: 60 }}
            className="relative w-full overflow-hidden z-10 text-center"
            style={{
              maxWidth: 380,
              borderRadius: 28,
              background: "var(--card-bg)",
              border: "1px solid var(--card-border)",
              boxShadow: "0 24px 80px rgba(108,59,255,0.35), 0 4px 16px rgba(0,0,0,0.15)",
            }}
          >
            {/* Purple top banner */}
            <div
              className="relative px-6 pt-8 pb-6"
              style={{ background: "linear-gradient(135deg, #6c3bff 0%, #4f28cc 100%)" }}
            >
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-white/30"
                style={{ background: "rgba(255,255,255,0.18)", color: "#fff" }}
              >
                <X size={15} />
              </button>

              {/* Animated mascot */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{
                  scale: 1,
                  rotate: 0,
                  transition: { delay: 0.15, type: "spring", stiffness: 280 },
                }}
                className="mx-auto mb-3 w-20 h-20 rounded-full flex items-center justify-center text-5xl select-none"
                style={{
                  background: "rgba(255,255,255,0.18)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
                }}
              >
                😝
              </motion.div>

              <p className="text-white/80 text-[10px] font-black uppercase tracking-widest">
                🎉 We Have a Winner!
              </p>
            </div>

            {/* White/card bottom */}
            <div className="px-6 py-6">
              {/* Winner name with bounce */}
              <motion.h2
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{
                  scale: [0.7, 1.08, 1],
                  opacity: 1,
                  transition: { duration: 0.5, delay: 0.2 },
                }}
                className="font-black leading-tight mb-1"
                style={{ fontSize: 30, color: "var(--foreground)" }}
              >
                {winner} Pays!
              </motion.h2>

              <p
                className="text-xs font-semibold mb-5"
                style={{ color: "var(--text-muted)" }}
              >
                {caption}
              </p>

              {/* Trophy row */}
              <div
                className="flex items-center justify-center gap-3 p-3.5 rounded-2xl mb-5"
                style={{ background: "var(--accent-light)" }}
              >
                <span className="text-2xl">👑</span>
                <div className="text-left">
                  <p className="font-black text-sm" style={{ color: "var(--text-accent)" }}>
                    {winner}
                  </p>
                  <p className="text-[10px] font-bold" style={{ color: "var(--text-muted)" }}>
                    Designated payer of the night
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-2.5">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleNextRound}
                  className="btn-primary w-full justify-center rounded-2xl"
                  style={{ fontSize: 14 }}
                >
                  <RotateCcw size={15} />
                  Next Round
                </motion.button>

                <button
                  onClick={handleClose}
                  className="w-full py-3 px-5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all"
                  style={{
                    background: "var(--accent-light)",
                    color: "var(--text-accent)",
                    border: "2px solid var(--card-border)",
                  }}
                >
                  <Share2 size={13} />
                  Share Result
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
