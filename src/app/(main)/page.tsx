"use client";

import { useState, useEffect } from "react";
import { useGameStore } from "@/store/useGameStore";
import { soundManager } from "@/components/shared/SoundManager";
import SpinWheel from "@/components/wheel/SpinWheel";
import Dice from "@/components/wheel/Dice";
import RecentSpins from "@/components/shared/RecentSpins";
import { motion, AnimatePresence } from "framer-motion";
import {
  Volume2, VolumeX, Plus, Users, ArrowLeft, Settings, 
  Trophy, History, User, Heart, Share2, Info, LogOut, Check, ChevronRight
} from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";
import HeroArea from "@/components/dashboard/HeroArea";
import DashboardCards from "@/components/dashboard/DashboardCards";

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
      { icon: "➕", label: "Add", view: "create-group" },
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
              <span className={`text-xl transition-all ${isActive ? "scale-115" : "opacity-40"}`}>
                {tab.icon}
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
    <div className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto">
      <HeroArea />
      <DashboardCards />
    </div>
  );

  // 3. Spin Wheel Screen
  const renderSpinView = () => (
    <div className="flex-1 flex flex-col bg-[#f5f0ff] dark:bg-[#0a0a1a] pb-16">
      {renderHeader("Spin the Wheel")}
      <div className="flex-1 p-4 flex flex-col items-center justify-center gap-6">
        {/* Active group header */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          onClick={() => setView("group")}
          className="px-4 py-2 rounded-full bg-white/70 dark:bg-[#12122a]/80 backdrop-blur-xl border border-[#7c3aed]/20 text-xs font-black flex items-center gap-2 cursor-pointer shadow-[0_0_16px_rgba(124,58,237,0.1)] hover:shadow-[0_0_24px_rgba(124,58,237,0.2)] transition-all"
        >
          <span>👥 {activeGroup.name}</span>
          <span className="text-[10px] text-[#7c3aed]">({participants.length} members) ›</span>
        </motion.div>

        {/* Spin wheel container */}
        <div className="w-full flex items-center justify-center">
          <SpinWheel />
        </div>

        {/* Toggle options */}
        <div className="w-full p-4 rounded-2xl bg-white/70 dark:bg-[#12122a]/80 backdrop-blur-xl border border-[#7c3aed]/20 flex items-center justify-between shadow-[0_0_16px_rgba(124,58,237,0.1)]">
          <div>
            <h4 className="text-xs font-black text-[var(--foreground)]">Remove Loser</h4>
            <p className="text-[10px] text-[#7c3aed]/50 font-semibold mt-0.5">Winner leaves the list</p>
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
                  background: "linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)",
                  boxShadow: "0 6px 30px rgba(124, 58, 237, 0.4)",
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
    <div className="flex-1 flex flex-col bg-[#f5f0ff] dark:bg-[#0a0a1a] pb-16">
      {renderHeader("Roll the Dice")}
      <div className="flex-1 p-4 flex flex-col items-center justify-start overflow-y-auto">
        <motion.div
          whileHover={{ scale: 1.05 }}
          onClick={() => setView("group")}
          className="px-4 py-2 rounded-full bg-white/70 dark:bg-[#12122a]/80 backdrop-blur-xl border border-[#7c3aed]/20 text-xs font-black flex items-center gap-2 cursor-pointer shadow-[0_0_16px_rgba(124,58,237,0.1)] hover:shadow-[0_0_24px_rgba(124,58,237,0.2)] transition-all mb-2"
        >
          <span>👥 {activeGroup.name}</span>
          <span className="text-[10px] text-[#7c3aed]">({participants.length} members) ›</span>
        </motion.div>

        <Dice />
      </div>
    </div>
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
  const renderResultView = () => {
    // Determine caption
    const captions = [
      "Better luck next time! 😅",
      "Fate has spoken — time to pay up! 💸",
      "Your wallet's worst nightmare! 😂",
      "Bring out the cash! 💰",
      "Escape plan failed! 🍽️"
    ];
    const captionIdx = winner ? Array.from(winner).reduce((acc, c) => acc + c.charCodeAt(0), 0) % captions.length : 0;
    const caption = captions[captionIdx];

    return (
      <div className="flex-1 flex flex-col justify-between p-6 text-center bg-[#f5f0ff] dark:bg-[#0a0a1a] relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-[#7c3aed]/20 to-[#ec4899]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Spacer */}
        <div className="pt-4 relative z-10" />

        {/* Mascot sunglasses */}
        <div className="flex flex-col items-center relative z-10">
          <motion.div
            initial={{ scale: 0.6, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            className="w-24 h-24 rounded-full bg-gradient-to-br from-[#7c3aed]/20 to-[#ec4899]/20 border-4 border-[#7c3aed] flex items-center justify-center text-6xl shadow-[0_0_50px_rgba(124,58,237,0.3)] select-none"
          >
            😎
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-6 px-6 py-2 rounded-2xl bg-gradient-to-r from-[#ec4899] to-[#ff6d00] text-white font-black text-lg shadow-[0_0_30px_rgba(236,72,153,0.3)] uppercase tracking-wider"
          >
            {winner?.includes("&") ? "Splits!" : "Paying!"}
          </motion.div>
          <motion.h2
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-black text-[var(--foreground)] mt-4 leading-tight"
          >
            {winner}
          </motion.h2>
          <p className="text-xs font-bold text-[#7c3aed]/60 mt-2">
            {caption}
          </p>
        </div>

        {/* Roast Speech Bubble */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-4 rounded-3xl bg-white/70 dark:bg-[#12122a]/80 backdrop-blur-xl border border-[#ec4899]/20 mt-4 relative shadow-[0_0_20px_rgba(236,72,153,0.1)]"
        >
          <span className="text-[10px] font-bold text-[#7c3aed]/60 block mb-1">🔥 THE SQUAD ROAST:</span>
          <p className="text-xs font-black bg-gradient-to-r from-[#ec4899] to-[#ff6d00] bg-clip-text text-transparent italic">
            "{winner} is washing the dishes tonight! Card declined loading... 😂"
          </p>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 mt-8 w-full relative z-10">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              soundManager.playTick();
              const formattedRoast = `${winner} got absolutely owned! Wallet crying again? 😂🔥`;
              triggerToast("Copied roast template! Go post it.");
              setRoastsList([
                { name: winner || "Alex 😎", roast: "dish washer duty loading... 🍽️🧴", likes: 1 },
                ...roastsList
              ]);
            }}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#ec4899] to-[#ff6d00] text-white font-black text-xs shadow-[0_0_20px_rgba(236,72,153,0.3)] flex items-center justify-center gap-2"
          >
            Roast {winner?.split(" ")[0]} 😈
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              soundManager.playTick();
              setWinner(null, null);
              setView("spin");
            }}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#7c3aed] to-[#4f28cc] text-white font-black text-xs shadow-[0_0_20px_rgba(124,58,237,0.3)]"
          >
            Next Round ▷
          </motion.button>

          <button
            onClick={() => {
              soundManager.playTick();
              setWinner(null, null);
              setView("home");
            }}
            className="w-full py-3 bg-white/70 dark:bg-[#12122a]/80 backdrop-blur border border-[#7c3aed]/20 text-[#7c3aed] rounded-2xl font-bold text-xs hover:shadow-[0_0_16px_rgba(124,58,237,0.15)] transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  };

  // 7. Group Screen
  const renderGroupView = () => (
    <div className="flex-1 flex flex-col bg-[#f5f0ff] dark:bg-[#0a0a1a] pb-16">
      {renderHeader(activeGroup.name)}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {/* Members Header */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#7c3aed]/60 uppercase">Members ({activeGroup.members.length})</span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setView("create-group")}
            className="text-[10px] font-black text-white px-3 py-1.5 bg-gradient-to-r from-[#7c3aed] to-[#ec4899] rounded-lg shadow-[0_0_12px_rgba(124,58,237,0.2)]"
          >
            + Invite
          </motion.button>
        </div>

        {/* Member Row */}
        <div className="flex items-center gap-3 overflow-x-auto pb-1 select-none">
          {activeGroup.members.map((member, idx) => {
            const initials = member.replace(/\p{Emoji}/gu, "").trim().slice(0, 2).toUpperCase() || "??";
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -3 }}
                className="flex flex-col items-center flex-shrink-0 gap-1"
              >
                <div 
                  className="w-11 h-11 rounded-2xl flex items-center justify-center text-xs font-black text-white shadow-[0_0_16px_rgba(0,0,0,0.15)]"
                  style={{ background: AVATAR_COLORS[idx % AVATAR_COLORS.length], boxShadow: `0 0 16px ${AVATAR_COLORS[idx % AVATAR_COLORS.length]}40` }}
                >
                  {initials}
                </div>
                <span className="text-[9px] font-black max-w-[50px] truncate text-[var(--foreground)]">{member.split(" ")[0]}</span>
              </motion.div>
            );
          })}
        </div>

        {/* Buttons Row */}
        <div className="grid grid-cols-2 gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => triggerToast("Invite link copied to clipboard!")}
            className="py-2.5 rounded-xl text-xs font-black bg-white/70 dark:bg-[#12122a]/80 backdrop-blur border border-[#7c3aed]/20 text-[var(--foreground)] flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(124,58,237,0.08)]"
          >
            Invite Friends
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => triggerToast("Shared group link!")}
            className="py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-[#7c3aed] to-[#ec4899] text-white flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(124,58,237,0.3)]"
          >
            Share Group
          </motion.button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Rounds", value: activeGroup.rounds, color: "#7c3aed" },
            { label: "Total Paid", value: `$${activeGroup.totalPaid}`, color: "#00c853" },
            { label: "Members Paid", value: `${activeGroup.members.length - 1}`, color: "#ff6d00" },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-3 text-center rounded-2xl bg-white/70 dark:bg-[#12122a]/80 backdrop-blur-xl border border-[#7c3aed]/20 shadow-[0_0_12px_rgba(124,58,237,0.08)]"
            >
              <span className="text-[9px] font-bold text-[#7c3aed]/60 block uppercase">{stat.label}</span>
              <span className="text-sm font-black block mt-1" style={{ color: stat.color }}>{stat.value}</span>
            </motion.div>
          ))}
        </div>

        {/* Group Feed list */}
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-bold text-[#7c3aed]/60 uppercase self-start mb-1">Group Activity</span>
          <div className="space-y-2">
            {activeGroup.activity.length === 0 ? (
              <p className="text-xs text-[#7c3aed]/50 text-center py-4 font-bold">No group activity yet. Start spinning!</p>
            ) : (
              activeGroup.activity.map((act, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-3 rounded-2xl bg-white/70 dark:bg-[#12122a]/80 backdrop-blur border border-[#7c3aed]/20 flex justify-between items-center shadow-[0_0_8px_rgba(124,58,237,0.06)]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/60 to-white/30 dark:from-[#1a1a3e] dark:to-[#12122a] border border-[#7c3aed]/10 text-sm flex items-center justify-center flex-shrink-0">
                      {act.action === "paid" ? "💳" : "🍀"}
                    </div>
                    <div>
                      <span className="text-xs font-black text-[var(--foreground)]">{act.name}</span>
                      <span className="text-[10px] font-bold text-[#7c3aed]/50 block mt-0.5">
                        {act.action === "paid" ? `Paid bill amount $${act.amount}` : "Escaped the bill!"}
                      </span>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-[#7c3aed]/40">{act.time}</span>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
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
  const renderHistoryView = () => (
    <div className="flex-1 flex flex-col bg-[#f5f0ff] dark:bg-[#0a0a1a] pb-16">
      {renderHeader("History 🕐")}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        <div className="p-3 rounded-2xl bg-white/70 dark:bg-[#12122a]/80 backdrop-blur-xl border border-[#7c3aed]/20 shadow-[0_0_16px_rgba(124,58,237,0.08)]">
          <RecentSpins />
        </div>
      </div>
    </div>
  );

  // 10. Leaderboard
  const renderLeaderboardView = () => (
    <div className="flex-1 flex flex-col bg-[#f5f0ff] dark:bg-[#0a0a1a] pb-16">
      {renderHeader("Leaderboard 🏆")}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {/* Podium Layout */}
        <div className="flex items-end justify-center gap-3 pt-6 pb-2 select-none">
          {/* 2nd Place */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="flex flex-col items-center"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white/70 to-white/30 dark:from-[#1a1a3e] dark:to-[#12122a] border-2 border-[#7c3aed]/30 flex items-center justify-center text-sm shadow-[0_0_16px_rgba(124,58,237,0.15)]">🥈</div>
            <span className="text-[9px] font-black text-[var(--foreground)] mt-1 truncate max-w-[60px]">Jamie 🌟</span>
            <div className="w-16 bg-gradient-to-t from-[#7c3aed]/20 to-[#7c3aed]/5 rounded-t-xl flex flex-col items-center justify-center py-2 mt-1 shadow-[0_0_12px_rgba(124,58,237,0.1)] backdrop-blur">
              <span className="text-[10px] font-black text-[#7c3aed]">#2</span>
              <span className="text-[8px] font-bold text-[#7c3aed]/60">8 times</span>
            </div>
          </motion.div>

          {/* 1st Place */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.05 }}
            className="flex flex-col items-center z-10"
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-yellow-400"
            >👑</motion.div>
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#ffd600]/20 to-[#ffab00]/20 border-4 border-[#ffd600] flex items-center justify-center text-lg shadow-[0_0_30px_rgba(255,214,0,0.3)]">🥇</div>
            <span className="text-[10px] font-black text-[var(--foreground)] mt-1 truncate max-w-[70px]">Alex 😎</span>
            <div className="w-20 bg-gradient-to-t from-[#ffd600] to-[#ffab00] rounded-t-xl flex flex-col items-center justify-center py-3 mt-1 shadow-[0_0_30px_rgba(255,214,0,0.3)]">
              <span className="text-xs font-black text-[#1a0a4d]">#1</span>
              <span className="text-[9px] font-bold text-[#1a0a4d]/75">12 times</span>
            </div>
          </motion.div>

          {/* 3rd Place */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="flex flex-col items-center"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/70 to-white/30 dark:from-[#1a1a3e] dark:to-[#12122a] border-2 border-[#ffab00]/30 flex items-center justify-center text-xs shadow-[0_0_12px_rgba(255,171,0,0.15)]">🥉</div>
            <span className="text-[9px] font-black text-[var(--foreground)] mt-1 truncate max-w-[60px]">Sam 🎉</span>
            <div className="w-14 bg-gradient-to-t from-[#ffab00]/30 to-[#ffab00]/10 rounded-t-xl flex flex-col items-center justify-center py-1 mt-1 shadow-[0_0_12px_rgba(255,171,0,0.1)] backdrop-blur">
              <span className="text-[9px] font-black text-[#ffab00]">#3</span>
              <span className="text-[8px] font-bold text-[#ffab00]/70">6 times</span>
            </div>
          </motion.div>
        </div>

        {/* Ranked Rows */}
        <div className="space-y-2">
          {[
            { rank: 4, name: "Taylor 🔥", times: 5, color: AVATAR_COLORS[3] },
            { rank: 5, name: "Casey 🦄", times: 4, color: AVATAR_COLORS[4] },
            { rank: 6, name: "Jordan 🪐", times: 3, color: AVATAR_COLORS[5] },
            { rank: 7, name: "Mosey 🧁", times: 2, color: AVATAR_COLORS[6] },
          ].map((row, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + idx * 0.08 }}
              className="p-3 rounded-2xl bg-white/70 dark:bg-[#12122a]/80 backdrop-blur border border-[#7c3aed]/20 flex justify-between items-center shadow-[0_0_12px_rgba(124,58,237,0.06)]"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-black text-[#7c3aed]/50 w-4">{row.rank}</span>
                <div 
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black text-white shadow-[0_0_12px_rgba(0,0,0,0.1)]"
                  style={{ background: row.color, boxShadow: `0 0 14px ${row.color}40` }}
                >
                  {row.name.slice(0, 2).toUpperCase()}
                </div>
                <span className="text-xs font-black text-[var(--foreground)]">{row.name}</span>
              </div>
              <span className="text-[10px] font-black text-[#7c3aed]/60 bg-white/50 dark:bg-[#1a1a3e]/50 px-2.5 py-1 rounded-full border border-[#7c3aed]/10">
                Paid {row.times} times
              </span>
            </motion.div>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => triggerToast("Leaderboard image generated and copied!")}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#7c3aed] to-[#ec4899] text-white font-black text-xs shadow-[0_0_30px_rgba(124,58,237,0.3)]"
        >
          Share Leaderboard 🏆
        </motion.button>
      </div>
    </div>
  );

  // 11. Profile
  const renderProfileView = () => {
    const xpPercent = Math.min(100, Math.floor((userXP / 700) * 100));
    
    return (
      <div className="flex-1 flex flex-col bg-[#f5f0ff] dark:bg-[#0a0a1a] pb-16">
        {renderHeader("Profile 👤")}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {/* Profile Card */}
          <div className="p-5 text-center flex flex-col items-center relative overflow-hidden rounded-3xl bg-white/70 dark:bg-[#12122a]/80 backdrop-blur-xl border border-[#7c3aed]/20 shadow-[0_0_30px_rgba(124,58,237,0.1)]">
            <motion.span
              initial={{ rotate: -10 }}
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute top-2 right-2 bg-gradient-to-r from-[#ffd600] to-[#ffab00] text-[#1a0a4d] text-[9px] font-black px-2 py-0.5 rounded-lg shadow-[0_0_12px_rgba(255,214,0,0.3)]"
            >
              PRO
            </motion.span>
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#7c3aed]/20 to-[#ec4899]/20 border-2 border-[#7c3aed] flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(124,58,237,0.2)] select-none"
            >
              😎
            </motion.div>
            <h3 className="font-black text-base text-[var(--foreground)] mt-3">Alex (You)</h3>
            <p className="text-[10px] font-bold text-[#7c3aed]/50">alex@email.com</p>

            {/* Level progress */}
            <div className="w-full mt-4">
              <div className="flex justify-between text-[9px] font-black text-[#7c3aed]/50 mb-1">
                <span>LEVEL {userLevel}</span>
                <span>{userXP} / 700 XP</span>
              </div>
              <div className="w-full h-2.5 bg-white/50 dark:bg-[#1a1a3e]/50 rounded-full overflow-hidden border border-[#7c3aed]/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${xpPercent}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-[#7c3aed] to-[#ec4899] shadow-[0_0_12px_rgba(124,58,237,0.3)]"
                />
              </div>
            </div>
          </div>

          {/* Mini stats */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Rounds", value: "12" },
              { label: "Paid", value: "$340" },
              { label: "Luck", value: "42%" },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-3 text-center rounded-2xl bg-white/70 dark:bg-[#12122a]/80 backdrop-blur border border-[#7c3aed]/20 shadow-[0_0_12px_rgba(124,58,237,0.06)]"
              >
                <span className="text-[9px] font-bold text-[#7c3aed]/60 block uppercase">{stat.label}</span>
                <span className="text-xs font-black text-[var(--foreground)] block mt-1">{stat.value}</span>
              </motion.div>
            ))}
          </div>

          {/* Options links */}
          <div className="rounded-2xl bg-white/70 dark:bg-[#12122a]/80 backdrop-blur-xl border border-[#7c3aed]/20 overflow-hidden shadow-[0_0_16px_rgba(124,58,237,0.08)]">
            {[
              { label: "My Stats Details", icon: "📊", action: () => triggerToast("Loading detailed stats...") },
              { label: "Change Theme Mode", icon: theme === "light" ? "🌙" : "☀️", action: () => { soundManager.playTick(); toggleTheme(); triggerToast(`Switched to ${theme === "light" ? "Dark" : "Light"} theme!`); } },
              { label: "Achievements Guide", icon: "🏅", action: () => setView("achievements") },
              { label: "App Settings", icon: "⚙️", action: () => setView("settings") },
            ].map((item, idx) => (
              <motion.button
                key={idx}
                whileHover={{ x: 4 }}
                onClick={item.action}
                className="w-full px-4 py-3.5 flex items-center justify-between text-xs font-black text-[var(--foreground)] hover:bg-[#7c3aed]/5 transition text-left border-b border-[#7c3aed]/10 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                <ChevronRight size={12} className="text-[#7c3aed]/50" />
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // 12. Achievements
  const renderAchievementsView = () => (
    <div className="flex-1 flex flex-col bg-[#f5f0ff] dark:bg-[#0a0a1a] pb-16">
      {renderHeader("Achievements 🏅")}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        <div className="grid grid-cols-2 gap-3">
          {achievements.map((ach) => (
            <motion.div
              key={ach.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-4 rounded-2xl flex flex-col items-center text-center relative backdrop-blur-xl ${
                ach.unlocked
                  ? "bg-white/70 dark:bg-[#12122a]/80 border border-[#7c3aed]/40 shadow-[0_0_20px_rgba(124,58,237,0.15)]"
                  : "bg-white/40 dark:bg-[#12122a]/50 opacity-60 grayscale border border-[#7c3aed]/10"
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
              <div 
                className={`w-11 h-11 rounded-full flex items-center justify-center text-xl shadow mb-2 ${
                  ach.unlocked ? "bg-gradient-to-br from-[#ffd600]/20 to-[#ffab00]/20 border border-[#ffd600]/30" : "bg-white/50 dark:bg-[#1a1a3e]/50 border border-[#7c3aed]/10"
                }`}
              >
                {ach.icon}
              </div>
              <h4 className="text-[11px] font-black text-[var(--foreground)] truncate w-full">{ach.title}</h4>
              <p className="text-[8px] text-[#7c3aed]/50 font-semibold mt-0.5 leading-relaxed">{ach.desc}</p>
              <span className="text-[9px] font-black text-[#7c3aed] mt-2 bg-[#7c3aed]/5 px-2 py-0.5 rounded border border-[#7c3aed]/20">
                {ach.progress}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  // 13. Create Group Screen
  const renderCreateGroupView = () => (
    <div className="flex-1 flex flex-col bg-[#f5f0ff] dark:bg-[#0a0a1a]">
      {renderHeader("Create Group 🎨")}
      <div className="flex-1 p-5 space-y-4 overflow-y-auto">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-[#7c3aed]/60 uppercase">Group Name</label>
          <input
            type="text"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            placeholder="Weekend Squad 😎"
            className="w-full p-3 border border-[#7c3aed]/20 rounded-2xl text-xs font-bold bg-white/70 dark:bg-[#12122a]/80 backdrop-blur text-[var(--foreground)] outline-none focus:border-[#7c3aed]/50 focus:shadow-[0_0_16px_rgba(124,58,237,0.1)] transition-all"
          />
        </div>

        {/* Group Vibe Selector */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-[#7c3aed]/60 uppercase">Group Vibe Emoji</label>
          <div className="grid grid-cols-5 gap-2 select-none">
            {["🎉", "🍲", "😎", "🍻", "🍕"].map((vibe) => (
              <motion.button
                key={vibe}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setVibeSelected(vibe)}
                className={`p-3 rounded-xl text-xl flex items-center justify-center transition-all ${
                  vibeSelected === vibe
                    ? "bg-gradient-to-br from-[#7c3aed]/20 to-[#ec4899]/20 border border-[#7c3aed] shadow-[0_0_16px_rgba(124,58,237,0.2)]"
                    : "bg-white/70 dark:bg-[#12122a]/80 backdrop-blur border border-[#7c3aed]/20"
                }`}
              >
                {vibe}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Members addition */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-[#7c3aed]/60 uppercase">Mock Members</label>
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {["Alex 😎", "Jamie 🌟", "Sam 🎉", "Taylor 🔥", "Morgan 💫", "Casey 🦄"].map((m) => {
              const isAdded = newGroupMembers.includes(m);
              return (
                <motion.div
                  key={m}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => {
                    if (isAdded) {
                      setNewGroupMembers(newGroupMembers.filter((item) => item !== m));
                    } else {
                      setNewGroupMembers([...newGroupMembers, m]);
                    }
                  }}
                  className={`p-2.5 rounded-xl border flex justify-between items-center cursor-pointer text-xs font-bold transition-all ${
                    isAdded
                      ? "border-[#00c853] bg-[#00c853]/5 text-[#00c853] shadow-[0_0_12px_rgba(0,200,83,0.1)]"
                      : "bg-white/70 dark:bg-[#12122a]/80 backdrop-blur border border-[#7c3aed]/20 text-[var(--foreground)]"
                  }`}
                >
                  <span>{m}</span>
                  <span>{isAdded ? "✓ Added" : "+ Add"}</span>
                </motion.div>
              );
            })}
          </div>
        </div>

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
            setView("group");
          }}
          className="w-full justify-center py-3.5 rounded-2xl bg-gradient-to-r from-[#7c3aed] to-[#ec4899] text-white font-black text-xs shadow-[0_0_30px_rgba(124,58,237,0.3)] mt-4 flex items-center gap-2"
        >
          Create Group ▷
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
    <div className="flex-1 flex flex-col bg-[#f5f0ff] dark:bg-[#0a0a1a]">
      {renderHeader("Settings ⚙️")}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        <div className="rounded-2xl bg-white/70 dark:bg-[#12122a]/80 backdrop-blur-xl border border-[#7c3aed]/20 overflow-hidden shadow-[0_0_16px_rgba(124,58,237,0.08)]">
          {/* Sound Toggle */}
          <div className="px-4 py-3.5 flex items-center justify-between border-b border-[#7c3aed]/10">
            <div>
              <span className="text-xs font-black text-[var(--foreground)] block">Sound Effects</span>
              <span className="text-[9px] text-[#7c3aed]/50 font-semibold block mt-0.5">Spin wheel & roll sounds</span>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                soundManager.playTick();
                setSoundEnabled(!soundEnabled);
                triggerToast(soundEnabled ? "Muted sounds!" : "Sounds enabled!");
              }}
              className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                soundEnabled
                  ? "bg-gradient-to-r from-[#00c853]/20 to-[#00e676]/20 text-[#00c853] border border-[#00c853]/30 shadow-[0_0_12px_rgba(0,200,83,0.15)]"
                  : "bg-white/50 dark:bg-[#1a1a3e]/50 text-[#7c3aed]/40 border border-[#7c3aed]/10"
              }`}
            >
              {soundEnabled ? "On" : "Off"}
            </motion.button>
          </div>

          {/* Vibration Toggle */}
          <div className="px-4 py-3.5 flex items-center justify-between border-b border-[#7c3aed]/10">
            <div>
              <span className="text-xs font-black text-[var(--foreground)] block">Haptic Vibration</span>
              <span className="text-[9px] text-[#7c3aed]/50 font-semibold block mt-0.5">Feedback vibration when loser decided</span>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                soundManager.playTick();
                setVibrationEnabled(!vibrationEnabled);
                triggerToast(vibrationEnabled ? "Disabled vibration!" : "Vibration enabled!");
              }}
              className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                vibrationEnabled
                  ? "bg-gradient-to-r from-[#00c853]/20 to-[#00e676]/20 text-[#00c853] border border-[#00c853]/30 shadow-[0_0_12px_rgba(0,200,83,0.15)]"
                  : "bg-white/50 dark:bg-[#1a1a3e]/50 text-[#7c3aed]/40 border border-[#7c3aed]/10"
              }`}
            >
              {vibrationEnabled ? "On" : "Off"}
            </motion.button>
          </div>

          {/* Notifications Toggle */}
          <div className="px-4 py-3.5 flex items-center justify-between">
            <div>
              <span className="text-xs font-black text-[var(--foreground)] block">Push Notifications</span>
              <span className="text-[9px] text-[#7c3aed]/50 font-semibold block mt-0.5">Receive bills summary notifications</span>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                soundManager.playTick();
                setNotificationsEnabled(!notificationsEnabled);
                triggerToast(notificationsEnabled ? "Disabled notifications!" : "Notifications enabled!");
              }}
              className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                notificationsEnabled
                  ? "bg-gradient-to-r from-[#00c853]/20 to-[#00e676]/20 text-[#00c853] border border-[#00c853]/30 shadow-[0_0_12px_rgba(0,200,83,0.15)]"
                  : "bg-white/50 dark:bg-[#1a1a3e]/50 text-[#7c3aed]/40 border border-[#7c3aed]/10"
              }`}
            >
              {notificationsEnabled ? "On" : "Off"}
            </motion.button>
          </div>
        </div>

        <div className="rounded-2xl bg-white/70 dark:bg-[#12122a]/80 backdrop-blur-xl border border-[#7c3aed]/20 overflow-hidden shadow-[0_0_16px_rgba(124,58,237,0.08)]">
          {[
            { label: "Privacy Policy", icon: "🔒" },
            { label: "Help & Support", icon: "💬" },
            { label: "About WhoPay", icon: "ℹ️" },
          ].map((item, idx) => (
            <motion.button
              key={idx}
              whileHover={{ x: 4 }}
              onClick={() => triggerToast(`Clicked ${item.label}`)}
              className="w-full px-4 py-3.5 flex items-center justify-between text-xs font-black text-[var(--foreground)] hover:bg-[#7c3aed]/5 transition text-left border-b border-[#7c3aed]/10 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              <ChevronRight size={12} className="text-[#7c3aed]/50" />
            </motion.button>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            soundManager.playTick();
            setView("splash");
            triggerToast("Logged out of session!");
          }}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-500 border border-red-500/30 font-black text-xs flex items-center justify-center gap-2 backdrop-blur hover:shadow-[0_0_20px_rgba(239,68,68,0.15)] transition-all"
        >
          <LogOut size={14} /> Log Out
        </motion.button>
      </div>
    </div>
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
              className="flex-1 flex flex-col h-full"
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
