"use client";

import { useState, useEffect } from "react";
import { useGameStore } from "@/store/useGameStore";
import { soundManager } from "@/components/shared/SoundManager";
import SpinWheel from "@/components/wheel/SpinWheel";
import DiceView from "@/components/dashboard/DiceView";
import { motion, AnimatePresence } from "framer-motion";
import {
  Volume2, VolumeX, Plus, Users, ArrowLeft, Settings, 
  Trophy, History,   User, Heart, Share2, Info, LogOut, Check, ChevronRight, Pencil, UserPlus, RefreshCw, AlertTriangle, Sparkles, Trash2
} from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";
import HomeView from "@/components/dashboard/HomeView";
import ResultView from "@/components/dashboard/ResultView";
import GroupView from "@/components/dashboard/GroupView";
import SettingsView from "@/components/dashboard/SettingsView";
import LeaderboardView from "@/components/dashboard/LeaderboardView";

// AVATAR COLORS FOR GROUP SCREEN AND OTHERS
const AVATAR_COLORS = [
  "#ff4081", "#2979ff", "#00c853", "#ff6d00",
  "#6c3bff", "#00bcd4", "#f44336", "#ffd600",
];

export default function WhoPayAppRouter() {
  const {
    participants,
    addParticipant,
    removeParticipant,
    clearParticipants,
    isSpinning,
    triggerSpin,
    winner,
    setWinner,
    currentView,
    setView,
    theme,
    toggleTheme,
    diceMode,
    groups,
    activeGroupId,
    setActiveGroupId,
    createGroup,
    joinGroup,
    memeTopText,
    memeBottomText,
    setMemeText,
    achievements,
    userXP,
    userLevel,
    soundEnabled,
    setSoundEnabled,
    vibrationEnabled,
    setVibrationEnabled,
    notificationsEnabled,
    setNotificationsEnabled,
    spinHistory,
    fetchHistory,
  } = useGameStore();

  const [newPlayerName, setNewPlayerName] = useState("");
  const [inviteCodeInput, setInviteCodeInput] = useState(["", "", "", "", "", ""]);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupMembers, setNewGroupMembers] = useState<string[]>([]);
  const [vibeSelected, setVibeSelected] = useState("🎉");
  const [tempMemeTop, setTempMemeTop] = useState(memeTopText);
  const [tempMemeBottom, setTempMemeBottom] = useState(memeBottomText);
  const [trollTab, setTrollTab] = useState<"roasts" | "memes" | "challenges">("roasts");
  const [roastsList, setRoastsList] = useState([
    { name: "Alex 😎", roast: "Wallet crying again? Bro is the official ATM! 😂", likes: 24 },
    { name: "Sam 🎉", roast: "Professional bill dodger. Run fast when the bill comes! 🏃‍♂️💨", likes: 18 },
    { name: "Jamie 🌟", roast: "Card declined? Better start washing the dishes! 🍽️🧼", likes: 42 },
  ]);
  const [newRoastText, setNewRoastText] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    if (vibrationEnabled && typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(100);
    }
    setTimeout(() => setShowToast(false), 2000);
  };

  // Redirect to Result view if winner is determined
  useEffect(() => {
    if (winner && currentView !== "result") {
      setView("result");
    }
  }, [winner, currentView, setView]);

  // Handle player add
  const handleAddPlayer = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const name = newPlayerName.trim();
    if (!name) return;
    if (name.length > 15) {
      triggerToast("Name is too long!");
      return;
    }
    soundManager.playTick();
    addParticipant(name);
    setNewPlayerName("");
    triggerToast(`Added ${name}!`);
  };

  const handleSpinClick = async () => {
    if (participants.length < 2 || isSpinning) return;
    soundManager.playTick();
    await triggerSpin();
  };

  const activeGroup = groups.find((g) => g.id === activeGroupId) || groups[0];

  // Render back button header
  const renderHeader = (title: string, backToView: string = "home") => (
    <div className="flex items-center justify-between px-4 py-3 bg-white/70 dark:bg-[#12122a]/80 backdrop-blur-xl border-b border-[#7c3aed]/20 sticky top-0 z-20">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          soundManager.playTick();
          setView(backToView);
        }}
        className="w-9 h-9 rounded-xl bg-white/60 dark:bg-[#1a1a3e]/60 backdrop-blur border border-[#7c3aed]/20 flex items-center justify-center shadow-[0_0_12px_rgba(124,58,237,0.15)]"
        style={{ color: "var(--foreground)" }}
      >
        <ArrowLeft size={16} />
      </motion.button>
      <span className="font-black text-sm bg-gradient-to-r from-[#7c3aed] to-[#ec4899] bg-clip-text text-transparent">{title}</span>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          soundManager.playTick();
          setView("settings");
        }}
        className="w-9 h-9 rounded-xl bg-white/60 dark:bg-[#1a1a3e]/60 backdrop-blur border border-[#7c3aed]/20 flex items-center justify-center shadow-[0_0_12px_rgba(124,58,237,0.15)]"
        style={{ color: "var(--foreground)" }}
      >
        <Settings size={16} />
      </motion.button>
    </div>
  );

  // BOTTOM NAVIGATION BAR
  const renderBottomNav = () => {
    const tabs = [
      { icon: "🏠", label: "Home", view: "home" },
      { icon: "👥", label: "Groups", view: "group" },
      { icon: <Plus size={20} />, label: "Add", view: "create-group" },
      { icon: "🕐", label: "History", view: "history" },
      { icon: "👤", label: "Profile", view: "profile" },
    ];

    const currentTab = ["home", "spin", "dice", "result", "dice-modes"].includes(currentView)
      ? "home"
      : ["group", "join-group"].includes(currentView)
      ? "group"
      : currentView;

    return (
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-white/70 dark:bg-[#12122a]/80 backdrop-blur-xl border-t border-[#7c3aed]/20 flex items-center justify-around z-30 select-none">
        {tabs.map((tab, idx) => {
          const isActive = currentTab === tab.view || (tab.view === "create-group" && currentView === "create-group");
          return (
            <button
              key={idx}
              onClick={() => {
                soundManager.playTick();
                setView(tab.view);
              }}
              className="flex flex-col items-center justify-center flex-1 py-1 relative"
            >
              {isActive && (
                <motion.div
                  layoutId="navActive"
                  className="absolute -top-0.5 w-8 h-0.5 rounded-full bg-gradient-to-r from-[#7c3aed] to-[#ec4899] shadow-[0_0_8px_rgba(124,58,237,0.5)]"
                />
              )}
              <span className={`transition-all ${isActive ? "scale-115 text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500"}`}>
                <span className="text-xl">{tab.icon}</span>
              </span>
              <span
                className="text-[9px] font-black mt-0.5 transition-colors"
                style={{
                  color: isActive ? "#7c3aed" : "var(--text-muted)",
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    );
  };

  // VIEWS IMPLEMENTATION

  // 1. Splash Screen
  const renderSplashView = () => (
    <div className="flex-1 flex flex-col justify-between p-6 text-center bg-gradient-to-br from-[#0a0a1a] via-[#1a0a3e] to-[#0a0a1a] text-white relative overflow-hidden">
      {/* Floating particle dots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-[#7c3aed]/40"
            style={{ left: `${(i * 8.3) % 100}%`, top: `${(i * 13.7) % 100}%` }}
            animate={{ y: [0, -30, 0], opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 2 + i % 3, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
      </div>
      <div className="mt-8 flex flex-col items-center relative z-10">
        <motion.div
          animate={{ scale: [1, 1.08, 1], rotate: [0, -8, 8, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-7xl mb-4 w-28 h-28 rounded-full bg-white/5 backdrop-blur-lg border border-[#7c3aed]/30 flex items-center justify-center shadow-[0_0_40px_rgba(124,58,237,0.3)] select-none"
        >
          😜
        </motion.div>
        <h1 className="text-5xl font-black tracking-tight mb-2 bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#ff6d00] bg-clip-text text-transparent">
          WhoPay
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-white/80 font-black text-xs px-4 py-1.5 rounded-full bg-white/5 backdrop-blur border border-white/10 inline-block"
        >
          Spin it. Roll it. You pay it! 😜
        </motion.p>
      </div>

      <div className="flex flex-col gap-3 mb-4 relative z-10">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            soundManager.playTick();
            setView("home");
          }}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#7c3aed] to-[#ec4899] text-white font-black text-base shadow-[0_0_30px_rgba(124,58,237,0.4)] hover:shadow-[0_0_50px_rgba(124,58,237,0.6)] transition-all cursor-pointer"
        >
          Let's Get Started
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            soundManager.playTick();
            setView("home");
          }}
          className="w-full py-4 rounded-2xl bg-white/5 backdrop-blur-lg text-white font-bold text-sm border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
        >
          I Already Have an Account
        </motion.button>
        <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider mt-2">
          Built for fun. Made to troll. 😈
        </span>
      </div>
    </div>
  );

  // 2. Home Screen
  const renderHomeView = () => (
    <HomeView />
  );

  // 3. Spin Wheel Screen
  const renderSpinView = () => (
    <div className="flex-1 flex flex-col bg-[#eff6ff] dark:bg-[#0a0a1a] h-full pb-16 lg:pb-0">
      <div className="flex items-center justify-between px-4 py-3 bg-white/70 dark:bg-[#12122a]/80 backdrop-blur-xl border-b border-[#3b82f6]/20 sticky top-0 z-20">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            soundManager.playTick();
            setView("home");
          }}
          className="w-9 h-9 rounded-xl bg-white/60 dark:bg-[#1a1a3e]/60 backdrop-blur border border-[#3b82f6]/20 flex items-center justify-center shadow-[0_0_12px_rgba(59,130,246,0.15)]"
          style={{ color: "var(--foreground)" }}
        >
          <ArrowLeft size={16} />
        </motion.button>
        <h1 className="text-sm md:text-xl font-black uppercase tracking-wider text-[#1D2433] dark:text-white leading-none truncate">Spin the Wheel</h1>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            soundManager.playTick();
            setView("settings");
          }}
          className="w-9 h-9 rounded-xl bg-white/60 dark:bg-[#1a1a3e]/60 backdrop-blur border border-[#3b82f6]/20 flex items-center justify-center shadow-[0_0_12px_rgba(59,130,246,0.15)]"
          style={{ color: "var(--foreground)" }}
        >
          <Settings size={16} />
        </motion.button>
      </div>
      <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto min-h-0">
        {/* Active group header */}
        <div className="relative self-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            onClick={() => setShowGroupPicker(!showGroupPicker)}
            className="px-4 py-2 rounded-full bg-white/70 dark:bg-[#12122a]/80 backdrop-blur-xl border border-[#3b82f6]/20 text-xs font-black flex items-center gap-2 cursor-pointer shadow-[0_0_16px_rgba(59,130,246,0.1)] hover:shadow-[0_0_24px_rgba(59,130,246,0.2)] transition-all"
          >
            <span>👥 {activeGroup.name}</span>
            <span className="text-[10px] text-[#3b82f6] flex items-center gap-1">({participants.length}) <svg className={`w-4 h-4 transition-transform duration-300 ease-in-out ${showGroupPicker ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"/></svg></span>
          </motion.div>
          {showGroupPicker && (
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-64 bg-white dark:bg-[#12122a] rounded-2xl border border-[#3b82f6]/20 overflow-hidden shadow-xl z-50">
              {groups.map((g) => (
                <button
                  key={g.id}
                  onClick={() => { setActiveGroupId(g.id); setShowGroupPicker(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[#3b82f6]/5 ${
                    g.id === activeGroupId ? "bg-[#3b82f6]/10" : ""
                  }`}
                >
                  <span className="text-lg">{g.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-[var(--foreground)] truncate block">{g.name}</span>
                    <span className="text-[10px] text-[#3b82f6]/50">{g.members.length} members</span>
                  </div>
                  {g.id === activeGroupId && (
                    <svg className="w-4 h-4 text-[#3b82f6] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full p-4 rounded-2xl bg-white/70 dark:bg-[#12122a]/80 backdrop-blur-xl border border-[#3b82f6]/20 shadow-[0_0_16px_rgba(59,130,246,0.1)]"
        >
          <form onSubmit={handleAddPlayer} className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm">👤</span>
              <input
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                placeholder="Add player name..."
                maxLength={15}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/80 dark:bg-[#1a1a3e]/80 border border-[#3b82f6]/20 text-xs font-semibold text-[var(--foreground)] placeholder:text-[#3b82f6]/30 focus:outline-none focus:border-[#3b82f6]/50 focus:ring-2 focus:ring-[#3b82f6]/10 transition-all"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={!newPlayerName.trim()}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] text-white font-black text-xs shadow-lg shadow-[#3b82f6]/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <Plus size={18} />
            </motion.button>
            {participants.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => { soundManager.playTick(); clearParticipants(); triggerToast("Cleared all players!"); }}
                className="px-3 py-2.5 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-400 font-black text-xs border border-red-200 dark:border-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all"
              >
                <Trash2 size={16} />
              </motion.button>
            )}
          </form>

          {/* Participant Chips */}
          {participants.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {participants.map((name, idx) => (
                <motion.span
                  key={`${name}-${idx}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[10px] font-bold text-white shadow-sm"
                  style={{
                    background: `linear-gradient(135deg, ${AVATAR_COLORS[idx % AVATAR_COLORS.length]}, ${AVATAR_COLORS[(idx + 1) % AVATAR_COLORS.length]})`,
                  }}
                >
                  <span className="max-w-[80px] truncate">{name}</span>
                  <button
                    onClick={() => { soundManager.playTick(); removeParticipant(idx); }}
                    className="w-3.5 h-3.5 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-colors"
                  >
                    <span className="text-[8px] leading-none">✕</span>
                  </button>
                </motion.span>
              ))}
            </div>
          )}
        </motion.div>

        {/* Spin wheel container */}
        <div className="w-full flex items-center justify-center">
          <SpinWheel />
        </div>

        {/* Toggle options */}
        <div className="w-full p-4 rounded-2xl bg-white/70 dark:bg-[#12122a]/80 backdrop-blur-xl border border-[#3b82f6]/20 flex items-center justify-between shadow-[0_0_16px_rgba(59,130,246,0.1)]">
          <div>
            <h4 className="text-xs font-black text-[var(--foreground)]">Remove Loser</h4>
            <p className="text-[10px] text-[#3b82f6]/50 font-semibold mt-0.5">Winner leaves the list</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-9 h-5 bg-slate-200 dark:bg-[#1a1a3e] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#00c853] peer-checked:to-[#00e676] peer-checked:shadow-[0_0_12px_rgba(0,200,83,0.3)]"></div>
          </label>
        </div>

        {/* Big Spin CTA */}
        <motion.button
          whileHover={isSpinning || participants.length < 2 ? {} : { scale: 1.03 }}
          whileTap={isSpinning || participants.length < 2 ? {} : { scale: 0.97 }}
          onClick={handleSpinClick}
          disabled={isSpinning || participants.length < 2}
          className="w-full justify-center py-4 rounded-2xl font-black text-base shadow-xl flex items-center gap-2"
          style={
            isSpinning || participants.length < 2
              ? { background: "var(--sub-accent)", boxShadow: "none", cursor: "not-allowed", color: "var(--text-muted)" }
              : {
                  background: "linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)",
                  boxShadow: "0 6px 30px rgba(59, 130, 246, 0.4)",
                  color: "#ffffff",
                }
          }
        >
          {isSpinning ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
              Spinning…
            </span>
          ) : (
            <>🎰 Spin Now!</>
          )}
        </motion.button>
      </div>
    </div>
  );

  // 4. Roll Dice Screen
  const renderDiceView = () => (
    <DiceView />
  );

  // 5. Dice Modes Guide
  const renderDiceModesView = () => (
    <div className="flex-1 flex flex-col bg-[#f5f0ff] dark:bg-[#0a0a1a]">
      {renderHeader("Dice Modes", "dice")}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {[
          { title: "Classic Dice", desc: "One random person pays. Decide by rolling two dice, the sum determines the index of the payer.", icon: "🎲", color: "#7c3aed" },
          { title: "Double Dice", desc: "Two unlucky people pay. We roll and select two separate winners to split the bill in half.", icon: "👥", color: "#2979ff" },
          { title: "Lucky Escape", desc: "One person escapes! The chosen rolled player is flagged as escaped, and the remaining players spin.", icon: "🍀", color: "#00c853" },
          { title: "Chaos Dice", desc: "Unexpected crazy rules. Rolled sum determines if everyone splits (except one), or if someone pays double!", icon: "😈", color: "#ff6d00" },
          { title: "Elimination", desc: "Gradually eliminate players from the list one by one each round until only one payer remains.", icon: "💀", color: "#ec4899" },
          { title: "Troll Dice", desc: "Ultimate chaos mode. Rerolling triggers, custom penalties, and extreme bill doubling challenges.", icon: "👾", color: "#f44336" },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="p-4 rounded-2xl bg-white/70 dark:bg-[#12122a]/80 backdrop-blur-xl border border-[#7c3aed]/20 flex gap-4 items-start shadow-[0_0_12px_rgba(124,58,237,0.08)]"
            style={{ borderLeft: `4px solid ${item.color}` }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/60 to-white/20 dark:from-[#1a1a3e] dark:to-[#12122a] border border-[#7c3aed]/10 flex items-center justify-center text-xl flex-shrink-0 shadow-inner">
              {item.icon}
            </div>
            <div>
              <h3 className="font-black text-xs text-[var(--foreground)]">{item.title}</h3>
              <p className="text-[10px] font-semibold text-[#7c3aed]/60 mt-1 leading-relaxed">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  // 6. Result Screen
  const renderResultView = () => (
    <ResultView />
  );

  // 7. Group Screen
  const renderGroupView = () => (
    <GroupView />
  );

  // 8. Troll Corner
  const renderTrollView = () => (
    <div className="flex-1 flex flex-col bg-[#f5f0ff] dark:bg-[#0a0a1a] pb-16">
      {renderHeader("Troll Corner 😈")}
      
      {/* Tabs */}
      <div className="px-4 py-2 bg-white/70 dark:bg-[#12122a]/80 backdrop-blur-xl border-b border-[#7c3aed]/20 flex gap-2 select-none">
        {["roasts", "memes", "challenges"].map((tab) => (
          <button
            key={tab}
            onClick={() => setTrollTab(tab as any)}
            className={`flex-1 py-1.5 rounded-xl text-xs font-black capitalize transition-all ${
              trollTab === tab
                ? "bg-gradient-to-r from-[#7c3aed] to-[#ec4899] text-white shadow-[0_0_16px_rgba(124,58,237,0.3)]"
                : "bg-white/50 dark:bg-[#1a1a3e]/50 text-[#7c3aed]/60 border border-[#7c3aed]/20"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {trollTab === "roasts" && (
          <div className="space-y-3">
            {roastsList.map((roast, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="p-4 rounded-2xl bg-white/70 dark:bg-[#12122a]/80 backdrop-blur-xl border border-[#7c3aed]/20 relative shadow-[0_0_12px_rgba(124,58,237,0.06)]"
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#ec4899]/20 to-[#ff6d00]/20 border border-[#ec4899]/20 flex items-center justify-center text-xs">🔥</div>
                  <span className="text-xs font-black text-[var(--foreground)]">{roast.name}</span>
                </div>
                <p className="text-xs font-semibold text-[#7c3aed]/70 dark:text-[#a78bfa]/70 italic">"{roast.roast}"</p>
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-[#7c3aed]/10 text-[10px] font-bold text-[#7c3aed]/50">
                  <button 
                    onClick={() => triggerToast("Copy roast to share!")}
                    className="flex items-center gap-1 hover:text-[#ec4899] transition-colors"
                  >
                    <Share2 size={10} /> Share
                  </button>
                  <span className="text-[#ec4899]">❤️ {roast.likes} likes</span>
                </div>
              </motion.div>
            ))}
            
            {/* Create roast form */}
            <div className="p-4 rounded-2xl bg-white/70 dark:bg-[#12122a]/80 backdrop-blur border-2 border-dashed border-[#7c3aed]/30 shadow-[0_0_12px_rgba(124,58,237,0.06)]">
              <span className="text-[10px] font-bold bg-gradient-to-r from-[#7c3aed] to-[#ec4899] bg-clip-text text-transparent uppercase block mb-2">Write Roast:</span>
              <textarea
                value={newRoastText}
                onChange={(e) => setNewRoastText(e.target.value)}
                placeholder="He's official ATM today..."
                className="w-full p-2 border border-[#7c3aed]/20 rounded-xl text-xs font-bold bg-white/50 dark:bg-[#1a1a3e]/50 outline-none text-[var(--foreground)]"
                rows={2}
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (!newRoastText.trim()) return;
                  setRoastsList([
                    { name: "You 👆", roast: newRoastText.trim(), likes: 0 },
                    ...roastsList
                  ]);
                  setNewRoastText("");
                  triggerToast("Added roast to feed!");
                }}
                className="w-full mt-2 py-2 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#ec4899] text-white font-black text-xs shadow-[0_0_16px_rgba(124,58,237,0.2)]"
              >
                Publish Roast 😈
              </motion.button>
            </div>
          </div>
        )}

        {trollTab === "memes" && (
          <div className="space-y-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              onClick={() => setView("meme-generator")}
              className="p-4 rounded-3xl bg-white/70 dark:bg-[#12122a]/80 backdrop-blur-xl border border-[#7c3aed]/20 flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-[0_0_30px_rgba(124,58,237,0.15)] transition-all"
            >
              <div className="text-4xl mb-2">🎨</div>
              <h3 className="font-black text-xs text-[var(--foreground)]">Custom Meme Generator</h3>
              <p className="text-[10px] text-[#7c3aed]/50 mt-1 font-semibold">Overlay text on funny mascot comics</p>
            </motion.div>
            <div className="p-3 rounded-2xl bg-white/70 dark:bg-[#12122a]/80 backdrop-blur-xl border border-[#7c3aed]/20 flex flex-col items-center shadow-[0_0_12px_rgba(124,58,237,0.06)]">
              <div className="w-full aspect-square bg-gradient-to-br from-[#ec4899] to-[#ff6d00] rounded-2xl flex flex-col items-center justify-between p-4 text-white select-none shadow-inner">
                <span className="font-black text-sm uppercase text-center">{memeTopText}</span>
                <span className="text-7xl">😭</span>
                <span className="font-black text-sm uppercase text-center">{memeBottomText}</span>
              </div>
              <span className="text-[10px] font-bold text-[#7c3aed]/50 mt-2">Active Meme Template</span>
            </div>
          </div>
        )}

        {trollTab === "challenges" && (
          <div className="space-y-3">
            {[
              { title: "The Double Or Nothing", desc: "Roll a double? Reroll to double the bill for someone else!", reward: "+100 XP" },
              { title: "The Lucky Streak", desc: "Escape the bill 3 times in a row. Prove you have high luck rate.", reward: "+150 XP" },
              { title: "ATM Shield", desc: "Pay 3 times consecutively without leaving the group. Certified ATM.", reward: "+200 XP" }
            ].map((chall, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-4 rounded-2xl bg-white/70 dark:bg-[#12122a]/80 backdrop-blur border border-[#7c3aed]/20 flex justify-between items-center shadow-[0_0_12px_rgba(124,58,237,0.06)]"
              >
                <div className="flex-1">
                  <h4 className="text-xs font-black text-[var(--foreground)]">{chall.title}</h4>
                  <p className="text-[10px] font-semibold text-[#7c3aed]/60 mt-0.5 leading-relaxed">{chall.desc}</p>
                </div>
                <span className="text-[10px] font-black text-[#00c853] bg-[#00c853]/10 px-2.5 py-1 rounded-full flex-shrink-0 ml-2 border border-[#00c853]/20">
                  {chall.reward}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // 9. History Screen
  const [historyTab, setHistoryTab] = useState<"spin" | "dice">("spin");
  const [historyLoading, setHistoryLoading] = useState(false);

  const loadHistory = async () => {
    setHistoryLoading(true);
    await fetchHistory();
    setHistoryLoading(false);
  };

  useEffect(() => { loadHistory(); }, []);

  const AVATAR_COLORS = [
    "#ff4081", "#2979ff", "#00c853", "#ff6d00",
    "#6c3bff", "#00bcd4", "#f44336", "#ffd600",
  ];

  const getInitials = (name: string) =>
    name.replace(/\p{Emoji}/gu, "").trim().split(" ").map((w) => w[0] ?? "").join("").slice(0, 2).toUpperCase() || "?";

  const formatTime = (iso: string) => {
    try { return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); }
    catch { return "Just now"; }
  };

  const formatDate = (iso: string) => {
    try { return new Date(iso).toLocaleDateString([], { month: "short", day: "numeric" }); }
    catch { return ""; }
  };

  const filteredHistory = spinHistory.filter((s) => (s.type || "spin") === historyTab);

  const renderHistoryView = () => (
    <div className="flex-1 flex flex-col bg-[#faf8ff] dark:bg-[#0a0a1a] pb-16 relative">
      <header className="flex items-center justify-between px-6 py-8">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => { soundManager.playTick(); setView("home"); }}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-[#1a1a3e] shadow-[0_10px_25px_-5px_rgba(59,130,246,0.1)] text-slate-500 hover:text-[#3b82f6] transition-colors"
        >
          <ArrowLeft size={20} />
        </motion.button>
        <div className="flex items-center space-x-2">
          <h1 className="text-xl md:text-2xl font-bold text-[#3b82f6] tracking-tight">History</h1>
          <div className="w-3 h-3 rounded-full bg-[#3b82f6] shadow-sm" />
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => { soundManager.playTick(); setView("settings"); }}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-[#1a1a3e] shadow-[0_10px_25px_-5px_rgba(59,130,246,0.1)] text-slate-500 hover:text-[#3b82f6] transition-colors"
        >
          <Settings size={20} />
        </motion.button>
      </header>

      <section className="px-5 md:px-10 flex-1 pb-10">
        <div className="bg-white dark:bg-[#12122a]/80 rounded-[40px] md:rounded-[48px] border border-blue-50 dark:border-[#3b82f6]/20 p-6 md:p-10 min-h-[500px] flex flex-col transition-all shadow-[0_0_40px_rgba(59,130,246,0.05)]">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <div className="w-12 h-12 bg-blue-50 dark:bg-[#3b82f6]/10 rounded-2xl flex items-center justify-center text-[#3b82f6] shadow-sm border border-blue-100 dark:border-[#3b82f6]/20 shrink-0">
                <History size={24} />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-800 dark:text-white leading-tight">History</h2>
                <p className="text-xs font-medium text-slate-400">Recent rounds and activities</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={loadHistory}
              className="flex items-center space-x-2 bg-blue-50 dark:bg-[#3b82f6]/10 px-5 py-2.5 rounded-2xl text-[#3b82f6] hover:bg-blue-100 dark:hover:bg-[#3b82f6]/20 transition-colors w-full sm:w-auto justify-center group"
            >
              <RefreshCw size={16} className={`transition-transform duration-500 ${historyLoading ? "animate-spin" : "group-hover:rotate-180"}`} />
              <span className="text-sm font-bold">{historyLoading ? "Loading..." : "Refresh"}</span>
            </motion.button>
          </div>

          <div className="bg-blue-50/50 dark:bg-[#1a1a3e]/50 p-1.5 rounded-[32px] flex items-center mb-8 max-w-xl mx-auto w-full">
            <button
              onClick={() => setHistoryTab("spin")}
              className={`flex-1 py-4 px-6 rounded-[28px] flex items-center justify-center space-x-2 transition-all active:scale-95 ${
                historyTab === "spin"
                  ? "bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white shadow-lg shadow-blue-200 dark:shadow-[#3b82f6]/30"
                  : "text-slate-400 hover:bg-white/50 dark:hover:bg-white/5"
              }`}
            >
              <span className="text-xl">🎡</span>
              <span className="font-bold text-sm md:text-base">Spin Wheel</span>
            </button>
            <button
              onClick={() => setHistoryTab("dice")}
              className={`flex-1 py-4 px-6 rounded-[28px] flex items-center justify-center space-x-2 transition-all active:scale-95 ${
                historyTab === "dice"
                  ? "bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white shadow-lg shadow-blue-200 dark:shadow-[#3b82f6]/30"
                  : "text-slate-400 hover:bg-white/50 dark:hover:bg-white/5"
              }`}
            >
              <span className="text-xl opacity-70">🎲</span>
              <span className="font-bold text-sm md:text-base">Dice Rolls</span>
            </button>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto max-h-[400px] pr-1">
            {filteredHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center px-4 max-w-md mx-auto w-full py-16">
                <motion.div
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-20 h-20 rounded-full bg-slate-50 dark:bg-[#1a1a3e]/50 border-2 border-dashed border-slate-200 dark:border-[#3b82f6]/20 flex items-center justify-center mb-8"
                >
                  <AlertTriangle size={40} className="text-slate-300 dark:text-white/30" />
                </motion.div>
                <h3 className="text-slate-800 dark:text-white font-bold text-xl mb-3">No rounds yet!</h3>
                <p className="text-slate-400 text-sm md:text-base font-medium leading-relaxed">
                  {historyTab === "spin"
                    ? "Your recent activity will appear here once you start playing. Spin the wheel to get started."
                    : "Roll the dice to see your history here."}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { soundManager.playTick(); setView("home"); }}
                  className="mt-8 px-8 py-3.5 bg-[#3b82f6] text-white font-bold rounded-2xl shadow-lg shadow-blue-100 dark:shadow-[#3b82f6]/30 transition-transform"
                >
                  Try a spin now
                </motion.button>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredHistory.map((spin, idx) => {
                  const color = AVATAR_COLORS[idx % AVATAR_COLORS.length];
                  const initials = getInitials(spin.winner);
                  return (
                    <motion.div
                      key={spin.id || idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.18, delay: idx * 0.04 }}
                      className="flex items-center gap-3 p-4 rounded-2xl bg-blue-50/30 dark:bg-[#1a1a3e]/30 border border-blue-100/50 dark:border-[#3b82f6]/10"
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                        style={{ background: color }}
                      >
                        {initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-black text-sm text-slate-800 dark:text-white truncate">
                            {spin.winner}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            spin.type === "dice"
                              ? "bg-orange-100 dark:bg-orange-900/30 text-orange-500"
                              : "bg-green-100 dark:bg-green-900/30 text-green-500"
                          }`}>
                            {spin.type === "dice" ? "🎲 Dice" : "Paid"}
                          </span>
                        </div>
                        <p className="text-[11px] font-semibold text-slate-400 truncate max-w-[240px]">
                          {spin.type === "dice" && spin.dice1 !== undefined && spin.dice2 !== undefined
                            ? `Rolled ${spin.dice1} + ${spin.dice2} = ${spin.dice1 + spin.dice2} · (${spin.participants.slice(0, 3).join(", ")}${spin.participants.length > 3 ? "…" : ""})`
                            : spin.participants.slice(0, 4).join(", ")}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-[10px] font-bold text-slate-400">{formatTime(spin.createdAt)}</p>
                        <p className="text-[9px] font-semibold text-slate-300">{formatDate(spin.createdAt)}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>

          {filteredHistory.length > 0 && (
            <div className="mt-4 pt-4 flex items-center justify-between text-[10px] font-bold text-slate-400 border-t border-blue-100/50 dark:border-[#3b82f6]/10">
              <div className="flex items-center gap-1">
                <History size={11} />
                <span>{filteredHistory.length} rounds</span>
              </div>
              <span className="text-[#00c853]">● Live</span>
            </div>
          )}
        </div>
      </section>

      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-blue-50/50 to-transparent dark:from-[#3b82f6]/5 -z-10 opacity-60 pointer-events-none" />
    </div>
  );

  // 10. Leaderboard
  const renderLeaderboardView = () => <LeaderboardView />;

  // 11. Profile
  const renderProfileView = () => {
    return (
      <div className="flex-1 flex flex-col bg-[#faf8ff] dark:bg-[#0a0a1a] pb-16">
        {/* Fixed Top App Bar */}
        <div className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-transparent">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => { soundManager.playTick(); setView("home"); }}
            className="w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-md rounded-full text-white active:scale-95 transition-all"
          >
            <ArrowLeft size={20} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              const text = "Check out my PaySpin profile! 🎲💸";
              if (navigator.share) navigator.share({ title: "PaySpin Profile", text }).catch(() => {});
              else navigator.clipboard?.writeText(text).then(() => triggerToast("Profile link copied!"));
            }}
            className="w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-md rounded-full text-white active:scale-95 transition-all"
          >
            <Share2 size={20} />
          </motion.button>
        </div>

        {/* Header Section */}
        <section className="relative pt-16 pb-24 overflow-hidden bg-gradient-to-br from-[#831ada] to-[#4a90e2]">
          <div className="absolute bottom-0 left-0 w-full">
            <svg className="w-full h-auto translate-y-0.5" viewBox="0 0 1440 320">
              <path d="M0,160L48,176C96,192,192,224,288,229.3C384,235,480,213,576,181.3C672,149,768,107,864,112C960,117,1056,171,1152,181.3C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" fill="#faf8ff" fillOpacity="1" />
            </svg>
          </div>
          <div className="relative z-10 flex flex-col items-center text-center px-6 pt-4">
            <div className="relative mb-4">
              <div className="w-28 h-28 rounded-full border-4 border-white shadow-lg overflow-hidden bg-[#FFD700]">
                <img
                  alt="John Doe"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDo74jqV0seIEtUl1f_7zRIUWyKeR1a9H_P-oFQjgxE244jJY312XWrJ2sRTMCQXp86pWWB9_XSN37gTOo6iaY5ISTw14xaqnb4Zv_DnSJsrTh65AyEZ5QXCx3OTdK4oL0OcwuFa4EOIgwMbdpFYkEpadN_fSl8ichpmdJYIcHPDReg8R6CFnO4yqW--VPieJRT1HURyfEOs8prOPmsPHVbrx373PcrluRU4IQCqKiy2mDqym8U4EnxpJ7QOfyqRxXOuA2DJF162jPg"
                />
              </div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => { soundManager.playTick(); setView("settings"); }}
                className="absolute bottom-0 right-0 bg-[#283044] text-white p-1.5 rounded-full border-2 border-white shadow-sm cursor-pointer"
              >
                <Pencil size={16} />
              </motion.div>
            </div>
            <h1 className="text-white font-bold text-2xl mb-1">John Doe</h1>
            <p className="text-white/70 text-base">john.doe@email.com</p>
          </div>
        </section>

        {/* Stats Section (Overlapping) */}
        <section className="px-6 -mt-8 relative z-20 mb-8">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Rounds", value: "27" },
              { label: "Wins", value: "18" },
              { label: "Paid Bills", value: "‹1,650" },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white dark:bg-[#1a1a3e] p-4 rounded-xl shadow-sm text-center flex flex-col items-center justify-center border border-black/5 dark:border-white/5"
              >
                <span className="text-[#131b2e] dark:text-white font-bold text-2xl">{stat.value}</span>
                <span className="text-[#737686] dark:text-white/50 text-xs font-medium">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Menu Section */}
        <section className="px-6 space-y-3">
          <div className="bg-white dark:bg-[#1a1a3e] rounded-xl shadow-sm border border-black/5 dark:border-white/5 overflow-hidden">
            {[
              { label: "My Groups", icon: Users, action: () => setView("group") },
              { label: "History", icon: History, action: () => setView("history") },
              { label: "Friends", icon: UserPlus, action: () => setView("group") },
              { label: "Achievements", icon: Trophy, action: () => setView("achievements") },
            ].map((item, idx) => (
              <motion.button
                key={idx}
                whileTap={{ scale: 0.98 }}
                onClick={() => { soundManager.playTick(); item.action(); }}
                className="w-full flex items-center justify-between p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors border-b border-black/5 dark:border-white/5 last:border-b-0"
              >
                <div className="flex items-center gap-4">
                  <item.icon size={20} className="text-[#131b2e] dark:text-white" />
                  <span className="font-medium text-[#131b2e] dark:text-white">{item.label}</span>
                </div>
                <ChevronRight size={20} className="text-[#737686]" />
              </motion.button>
            ))}
          </div>

          {/* Log out */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { soundManager.playTick(); setView("splash"); }}
            className="w-full mt-8 flex items-center justify-center gap-2 p-4 text-red-500 font-bold rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={20} />
            <span>Log out</span>
          </motion.button>
        </section>
      </div>
    );
  };

  // 12. Achievements
  const renderAchievementsView = () => (
    <div className="flex-1 flex flex-col bg-[#eff6ff] dark:bg-[#0a0a1a] pb-16">
      <div className="flex items-center justify-between px-4 py-3 bg-white/70 dark:bg-[#12122a]/80 backdrop-blur-xl border-b border-blue-100 dark:border-[#3b82f6]/20 sticky top-0 z-20">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => { soundManager.playTick(); setView("home"); }}
          className="w-9 h-9 rounded-xl bg-white/60 dark:bg-[#1a1a3e]/60 backdrop-blur border border-blue-100 dark:border-[#3b82f6]/20 flex items-center justify-center shadow-sm"
          style={{ color: "var(--foreground)" }}
        >
          <ArrowLeft size={16} />
        </motion.button>
        <span className="font-black text-sm text-slate-900 dark:text-white">Achievements 🏅</span>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => { soundManager.playTick(); setView("settings"); }}
          className="w-9 h-9 rounded-xl bg-white/60 dark:bg-[#1a1a3e]/60 backdrop-blur border border-blue-100 dark:border-[#3b82f6]/20 flex items-center justify-center shadow-sm"
          style={{ color: "var(--foreground)" }}
        >
          <Settings size={16} />
        </motion.button>
      </div>
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        <div className="grid grid-cols-2 gap-2">
          {achievements.map((ach) => (
            <motion.div
              key={ach.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-2 rounded-2xl flex flex-col items-center text-center relative backdrop-blur-xl border border-[#3b82f6]/30 ${
                ach.unlocked
                  ? "bg-white/70 dark:bg-[#12122a]/80 shadow-[0_0_20px_rgba(59,130,246,0.1)]"
                  : "bg-white/40 dark:bg-[#12122a]/50 opacity-60 grayscale"
              }`}
            >
              {ach.unlocked && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-gradient-to-r from-[#00c853] to-[#00e676] flex items-center justify-center text-[8px] text-white shadow-[0_0_8px_rgba(0,200,83,0.3)]"
                >
                  ✓
                </motion.span>
              )}
              <img src={ach.icon} alt={ach.title} className="w-40 h-40 object-contain my-1" />
              <h4 className="text-[11px] font-black text-[var(--foreground)] truncate w-full">{ach.title}</h4>
              <p className="text-[8px] text-[#3b82f6]/50 font-semibold mt-0.5 leading-relaxed">{ach.desc}</p>
              <span className="text-[9px] font-black text-[#3b82f6] mt-2 bg-[#3b82f6]/5 px-2 py-0.5 rounded border border-[#3b82f6]/20">
                {ach.progress}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  // 13. Create Group Screen
  const [customMemberInput, setCustomMemberInput] = useState("");
  const [showGroupPicker, setShowGroupPicker] = useState(false);

  const handleAddCustomMember = () => {
    const name = customMemberInput.trim();
    if (!name) return;
    if (name.length > 15) { triggerToast("Name too long (max 15)!"); return; }
    if (newGroupMembers.includes(name)) { triggerToast("Already added!"); return; }
    setNewGroupMembers([...newGroupMembers, name]);
    setCustomMemberInput("");
  };

  const renderCreateGroupView = () => (
    <div className="flex-1 flex flex-col bg-[#f5f0ff] dark:bg-[#0a0a1a]">
      {renderHeader("Create Group 🎨")}
      <div className="flex-1 p-5 space-y-5 overflow-y-auto">

        {/* Group Name */}
        <div className="bg-white/70 dark:bg-[#12122a]/80 backdrop-blur-xl rounded-2xl border border-[#7c3aed]/20 p-4 space-y-4 shadow-[0_0_20px_rgba(124,58,237,0.05)]">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-[#7c3aed]/60 uppercase tracking-wider">Group Name</label>
            <input
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="e.g. Weekend Squad"
              className="w-full p-3.5 border border-[#7c3aed]/20 rounded-xl text-sm font-bold bg-white/80 dark:bg-[#1a1a3e]/80 text-[var(--foreground)] outline-none focus:border-[#7c3aed]/50 focus:shadow-[0_0_16px_rgba(124,58,237,0.1)] transition-all"
            />
          </div>

          {/* Group Vibe */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-[#7c3aed]/60 uppercase tracking-wider">Group Vibe</label>
            <div className="grid grid-cols-5 gap-2 select-none">
              {["🎉", "🍲", "😎", "🍻", "🍕"].map((vibe) => (
                <motion.button
                  key={vibe}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setVibeSelected(vibe)}
                  className={`p-3 rounded-xl text-2xl flex items-center justify-center transition-all ${
                    vibeSelected === vibe
                      ? "bg-gradient-to-br from-[#7c3aed]/20 to-[#ec4899]/20 border-2 border-[#7c3aed] shadow-[0_0_16px_rgba(124,58,237,0.2)] scale-105"
                      : "bg-white/80 dark:bg-[#1a1a3e]/80 border border-[#7c3aed]/20 hover:border-[#7c3aed]/40"
                  }`}
                >
                  {vibe}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Add Members */}
        <div className="bg-white/70 dark:bg-[#12122a]/80 backdrop-blur-xl rounded-2xl border border-[#7c3aed]/20 p-4 space-y-3 shadow-[0_0_20px_rgba(124,58,237,0.05)]">
          <label className="text-[10px] font-bold text-[#7c3aed]/60 uppercase tracking-wider">Add Members</label>

          {/* Custom name input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={customMemberInput}
              onChange={(e) => setCustomMemberInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleAddCustomMember(); }}
              placeholder="Enter name..."
              maxLength={15}
              className="flex-1 p-3 border border-[#7c3aed]/20 rounded-xl text-sm font-semibold bg-white/80 dark:bg-[#1a1a3e]/80 text-[var(--foreground)] outline-none focus:border-[#7c3aed]/50 transition-all"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddCustomMember}
              className="px-4 py-3 rounded-xl bg-[#7c3aed] text-white font-black text-sm shadow-[0_4px_12px_rgba(124,58,237,0.3)]"
            >
              Add
            </motion.button>
          </div>

          {/* Quick select from suggestions */}
          <div>
            <p className="text-[9px] font-bold text-[#7c3aed]/40 uppercase tracking-wider mb-2">Quick Select</p>
            <div className="flex flex-wrap gap-1.5">
              {["Alex 😎", "Jamie 🌟", "Sam 🎉", "Taylor 🔥", "Morgan 💫", "Casey 🦄"].map((m) => {
                const isAdded = newGroupMembers.includes(m);
                return (
                  <motion.button
                    key={m}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (isAdded) {
                        setNewGroupMembers(newGroupMembers.filter((item) => item !== m));
                      } else {
                        setNewGroupMembers([...newGroupMembers, m]);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all ${
                      isAdded
                        ? "bg-[#00c853]/10 border-[#00c853] text-[#00c853]"
                        : "bg-white/80 dark:bg-[#1a1a3e]/80 border-[#7c3aed]/20 text-[var(--foreground)] hover:border-[#7c3aed]/40"
                    }`}
                  >
                    {m} {isAdded ? "✓" : "+"}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Selected members list */}
          {newGroupMembers.length > 0 && (
            <div>
              <p className="text-[9px] font-bold text-[#7c3aed]/40 uppercase tracking-wider mb-2">
                Selected ({newGroupMembers.length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {newGroupMembers.map((m) => (
                  <div
                    key={m}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#7c3aed]/10 border border-[#7c3aed]/20 text-[11px] font-bold text-[#7c3aed]"
                  >
                    {m}
                    <button
                      onClick={() => setNewGroupMembers(newGroupMembers.filter((item) => item !== m))}
                      className="ml-0.5 w-4 h-4 rounded-full bg-[#7c3aed]/20 hover:bg-red-400/30 flex items-center justify-center transition-colors"
                    >
                      <svg className="w-2.5 h-2.5 text-[#7c3aed]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeWidth="3"/></svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Create Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            if (!newGroupName.trim()) {
              triggerToast("Enter group name!");
              return;
            }
            if (newGroupMembers.length < 2) {
              triggerToast("Select at least 2 members!");
              return;
            }
            createGroup(newGroupName.trim(), newGroupMembers, vibeSelected);
            triggerToast("Created new group!");
            setNewGroupMembers([]);
            setNewGroupName("");
            setVibeSelected("🎉");
            setView("group");
          }}
          className="w-full justify-center py-4 rounded-2xl bg-gradient-to-r from-[#7c3aed] to-[#ec4899] text-white font-black text-sm shadow-[0_0_30px_rgba(124,58,237,0.3)] flex items-center gap-2 tracking-wide"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 5v14m-7-7h14" strokeLinecap="round" strokeWidth="3"/></svg>
          Create Group
        </motion.button>
      </div>
    </div>
  );

  // 14. Join Group Screen
  const renderJoinGroupView = () => (
    <div className="flex-1 flex flex-col bg-[#f5f0ff] dark:bg-[#0a0a1a]">
      {renderHeader("Join Group 🤝")}
      <div className="flex-1 p-6 space-y-6 flex flex-col justify-center items-center text-center">
        <div>
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-4xl mb-2"
          >🔑</motion.div>
          <h3 className="font-black text-sm text-[var(--foreground)]">Enter Invite Code</h3>
          <p className="text-[10px] text-[#7c3aed]/50 mt-1 font-semibold">Enter the 6-character code shared by your friend</p>
        </div>

        {/* Input box */}
        <div className="flex gap-2 justify-center max-w-[280px]">
          {inviteCodeInput.map((val, idx) => (
            <input
              key={idx}
              id={`code-box-${idx}`}
              type="text"
              maxLength={1}
              value={val}
              onChange={(e) => {
                const nextVal = e.target.value.toUpperCase();
                const nextCode = [...inviteCodeInput];
                nextCode[idx] = nextVal;
                setInviteCodeInput(nextCode);
                
                // Focus next element
                if (nextVal && idx < 5) {
                  document.getElementById(`code-box-${idx + 1}`)?.focus();
                }
              }}
              className="w-10 h-12 border-2 border-[#7c3aed]/20 rounded-xl text-center text-lg font-black bg-white/70 dark:bg-[#12122a]/80 backdrop-blur text-[var(--foreground)] outline-none focus:border-[#7c3aed] focus:shadow-[0_0_16px_rgba(124,58,237,0.2)] transition-all"
            />
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            const finalCode = inviteCodeInput.join("");
            if (finalCode.length < 6) {
              triggerToast("Code must be 6 letters!");
              return;
            }
            const success = joinGroup(finalCode);
            if (success) {
              triggerToast("Joined Dinner Squad!");
            }
          }}
          className="w-full justify-center py-3.5 rounded-2xl bg-gradient-to-r from-[#7c3aed] to-[#ec4899] text-white font-black text-xs shadow-[0_0_30px_rgba(124,58,237,0.3)] mt-4 flex items-center gap-2"
        >
          Join Group ▷
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => triggerToast("Camera permission requested! (Simulator mockup)")}
          className="text-xs font-black text-[#7c3aed] mt-2 flex items-center gap-1"
        >
          📷 Scan QR Code
        </motion.button>
      </div>
    </div>
  );

  // 15. Settings Screen
  const renderSettingsView = () => (
    <SettingsView />
  );

  // 16. Meme Generator
  const renderMemeGeneratorView = () => (
    <div className="flex-1 flex flex-col bg-[#f5f0ff] dark:bg-[#0a0a1a]">
      {renderHeader("Meme Generator 🎨", "troll")}
      <div className="flex-1 p-5 space-y-4 overflow-y-auto">
        {/* Meme canvas mockup */}
        <div className="p-4 rounded-2xl bg-white/70 dark:bg-[#12122a]/80 backdrop-blur-xl border border-[#7c3aed]/20 flex flex-col items-center shadow-[0_0_20px_rgba(124,58,237,0.08)]">
          <div className="w-full aspect-square bg-gradient-to-br from-[#ec4899] via-[#7c3aed] to-[#ff6d00] rounded-3xl flex flex-col items-center justify-between p-5 text-white select-none shadow-[0_0_30px_rgba(236,72,153,0.2)]">
            <span className="font-black text-base uppercase text-center leading-tight tracking-wider drop-shadow-lg">{memeTopText}</span>
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-8xl my-2"
            >😭</motion.div>
            <span className="font-black text-base uppercase text-center leading-tight tracking-wider drop-shadow-lg">{memeBottomText}</span>
          </div>
        </div>

        {/* Text inputs */}
        <div className="space-y-3">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-[#7c3aed]/60 uppercase">Top Header Text</label>
            <input
              type="text"
              value={tempMemeTop}
              onChange={(e) => setTempMemeTop(e.target.value)}
              placeholder="WHEN ALEX SEES THE BILL"
              className="w-full p-3 border border-[#7c3aed]/20 rounded-xl text-xs font-bold bg-white/70 dark:bg-[#12122a]/80 backdrop-blur text-[var(--foreground)] outline-none focus:border-[#7c3aed]/50 focus:shadow-[0_0_16px_rgba(124,58,237,0.1)] transition-all"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-[#7c3aed]/60 uppercase">Bottom Footer Text</label>
            <input
              type="text"
              value={tempMemeBottom}
              onChange={(e) => setTempMemeBottom(e.target.value)}
              placeholder="NOT TODAY BRO!"
              className="w-full p-3 border border-[#7c3aed]/20 rounded-xl text-xs font-bold bg-white/70 dark:bg-[#12122a]/80 backdrop-blur text-[var(--foreground)] outline-none focus:border-[#7c3aed]/50 focus:shadow-[0_0_16px_rgba(124,58,237,0.1)] transition-all"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              soundManager.playTick();
              setMemeText(tempMemeTop, tempMemeBottom);
              triggerToast("Meme text saved!");
            }}
            className="py-3 rounded-2xl bg-gradient-to-r from-[#7c3aed] to-[#4f28cc] text-white font-black text-xs shadow-[0_0_20px_rgba(124,58,237,0.3)]"
          >
            Apply Changes
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              soundManager.playTick();
              triggerToast("Meme copied to sharing drawer!");
            }}
            className="py-3 rounded-2xl bg-gradient-to-r from-[#ec4899] to-[#ff6d00] text-white font-black text-xs shadow-[0_0_20px_rgba(236,72,153,0.3)]"
          >
            Share Meme 🎨
          </motion.button>
        </div>
      </div>
    </div>
  );

  // VIEW ROUTER
  const renderCurrentView = () => {
    switch (currentView) {
      case "splash":
        return renderSplashView();
      case "home":
        return renderHomeView();
      case "spin":
        return renderSpinView();
      case "dice":
        return renderDiceView();
      case "dice-modes":
        return renderDiceModesView();
      case "result":
        return renderResultView();
      case "group":
        return renderGroupView();
      case "troll":
        return renderTrollView();
      case "history":
        return renderHistoryView();
      case "leaderboard":
        return renderLeaderboardView();
      case "profile":
        return renderProfileView();
      case "achievements":
        return renderAchievementsView();
      case "create-group":
        return renderCreateGroupView();
      case "join-group":
        return renderJoinGroupView();
      case "settings":
        return renderSettingsView();
      case "meme-generator":
        return renderMemeGeneratorView();
      default:
        return renderHomeView();
    }
  };

  // Determine if bottom nav bar should render in the simulator
  const showBottomNav = [
    "home",
    "group",
    "history",
    "profile",
    "leaderboard",
    "achievements",
    "troll",
  ].includes(currentView);

  return (
    <div className="flex h-screen bg-payspin-bg dark:bg-payspin-dark-bg text-payspin-text dark:text-white font-sans overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col relative h-full w-full lg:rounded-l-3xl lg:my-4 lg:mr-4 bg-white/50 dark:bg-[#0a0a1a] shadow-[0_0_40px_rgba(0,0,0,0.05)] overflow-hidden">
        {/* Active Screen content */}
        <div className="flex-1 flex flex-col overflow-hidden pb-24 lg:pb-0 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col h-full overflow-hidden"
            >
              {renderCurrentView()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Shared bottom toast */}
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="absolute bottom-24 lg:bottom-10 left-1/2 -translate-x-1/2 w-max bg-payspin-blue dark:bg-payspin-purple text-white py-3 px-6 rounded-2xl shadow-glow z-50 text-center text-sm font-black pointer-events-none"
            >
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Nav (mobile only) */}
      <MobileNav />
    </div>
  );
}
