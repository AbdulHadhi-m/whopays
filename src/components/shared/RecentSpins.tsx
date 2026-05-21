"use client";

import { useEffect } from "react";
import { useGameStore } from "@/store/useGameStore";
import { motion, AnimatePresence } from "framer-motion";
import { History, Calendar, Flame, AlertCircle } from "lucide-react";

export default function RecentSpins() {
  const { spinHistory, fetchHistory } = useGameStore();

  // Load history on client mount
  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "Just now";
    }
  };

  return (
    <div className="w-full glass-panel rounded-3xl p-6 border border-white/5 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-neon-cyan/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-neon-cyan/10 rounded-xl border border-neon-cyan/20">
          <History className="text-neon-cyan w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white tracking-wide">
            Wall of Shame
          </h3>
          <p className="text-xs text-gray-400 font-mono tracking-wider uppercase">
            Recent Victims Feed
          </p>
        </div>
      </div>

      {/* Content Feed */}
      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {spinHistory.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-8 text-center text-gray-500 flex flex-col items-center justify-center gap-2"
            >
              <AlertCircle size={24} className="text-neon-purple/50" />
              <p className="text-xs font-mono">NO VICTIMS LOGGED YET</p>
            </motion.div>
          ) : (
            spinHistory.map((spin, idx) => (
              <motion.div
                key={spin.id || idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="p-4 rounded-2xl bg-[#0f0b24] border border-white/5 flex items-center justify-between hover:border-neon-purple/30 hover:bg-[#130d2d] transition-all duration-300"
              >
                <div className="flex-1 min-w-0 pr-4">
                  {/* Winner / Loser Name */}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-extrabold text-neon-pink truncate">
                      {spin.winner}
                    </span>
                    <span className="text-[9px] font-mono bg-neon-pink/10 border border-neon-pink/20 text-neon-pink px-2 py-0.5 rounded-full tracking-widest uppercase scale-90">
                      Paid 💸
                    </span>
                  </div>

                  {/* Participants Count / Names */}
                  <p className="text-xs text-gray-400 truncate max-w-[220px]">
                    Group: {spin.participants.join(", ")}
                  </p>
                </div>

                {/* Time Stamp */}
                <div className="text-right flex flex-col items-end shrink-0">
                  <div className="flex items-center gap-1 text-[10px] text-gray-400 font-mono">
                    <Calendar size={10} className="text-neon-cyan" />
                    <span>{formatTime(spin.createdAt)}</span>
                  </div>
                  <span className="text-[9px] text-gray-500 font-mono tracking-widest mt-1">
                    {spin.participants.length} PLAYERS
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Footer statistics decoration */}
      {spinHistory.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-gray-500">
          <div className="flex items-center gap-1">
            <Flame size={12} className="text-orange-500 animate-pulse" />
            <span>TOTAL SPINS: {spinHistory.length}</span>
          </div>
          <span>UPDATES LIVE</span>
        </div>
      )}
    </div>
  );
}
