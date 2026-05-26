import { motion } from "framer-motion";
import { useGameStore } from "@/store/useGameStore";
import { soundManager } from "@/components/shared/SoundManager";
import { Dices, ArrowRight, Star } from "lucide-react";

export default function HeroArea() {
  const { setView } = useGameStore();

  return (
    <div className="bg-white dark:bg-payspin-dark-card rounded-[2.5rem] p-8 md:p-10 shadow-[0_12px_40px_-10px_rgba(37,99,235,0.15)] border-4 border-white dark:border-payspin-dark-card flex flex-col md:flex-row items-center justify-between relative overflow-hidden mb-8">
      {/* Background playful blob */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-payspin-yellow/20 to-payspin-pink/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      
      <div className="z-10 max-w-xl">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="inline-block px-5 py-2.5 rounded-full bg-payspin-yellow/20 border-2 border-payspin-yellow text-payspin-yellow-dark dark:text-payspin-yellow font-black text-sm mb-6 flex items-center gap-2 w-max shadow-[0_4px_0_rgba(251,191,36,0.3)]"
        >
          <span className="text-2xl animate-bounce">🤑</span> Because someone has to pay!
        </motion.div>
        
        <motion.h1 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.1 }}
          className="text-5xl lg:text-[4.5rem] font-black text-slate-800 dark:text-white leading-[1.1] mb-6 tracking-tight"
        >
          Spin it. Roll it.<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-payspin-blue to-payspin-purple drop-shadow-sm">You pay it!</span>
        </motion.h1>
        
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-slate-500 dark:text-slate-300 font-bold text-lg mb-10 max-w-md leading-relaxed"
        >
          The fun, fair, and slightly chaotic way to decide who pays the restaurant bill. No more awkward moments!
        </motion.p>

        <div className="flex flex-wrap items-center gap-5">
          <motion.button
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95, y: 0 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.3 }}
            onClick={() => {
              soundManager.playTick();
              setView("spin");
            }}
            className="px-8 py-5 bg-gradient-to-b from-[#a855f7] to-[#7e22ce] border-b-[6px] border-[#581c87] text-white rounded-3xl font-black text-lg flex items-center gap-3 shadow-[0_10px_20px_rgba(147,51,234,0.4)] active:border-b-0 active:mt-[6px] transition-all"
          >
            Start Spinning <ArrowRight size={24} strokeWidth={3} />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95, y: 0 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.4 }}
            onClick={() => {
              soundManager.playTick();
              setView("dice");
            }}
            className="px-8 py-5 bg-white dark:bg-slate-800 border-4 border-slate-200 border-b-[8px] dark:border-slate-700 dark:border-b-slate-900 text-slate-700 dark:text-white rounded-3xl font-black text-lg flex items-center gap-3 shadow-lg active:border-b-4 active:mt-[4px] transition-all"
          >
            Roll Dice <Dices size={24} strokeWidth={3} className="text-payspin-blue" />
          </motion.button>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10 flex items-center gap-4 bg-payspin-bg dark:bg-slate-800/50 p-3 rounded-2xl w-max border-2 border-slate-100 dark:border-slate-700/50"
        >
          <div className="flex -space-x-3">
            {["👱‍♂️","👩‍🦰","🧔"].map((emoji, i) => (
              <div key={i} className="w-12 h-12 rounded-full border-4 border-white dark:border-payspin-dark-card bg-[#e2e8f0] flex items-center justify-center overflow-hidden shadow-sm z-10 text-xl">
                {emoji}
              </div>
            ))}
          </div>
          <div className="pr-2">
            <div className="flex items-center gap-1 text-[#fbbf24] mb-0.5">
              {[1,2,3,4,5].map((i) => <Star key={i} size={16} fill="currentColor" strokeWidth={0} />)}
            </div>
            <p className="text-xs font-black text-slate-500 dark:text-slate-400">
              <span className="text-slate-800 dark:text-white">50,000+</span> happy groups
            </p>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.3 }}
        className="relative w-full md:w-[45%] h-72 md:h-[450px] mt-10 md:mt-0 flex items-center justify-center perspective-[1000px]"
      >
        {/* Placeholder for the main 3D illustration / character */}
        <motion.div 
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10 w-full max-w-[320px] aspect-square bg-gradient-to-br from-white to-payspin-bg dark:from-slate-800 dark:to-slate-900 rounded-[3rem] shadow-[0_20px_50px_rgba(37,99,235,0.2)] flex flex-col items-center justify-center border-8 border-white dark:border-slate-700"
        >
           {/* If user provides logo.png, replace this div with Image */}
           <div className="text-center p-6">
             <div className="text-8xl mb-4 drop-shadow-xl animate-bounce" style={{ animationDuration: '2s' }}>😜</div>
             <p className="font-black text-slate-800 dark:text-white text-xl mb-1">Add Mascot Here</p>
             <p className="font-bold text-slate-400 text-xs px-4">Place your awesome cartoon character image in the public folder!</p>
           </div>
           
           {/* Decorative floating elements */}
           <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute -top-6 -right-6 text-4xl drop-shadow-lg">🎲</motion.div>
           <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="absolute -bottom-4 -left-4 text-4xl drop-shadow-lg">🪙</motion.div>
           <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} className="absolute top-1/2 -right-8 text-3xl drop-shadow-lg">✨</motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
