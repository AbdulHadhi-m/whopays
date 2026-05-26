import { motion } from "framer-motion";
import { useGameStore } from "@/store/useGameStore";
import { soundManager } from "@/components/shared/SoundManager";

export default function DashboardCards() {
  const { setView } = useGameStore();

  const cards = [
    {
      title: "How It Works",
      desc: "It's as easy as 1-2-3!",
      icon: "💡",
      color: "bg-[#22c55e]",
      borderColor: "border-[#16a34a]",
      shadow: "shadow-[0_8px_0_#16a34a]",
      view: "how-it-works",
      details: ["Add your friends to a group", "Spin the wheel or roll the dice", "Whoever lands on, pays the bill!"]
    },
    {
      title: "Create Group",
      desc: "Create a New Group",
      icon: "👥",
      color: "bg-[#ec4899]",
      borderColor: "border-[#db2777]",
      shadow: "shadow-[0_8px_0_#db2777]",
      view: "create-group",
      details: ["Weekend Squad 🤩", "Dinner Time 🍽️", "Office Team 💼"]
    },
    {
      title: "Spin / Roll",
      desc: "Let fate decide",
      icon: "🎰",
      color: "bg-[#3b82f6]",
      borderColor: "border-[#2563eb]",
      shadow: "shadow-[0_8px_0_#2563eb]",
      view: "spin",
      details: ["Spin Wheel", "Roll Dice", "Multiple Modes"]
    },
    {
      title: "Result",
      desc: "We Have a Winner!",
      icon: "🎉",
      color: "bg-[#f59e0b]",
      borderColor: "border-[#d97706]",
      shadow: "shadow-[0_8px_0_#d97706]",
      view: "result",
      details: ["Sam Pays!", "Better luck next time 😜"]
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {cards.map((card, idx) => (
        <motion.div
          key={idx}
          whileHover={{ y: -6, scale: 1.02 }}
          whileTap={{ y: 2, scale: 0.98 }}
          onClick={() => {
            soundManager.playTick();
            setView(card.view as any);
          }}
          className={`bg-white dark:bg-slate-800 rounded-3xl p-0 overflow-hidden cursor-pointer flex flex-col h-full border-4 border-slate-200 dark:border-slate-700 transition-all ${card.shadow} hover:shadow-[0_12px_0_var(--tw-shadow-color)] active:shadow-[0_0_0_var(--tw-shadow-color)]`}
          style={{ '--tw-shadow-color': card.shadow.split('_').pop()?.replace(']', '') } as any}
        >
          <div className={`${card.color} border-b-4 ${card.borderColor} p-4 text-white flex items-center justify-center gap-2 font-black text-lg`}>
             <span className="text-2xl drop-shadow-md">{card.icon}</span> <span className="drop-shadow-md tracking-wide">{card.title}</span>
          </div>
          <div className="p-6 flex-1 flex flex-col items-center justify-center text-center">
            <h3 className="font-black text-slate-800 dark:text-white mb-5 text-lg">{card.desc}</h3>
            
            <div className="w-full space-y-3 mt-auto">
              {card.details.map((detail, dIdx) => (
                <div key={dIdx} className="bg-slate-100 dark:bg-slate-900/50 p-2.5 rounded-2xl text-xs font-black text-slate-600 dark:text-slate-300 flex items-center gap-3 border-2 border-slate-200 dark:border-slate-700/50">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] text-white shadow-sm ${card.color}`}>
                    {dIdx + 1}
                  </div>
                  <span className="truncate">{detail}</span>
                </div>
              ))}
            </div>
            
            <button className={`w-full mt-6 py-3 rounded-2xl text-white font-black text-sm transition-colors border-b-4 ${card.borderColor} ${card.color} hover:brightness-110 active:border-b-0 active:mt-[28px]`}>
              {card.view === 'create-group' ? 'Create Group' : card.view === 'spin' ? 'Go to game' : 'View Details'}
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
