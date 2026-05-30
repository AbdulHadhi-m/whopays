import { Home, Users, Dices, Trophy, History, Settings, User, Medal, Wand2, Ghost, Moon, Sun } from "lucide-react";
import { useGameStore } from "@/store/useGameStore";
import { soundManager } from "@/components/shared/SoundManager";

export default function Sidebar() {
  const { currentView, setView, theme, toggleTheme } = useGameStore();

  const links = [
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

  return (
    <div className="hidden lg:flex flex-col w-[280px] h-[calc(100%-2rem)] bg-white dark:bg-[#12122a] text-gray-900 dark:text-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.25)] z-20 transition-colors duration-300 rounded-[2.5rem] my-4 ml-4 border-4 border-slate-100 dark:border-slate-800">
      
      {/* Brand Header with Cartoon Tilt Icon */}
      <div className="flex items-center gap-3 mb-8 pl-2">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 dark:from-purple-700 dark:to-blue-700 rounded-2xl flex items-center justify-center shadow-[0_6px_0_#3730a3] border-2 border-indigo-800 rotate-[-5deg] overflow-hidden p-1">
          <img src="/logos/whopayLogo.svg" alt="WhoPay" className="w-full h-full object-contain" />
        </div>
        <h1 className="text-[28px] font-black tracking-tighter drop-shadow-sm text-gray-900 dark:text-white">WhoPay</h1>
      </div>

      {/* Navigation list with original cartoon lift button physics */}
      <nav className="flex-1 space-y-2.5 pr-2 overflow-y-auto custom-scrollbar pb-4">
        {links.map((link) => {
          const isActive = currentView === link.view;
          return (
            <button
              key={link.label}
              onClick={() => {
                soundManager.playTick();
                setView(link.view as any);
              }}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-[1.2rem] font-black text-sm transition-all border-4 ${
                isActive
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-700 dark:to-blue-700 text-white border-indigo-800 dark:border-indigo-900 shadow-[0_4px_0_#3730a3] dark:shadow-[0_4px_0_#1e1b4b] translate-y-[-2px]"
                  : "bg-transparent text-slate-500 dark:text-slate-400 border-transparent hover:bg-slate-100 dark:hover:bg-white/10 hover:border-slate-200 dark:hover:border-white/20"
              } active:shadow-none active:translate-y-[2px]`}
            >
              {link.icon}
              <span className="mt-0.5">{link.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Cartoon Theme Switcher block */}
      <div className="mt-4 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 p-4 rounded-[2rem] border-4 border-indigo-800 shadow-[0_6px_0_#3730a3] relative overflow-hidden flex flex-col items-center text-center">
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
    </div>
  );
}
