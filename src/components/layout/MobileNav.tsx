import { Home, Users, PlusCircle, History, Menu, X, Dices, Trophy, Settings, User, Medal, Wand2, Ghost, Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/store/useGameStore";
import { soundManager } from "@/components/shared/SoundManager";
import { useState } from "react";

export default function MobileNav() {
  const { currentView, setView, theme, toggleTheme } = useGameStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const tabs = [
    { icon: <Home size={24} strokeWidth={2.5} />, label: "Home", view: "home" },
    { icon: <Users size={24} strokeWidth={2.5} />, label: "Groups", view: "group" },
    { icon: <PlusCircle size={32} strokeWidth={3} />, label: "", view: "create-group", isMain: true },
    { icon: <History size={24} strokeWidth={2.5} />, label: "History", view: "history" },
    { icon: <Menu size={24} strokeWidth={2.5} />, label: "Menu", view: "menu", isMenu: true },
  ];

  const allLinks = [
    { icon: <Home size={22} strokeWidth={2.5} />, label: "Home", view: "home" },
    { icon: <Dices size={22} strokeWidth={2.5} />, label: "Spin Wheel", view: "spin" },
    { icon: <Dices size={22} strokeWidth={2.5} />, label: "Roll Dice", view: "dice" },
    { icon: <Users size={22} strokeWidth={2.5} />, label: "Group", view: "group" },
    { icon: <Ghost size={22} strokeWidth={2.5} />, label: "Troll Corner", view: "troll" },
    { icon: <Trophy size={22} strokeWidth={2.5} />, label: "Leaderboard", view: "leaderboard" },
    { icon: <History size={22} strokeWidth={2.5} />, label: "History", view: "history" },
    { icon: <User size={22} strokeWidth={2.5} />, label: "Profile", view: "profile" },
    { icon: <Medal size={22} strokeWidth={2.5} />, label: "Achievements", view: "achievements" },
    { icon: <Wand2 size={22} strokeWidth={2.5} />, label: "Meme Generator", view: "meme-generator" },
    { icon: <Settings size={22} strokeWidth={2.5} />, label: "Settings", view: "settings" },
  ];

  const currentTab = ["home", "spin", "dice", "result", "dice-modes"].includes(currentView)
    ? "home"
    : ["group", "join-group"].includes(currentView)
    ? "group"
    : currentView;

  return (
    <>
      <div className="lg:hidden fixed bottom-4 left-4 right-4 h-[72px] bg-white dark:bg-slate-800 shadow-[0_10px_40px_rgba(0,0,0,0.1)] rounded-[2rem] border-4 border-slate-100 dark:border-slate-700 flex items-center justify-around z-40 px-2">
        {tabs.map((tab, idx) => {
          const isActive = currentTab === tab.view || (tab.view === "create-group" && currentView === "create-group");
          
          if (tab.isMain) {
            return (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.9, y: 0 }}
                onClick={() => setView(tab.view as any)}
                className="relative -top-6 flex flex-col items-center justify-center w-[72px] h-[72px] rounded-full bg-gradient-to-b from-payspin-blue to-payspin-blue-dark text-white shadow-[0_8px_0_#1e3a8a] border-4 border-white dark:border-slate-800 active:shadow-none active:translate-y-[8px] transition-all"
              >
                {tab.icon}
              </motion.button>
            );
          }

          return (
            <button
              key={idx}
              onClick={() => {
                if (tab.isMenu) {
                  setMenuOpen(true);
                } else {
                  setView(tab.view as any);
                }
              }}
              className="flex flex-col items-center justify-center flex-1 py-1"
            >
              <motion.div 
                whileTap={{ scale: 0.8 }}
                className={`p-2 rounded-2xl transition-all ${isActive ? 'text-payspin-blue bg-blue-50 dark:bg-slate-700 dark:text-payspin-yellow shadow-inner' : 'text-slate-400 hover:text-slate-500'}`}
              >
                {tab.icon}
              </motion.div>
              <span
                className={`text-[9px] font-black uppercase tracking-wider mt-1 ${isActive ? "text-payspin-blue dark:text-payspin-yellow" : "text-slate-400"}`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {menuOpen && (
          <div className="lg:hidden fixed inset-0 z-[100] flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-[280px] h-full bg-payspin-blue dark:bg-payspin-dark-card text-white p-6 shadow-2xl relative z-[101] flex flex-col border-r-4 border-payspin-blue-dark dark:border-slate-800"
            >
              <div className="flex items-center gap-3 mb-8 mt-4 pl-2">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-payspin-blue font-black text-2xl shadow-[0_6px_0_#9333ea] border-2 border-payspin-blue rotate-[-5deg]">
                  <span>🎲</span>
                </div>
                <h1 className="text-[28px] font-black tracking-tighter drop-shadow-md text-white">PaySpin</h1>
                <button 
                  onClick={() => setMenuOpen(false)}
                  className="ml-auto w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all"
                >
                  <X size={20} strokeWidth={3} />
                </button>
              </div>

              <nav className="flex-1 space-y-2.5 pr-2 overflow-y-auto custom-scrollbar pb-4">
                {allLinks.map((link) => {
                  const isActive = currentView === link.view;
                  return (
                    <button
                      key={link.label}
                      onClick={() => {
                        soundManager.playTick();
                        setView(link.view as any);
                        setMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-4 px-4 py-3 rounded-[1.2rem] font-black text-sm transition-all border-4 ${
                        isActive
                          ? "bg-payspin-yellow text-payspin-text border-[#d97706] shadow-[0_4px_0_#d97706] translate-y-[-2px]"
                          : "bg-transparent text-payspin-blue-100 border-transparent hover:bg-white/10 hover:border-white/20"
                      } active:shadow-none active:translate-y-[2px]`}
                    >
                      {link.icon}
                      <span className="mt-0.5">{link.label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="mt-4 bg-gradient-to-br from-[#a855f7] to-[#7e22ce] p-4 rounded-[2rem] border-4 border-[#581c87] shadow-[0_6px_0_#581c87] relative overflow-hidden flex flex-col items-center text-center">
                <div className="absolute -top-6 -right-6 w-20 h-20 bg-white/20 rounded-full blur-2xl"></div>
                <button
                  onClick={() => {
                    soundManager.playTick();
                    toggleTheme();
                  }}
                  className="relative z-10 w-full bg-white/20 hover:bg-white/30 border-2 border-white/40 text-white font-black text-xs py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
                  {theme === "light" ? "Dark Mode" : "Light Mode"}
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
