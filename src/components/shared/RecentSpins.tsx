"use client";

import { useEffect, useState } from "react";
import { useGameStore } from "@/store/useGameStore";
import { motion, AnimatePresence } from "framer-motion";
import { History, RefreshCw, AlertCircle } from "lucide-react";

type Tab = "spin" | "dice";

function getInitials(name: string) {
  return (
    name
      .replace(/\p{Emoji}/gu, "")
      .trim()
      .split(" ")
      .map((w) => w[0] ?? "")
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?"
  );
}

const AVATAR_COLORS = [
  "#ff4081", "#2979ff", "#00c853", "#ff6d00",
  "#6c3bff", "#00bcd4", "#f44336", "#ffd600",
];

export default function RecentSpins() {
  const { spinHistory, fetchHistory } = useGameStore();
  const [activeTab, setActiveTab] = useState<Tab>("spin");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    await fetchHistory();
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatTime = (iso: string) => {
    try {
      return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "Just now";
    }
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString([], { month: "short", day: "numeric" });
    } catch {
      return "";
    }
  };

  const filteredHistory = spinHistory.filter((spin) => (spin.type || "spin") === activeTab);

  return (
    <section
      id="history"
      className="rounded-2xl border p-5"
      style={{
        background: "var(--card-bg)",
        borderColor: "var(--card-border)",
        boxShadow: "0 2px 16px var(--card-shadow)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
            style={{ background: "var(--accent-light)" }}
          >
            🕐
          </div>
          <div>
            <h3 className="font-black text-sm" style={{ color: "var(--foreground)" }}>
              History
            </h3>
            <p className="text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>
              Recent rounds
            </p>
          </div>
        </div>

        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl transition-all"
          style={{ background: "var(--accent-light)", color: "var(--text-accent)" }}
        >
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="tab-toggle mb-4">
        <button
          id="tab-spin"
          onClick={() => setActiveTab("spin")}
          className={`tab-btn ${activeTab === "spin" ? "active" : ""}`}
        >
          🎰 Spin Wheel
        </button>
        <button
          id="tab-dice"
          onClick={() => setActiveTab("dice")}
          className={`tab-btn ${activeTab === "dice" ? "active" : ""}`}
        >
          🎲 Dice Rolls
        </button>
      </div>

      {/* Content */}
      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
        <AnimatePresence mode="wait">
          {filteredHistory.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-8 text-center flex flex-col items-center gap-3"
            >
              <AlertCircle size={28} style={{ color: "var(--sub-accent)" }} />
              <p className="text-xs font-bold" style={{ color: "var(--text-muted)" }}>
                No rounds yet!
              </p>
              <p className="text-[10px] font-semibold" style={{ color: "var(--sub-accent)" }}>
                {activeTab === "spin" ? "Spin the wheel to get started." : "Roll the dice to get started."}
              </p>
            </motion.div>
          ) : (
            filteredHistory.map((spin, idx) => {
              const avatarColor = AVATAR_COLORS[idx % AVATAR_COLORS.length];
              const initials = getInitials(spin.winner);
              return (
                <motion.div
                  key={spin.id || idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18, delay: idx * 0.04 }}
                  className="flex items-center gap-3 p-3 rounded-2xl transition-all cursor-default"
                  style={{
                    background: "var(--recent-bg)",
                    border: "1.5px solid var(--recent-border)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "var(--accent-light)";
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--card-border)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "var(--recent-bg)";
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--recent-border)";
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                    style={{ background: avatarColor }}
                  >
                    {initials}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-black text-xs truncate" style={{ color: "var(--foreground)" }}>
                        {spin.winner}
                      </span>
                      <span className={spin.type === "dice" ? "badge-dice" : "badge-paid"}>
                        {spin.type === "dice" ? "🎲 Dice" : "Paid"}
                      </span>
                    </div>
                    <p
                      className="text-[10px] font-semibold truncate"
                      style={{ color: "var(--text-muted)", maxWidth: 240 }}
                    >
                      {spin.type === "dice" && spin.dice1 !== undefined && spin.dice2 !== undefined
                        ? `Rolled ${spin.dice1} + ${spin.dice2} = ${spin.dice1 + spin.dice2} · (${spin.participants.slice(0, 3).join(", ")}${spin.participants.length > 3 ? "…" : ""})`
                        : spin.participants.slice(0, 4).join(", ")}
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="text-[10px] font-bold" style={{ color: "var(--text-muted)" }}>
                      {formatTime(spin.createdAt)}
                    </p>
                    <p className="text-[9px] font-semibold" style={{ color: "var(--sub-accent)" }}>
                      {formatDate(spin.createdAt)}
                    </p>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      {filteredHistory.length > 0 && (
        <div
          className="mt-3 pt-3 flex items-center justify-between text-[10px] font-bold"
          style={{ borderTop: "1.5px solid var(--recent-border)", color: "var(--sub-accent)" }}
        >
          <div className="flex items-center gap-1">
            <History size={11} />
            <span>{filteredHistory.length} rounds in this tab</span>
          </div>
          <span style={{ color: "#00c853" }}>● Live</span>
        </div>
      )}
    </section>
  );
}
