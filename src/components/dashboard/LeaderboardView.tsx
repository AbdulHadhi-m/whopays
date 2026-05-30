"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Settings,
  Trophy,
  Sparkles,
  ChevronRight,
  Share2,
  TrendingUp,
  Users,
  Zap,
  Crown,
  Star,
  Medal,
  Gift,
} from "lucide-react";
import { useGameStore } from "@/store/useGameStore";
import { soundManager } from "@/components/shared/SoundManager";

interface LeaderboardEntry {
  rank: number;
  name: string;
  wins: number;
  emoji: string;
  isYou: boolean;
}

const rankGradients: Record<number, string> = {
  1: "from-amber-400 via-yellow-300 to-orange-400",
  2: "from-slate-300 via-gray-200 to-zinc-300",
  3: "from-amber-600 via-orange-500 to-rose-500",
};

const rankColors: Record<number, string> = {
  4: "#3b82f6",
  5: "#fbbf24",
  6: "#2dd4bf",
  7: "#f472b6",
};

function getRankColor(rank: number): string {
  if (rank <= 7) return rankColors[rank] ?? "#94a3b8";
  return "#94a3b8";
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -30, scale: 0.95 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 180, damping: 16 },
  },
};

export default function LeaderboardView() {
  const {
    setView,
    groups,
    activeGroupId,
    spinHistory,
    participants,
  } = useGameStore();

  const activeGroup = groups.find((g) => g.id === activeGroupId) || groups[0];

  const entries: LeaderboardEntry[] = useMemo(() => {
    const winCounts: Record<string, number> = {};

    spinHistory.forEach((record) => {
      const w = record.winner;
      winCounts[w] = (winCounts[w] || 0) + 1;
    });

    const pool = activeGroup?.members.length
      ? activeGroup.members
      : participants;

    const defaultEmojis = ["😎", "🌟", "🎉", "🔥", "💫", "👆", "🧁", "🦄", "🪐", "✨"];

    const ranked = pool.map((name, i) => ({
      name,
      wins: winCounts[name] || 0,
      emoji: defaultEmojis[i % defaultEmojis.length],
      isYou: name.toLowerCase().includes("you"),
    }));

    ranked.sort((a, b) => b.wins - a.wins);

    return ranked.map((entry, i) => ({
      ...entry,
      rank: i + 1,
    }));
  }, [spinHistory, activeGroup, participants]);

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);
  const maxWins = Math.max(...entries.map((e) => e.wins), 1);

  const totalRounds = activeGroup?.rounds ?? spinHistory.length;

  const handleShare = async () => {
    const text = `🏆 WhoPay Leaderboard\n\n${entries
      .slice(0, 5)
      .map(
        (e) =>
          `#${e.rank} ${e.name} — ${e.wins} win${e.wins !== 1 ? "s" : ""}`
      )
      .join("\n")}\n\nCan you beat the champ?`;

    if (navigator.share) {
      try {
        await navigator.share({ title: "WhoPay Leaderboard", text });
        soundManager.playTick();
        return;
      } catch {}
    }
    await navigator.clipboard?.writeText(text);
    soundManager.playTick();
  };

  return (
    <div className="flex-1 flex flex-col bg-[#faf8ff] dark:bg-[#0a0a1a] pb-16 relative overflow-hidden transition-colors duration-300">
      {/* Light mode background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/60 via-sky-50/30 to-transparent dark:hidden" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(59,130,246,0.06),transparent_60%)] dark:hidden" />

      {/* Dark mode background */}
      <div className="hidden dark:block absolute inset-0 bg-gradient-to-b from-[#0f0f2e] via-[#0a1a3e] to-[#0a0a1a]" />
      <div className="hidden dark:block absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(59,130,246,0.15),transparent_60%)]" />
      <div className="hidden dark:block absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(59,130,246,0.1),transparent_60%)]" />

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${30 + i * 20}px`,
              height: `${30 + i * 20}px`,
              left: `${15 + i * 18}%`,
              top: `${10 + (i % 3) * 30}%`,
              background: i % 2 === 0
                ? `radial-gradient(circle, rgba(59,130,246,${0.08 - i * 0.01}), transparent)`
                : `radial-gradient(circle, rgba(56,189,248,${0.08 - i * 0.01}), transparent)`,
            }}
            animate={{
              y: [0, -(15 + i * 5), 0],
              x: [0, (i % 2 === 0 ? 1 : -1) * (8 + i * 3), 0],
              scale: [1, 1.1 + i * 0.03, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 5 + i * 1.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.6,
            }}
          />
        ))}
      </div>

      {/* Subtle grid overlay - dark only */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none hidden dark:block"
        style={{
          backgroundImage:
            "linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-5 pt-6 pb-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => { soundManager.playTick(); setView("home"); }}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-white/5 shadow-lg dark:backdrop-blur-md border border-blue-100 dark:border-white/10 text-slate-500 dark:text-white/60 hover:text-blue-600 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-white/10 transition-all"
        >
          <ArrowLeft size={18} />
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 14 }}
          className="flex items-center gap-3"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: [0, -12, 12, -12, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Trophy size={22} className="text-amber-500 dark:text-amber-400" fill="#f59e0b" />
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-3 h-3"
            >
              <Sparkles size={12} className="text-amber-400 dark:text-amber-300" />
            </motion.div>
          </div>
          <h1 className="text-xl font-black tracking-wide text-slate-900 dark:text-transparent dark:bg-gradient-to-r dark:from-white dark:via-blue-200 dark:to-amber-200 dark:bg-clip-text">
            Leaderboard
          </h1>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => { soundManager.playTick(); setView("settings"); }}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-white/5 shadow-lg dark:backdrop-blur-md border border-blue-100 dark:border-white/10 text-slate-500 dark:text-white/60 hover:text-blue-600 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-white/10 transition-all"
        >
          <Settings size={18} />
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="relative z-10 px-4 mb-5">
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { icon: Users, value: entries.length, label: "Players", lightBg: "from-blue-100 to-blue-50", darkBg: "from-blue-500/20 to-blue-600/10", iconColor: "#3b82f6", textColor: "text-blue-700 dark:text-blue-200" },
            { icon: TrendingUp, value: totalRounds, label: "Rounds", lightBg: "from-blue-100 to-blue-50", darkBg: "from-blue-500/20 to-blue-600/10", iconColor: "#60a5fa", textColor: "text-blue-700 dark:text-blue-200" },
            { icon: Zap, value: maxWins, label: "Best", lightBg: "from-amber-100 to-amber-50", darkBg: "from-amber-500/20 to-amber-600/10", iconColor: "#f59e0b", textColor: "text-amber-700 dark:text-amber-200" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08, type: "spring", stiffness: 200, damping: 16 }}
              className={`relative rounded-2xl p-3.5 bg-gradient-to-br ${stat.lightBg} ${stat.darkBg} backdrop-blur border border-blue-100/50 dark:border-white/5 overflow-hidden`}
            >
              <motion.div
                className="absolute -top-3 -right-3 w-12 h-12 rounded-full opacity-20"
                style={{ background: `radial-gradient(circle, ${stat.iconColor}, transparent)` }}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
              />
              <stat.icon size={16} style={{ color: stat.iconColor }} />
              <p className={`text-lg font-black mt-1.5 relative z-10 ${stat.textColor}`}>
                {stat.value}
              </p>
              <p className="text-[10px] font-semibold text-slate-500 dark:text-white/40 uppercase tracking-wider relative z-10">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Podium Section */}
      <div className="relative z-10 px-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="relative rounded-3xl bg-white/70 dark:bg-white/[0.07] backdrop-blur-xl dark:backdrop-blur-xl border border-blue-100/50 dark:border-white/5 p-5 overflow-hidden shadow-lg dark:shadow-none"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.04),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.08),transparent_70%)]" />

          <div className="relative flex items-end justify-center gap-3">
            {/* 2nd */}
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 180, damping: 14 }}
              className="flex flex-col items-center flex-1"
            >
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                className="flex flex-col items-center"
              >
                <div className="relative mb-1">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-300 via-gray-200 to-zinc-300 flex items-center justify-center text-xl shadow-lg">
                    🥈
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7, type: "spring" }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-slate-300 to-gray-400 rounded-full flex items-center justify-center text-[9px] font-black text-slate-800 shadow-lg"
                  >
                    2
                  </motion.div>
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {top3[1]?.name ?? "—"}
                </span>
                <span className="text-[9px] text-slate-400 dark:text-white/40 mt-0.5 flex items-center gap-1">
                  <Star size={10} className="text-slate-400 dark:text-slate-300" />
                  {top3[1]?.wins ?? 0} wins
                </span>
              </motion.div>
              <div className="w-full h-14 mt-2 rounded-xl bg-gradient-to-t from-slate-200 dark:from-slate-300/20 to-transparent border border-slate-200 dark:border-slate-300/10 flex items-center justify-center">
                <Medal size={16} className="text-slate-400" />
              </div>
            </motion.div>

            {/* 1st */}
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 180, damping: 14 }}
              className="flex flex-col items-center flex-1 -mt-5"
            >
              <motion.div
                animate={{ y: [0, -7, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="flex flex-col items-center"
              >
                <motion.div
                  animate={{ rotate: [-4, 4, -4], scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-lg mb-1"
                >
                  👑
                </motion.div>
                <div className="relative mb-1">
                  <div className="w-[60px] h-[60px] rounded-2xl bg-gradient-to-br from-amber-400 via-yellow-300 to-orange-400 flex items-center justify-center text-2xl shadow-[0_0_30px_rgba(251,191,36,0.25)] relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                    🥇
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-[10px] font-black text-amber-950 shadow-xl"
                  >
                    1
                  </motion.div>
                  {[...Array(2)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2"
                      style={{ [i === 0 ? "top" : "bottom"]: -4, [i === 0 ? "left" : "right"]: -4 }}
                      animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.4 }}
                    >
                      <Sparkles size={10} className="text-amber-400" />
                    </motion.div>
                  ))}
                </div>
                <span className="text-sm font-black text-amber-600 dark:text-amber-300">
                  {top3[0]?.name ?? "—"}
                </span>
                <span className="text-[9px] text-slate-400 dark:text-white/40 mt-0.5 flex items-center gap-1">
                  <Crown size={10} className="text-amber-500 dark:text-amber-400" />
                  {top3[0]?.wins ?? 0} wins
                </span>
              </motion.div>
              <div className="w-full h-[76px] mt-2 rounded-xl bg-gradient-to-t from-amber-200 dark:from-amber-400/30 via-amber-100/50 dark:via-amber-400/10 to-transparent border border-amber-200 dark:border-amber-400/20 flex items-center justify-center shadow-[0_0_20px_rgba(251,191,36,0.08)]">
                <div className="text-center">
                  <span className="block text-sm font-black text-amber-600 dark:text-amber-300">#1</span>
                  <span className="block text-[9px] font-bold text-amber-500/60 dark:text-amber-400/60 tracking-wider uppercase">Champion</span>
                </div>
              </div>
            </motion.div>

            {/* 3rd */}
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.45, type: "spring", stiffness: 180, damping: 14 }}
              className="flex flex-col items-center flex-1"
            >
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="flex flex-col items-center"
              >
                <div className="relative mb-1">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-600 via-orange-500 to-rose-500 flex items-center justify-center text-lg shadow-lg">
                    🥉
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.9, type: "spring" }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-amber-600 to-rose-500 rounded-full flex items-center justify-center text-[8px] font-black text-white shadow-lg"
                  >
                    3
                  </motion.div>
                </div>
                <span className="text-xs font-bold text-orange-600 dark:text-orange-300">
                  {top3[2]?.name ?? "—"}
                </span>
                <span className="text-[9px] text-slate-400 dark:text-white/40 mt-0.5 flex items-center gap-1">
                  <Gift size={10} className="text-orange-400 dark:text-orange-300" />
                  {top3[2]?.wins ?? 0} wins
                </span>
              </motion.div>
              <div className="w-full h-11 mt-2 rounded-xl bg-gradient-to-t from-orange-100 dark:from-orange-500/15 to-transparent border border-orange-100 dark:border-orange-500/10 flex items-center justify-center">
                <Medal size={14} className="text-orange-400" />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Ranked List */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4">
        {rest.length > 0 && (
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-[11px] font-bold text-slate-400 dark:text-white/30 uppercase tracking-[0.15em]">
              Rankings
            </h2>
            <span className="text-[10px] text-slate-400 dark:text-white/20 font-medium">
              {rest.length} players
            </span>
          </div>
        )}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-2"
        >
          {rest.map((entry, idx) => {
            const progressPct = (entry.wins / maxWins) * 100;
            const barColor = getRankColor(entry.rank);

            return (
              <motion.div
                key={entry.name}
                variants={itemVariants}
                whileHover={{ scale: 1.015, y: -1 }}
                className={`group relative p-3 rounded-2xl bg-white dark:bg-white/[0.04] shadow-sm dark:shadow-none backdrop-blur-sm dark:backdrop-blur-sm border border-slate-100 dark:border-white/[0.06] hover:bg-slate-50 dark:hover:bg-white/[0.07] hover:border-slate-200 dark:hover:border-white/10 transition-all cursor-pointer overflow-hidden ${
                  entry.isYou ? "ring-1 ring-blue-400/40 dark:ring-blue-500/30 bg-blue-50/50 dark:bg-blue-500/5" : ""
                }`}
              >
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `linear-gradient(135deg, ${barColor}08, transparent 60%)` }}
                />

                <div className="relative flex items-center gap-3">
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    {/* Rank badge */}
                    <div className="relative">
                      <motion.div
                        whileHover={{ scale: 1.15, rotate: 8 }}
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-sm shadow-lg flex-shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${barColor}, ${barColor}dd)`,
                        }}
                      >
                        {entry.emoji}
                      </motion.div>
                      <div
                        className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-black text-white shadow-lg"
                        style={{ background: barColor }}
                      >
                        {entry.rank}
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-slate-800 dark:text-white/90 truncate">
                          {entry.name}
                        </span>
                        {entry.isYou && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-[8px] font-black text-blue-600 dark:text-blue-300 bg-blue-100 dark:bg-blue-500/20 px-1.5 py-0.5 rounded-full flex-shrink-0 border border-blue-200 dark:border-blue-500/20"
                          >
                            YOU
                          </motion.span>
                        )}
                      </div>

                      {/* Progress bar */}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] font-semibold text-slate-400 dark:text-white/30">#{entry.rank}</span>
                        <div className="flex-1 max-w-[80px] h-1 bg-slate-100 dark:bg-white/[0.06] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPct}%` }}
                            transition={{ delay: 0.4 + idx * 0.05, duration: 0.8, ease: "easeOut" }}
                            className="h-full rounded-full relative overflow-hidden"
                            style={{ background: `linear-gradient(90deg, ${barColor}, ${barColor}88)` }}
                          >
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                              animate={{ x: ["-100%", "100%"] }}
                              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: idx * 0.1 }}
                            />
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + idx * 0.05 }}
                      className="text-[10px] font-bold text-slate-500 dark:text-white/40 bg-slate-50 dark:bg-white/[0.04] px-2.5 py-1 rounded-full border border-slate-100 dark:border-white/[0.04] group-hover:bg-slate-100 dark:group-hover:bg-white/10 group-hover:border-slate-200 dark:group-hover:border-white/10 group-hover:text-slate-700 dark:group-hover:text-white/70 transition-all"
                    >
                      {entry.wins} win{entry.wins !== 1 ? "s" : ""}
                    </motion.div>
                    <motion.div
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: idx * 0.15, ease: "easeInOut" }}
                      className="text-slate-300 dark:text-white/20 group-hover:text-slate-500 dark:group-hover:text-white/40 transition-colors"
                    >
                      <ChevronRight size={14} />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {rest.length === 0 && entries.length > 3 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-xs font-medium text-slate-400 dark:text-white/20 py-8"
          >
            No more rankings yet. Play some rounds!
          </motion.p>
        )}

        {entries.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center py-16"
          >
            <motion.div
              animate={{ y: [0, -8, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="text-5xl mb-4 inline-block"
            >
              🏆
            </motion.div>
            <p className="text-sm font-bold text-slate-400 dark:text-white/30">
              No data yet. Start playing to build the leaderboard!
            </p>
          </motion.div>
        )}
      </div>

      {/* Share Button */}
      <div className="relative z-10 px-4 mt-4">
        <motion.button
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleShare}
          className="group relative w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500 text-white font-bold text-sm shadow-lg dark:shadow-[0_0_30px_rgba(59,130,246,0.25)] overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-[-20deg]"
            animate={{ x: ["-150%", "150%"] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <span className="relative z-10 flex items-center justify-center gap-2.5">
            <Share2 size={16} />
            <span>Share Leaderboard</span>
            <Sparkles size={14} className="text-blue-200" />
          </span>
        </motion.button>
      </div>

      <div className="h-5" />
    </div>
  );
}
