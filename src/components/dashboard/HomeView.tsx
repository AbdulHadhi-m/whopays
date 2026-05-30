"use client";

import React from "react";
import { motion } from "framer-motion";
import { useGameStore } from "@/store/useGameStore";
import { soundManager } from "@/components/shared/SoundManager";

export default function HomeView() {
  const { setView, setMenuOpen } = useGameStore();

  return (
    <div className="flex-1 bg-[#faf8ff] dark:bg-[#0a0a1a] text-gray-900 dark:text-white font-sans overflow-x-hidden flex flex-col h-full relative transition-colors duration-300">
      <style dangerouslySetInnerHTML={{__html: `
        /* Card Shadow Styling */
        .action-card {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02);
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .dark .action-card {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2);
        }

        /* Interactive Cards: Lift, Scale and Glow */
        .action-card:active, .action-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 25px -5px rgba(37, 99, 235, 0.1), 0 10px 10px -5px rgba(37, 99, 235, 0.04);
          border-color: rgba(37, 99, 235, 0.2);
        }
        .dark .action-card:active, .dark .action-card:hover {
          box-shadow: 0 20px 25px -5px rgba(124, 58, 237, 0.2), 0 10px 10px -5px rgba(124, 58, 237, 0.1);
          border-color: rgba(124, 58, 237, 0.4);
        }

        /* Entrance Animations */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-entrance {
          animation: fadeInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          opacity: 0;
        }

        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.3s; }
        .delay-3 { animation-delay: 0.5s; }
        .delay-4 { animation-delay: 0.6s; }

        /* Mascot Motion: Gentle Floating */
        @keyframes homeFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .float-animation {
          animation: homeFloat 4s ease-in-out infinite;
        }

        /* Mascot Wink Animation */
        @keyframes wink {
          0%, 45%, 55%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .wink-overlay {
          position: absolute;
          top: 38%; 
          left: 41%;
          width: 12%;
          height: 12%;
          background: #faf8ff;
          border-radius: 50%;
          animation: wink 5s infinite;
          pointer-events: none;
          transition: background-color 0.3s;
        }
        .dark .wink-overlay {
          background: #0a0a1a;
        }

        /* Magnetic Effect simulation on tap */
        .btn-magnetic {
          transition: transform 0.2s cubic-bezier(0.33, 1, 0.68, 1);
        }
        .btn-magnetic:active {
          transform: scale(0.92);
        }
      `}} />
      
      {/* BEGIN: MainHeader */}
      <header className="flex items-center justify-between px-6 py-4 bg-transparent z-20" data-purpose="top-navigation">
        <button aria-label="Menu" className="p-1 btn-magnetic" onClick={() => setMenuOpen(true)}>
          <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" width="24">
            <line x1="4" x2="20" y1="12" y2="12"></line>
            <line x1="4" x2="20" y1="6" y2="6"></line>
            <line x1="4" x2="20" y1="18" y2="18"></line>
          </svg>
        </button>
        <div className="flex items-center space-x-2" data-purpose="brand-logo">
          <div className="w-8 h-8 rounded-full bg-blue-600 dark:bg-[#7c3aed] flex items-center justify-center overflow-hidden transition-colors">
            <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 100 100">
              <path d="M50 10C27.9 10 10 27.9 10 50s17.9 40 40 40 40-17.9 40-40S72.1 10 50 10zm0 70c-16.6 0-30-13.4-30-30s13.4-30 30-30 30 13.4 30 30-13.4 30-30 30z"></path>
              <path d="M50 30l-5 20h10l-5-20z"></path>
            </svg>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-[#1a1a1a] dark:text-white transition-colors">PaySpin</span>
        </div>
        <button aria-label="Notifications" className="relative p-1 btn-magnetic" onClick={() => setView("history")}>
          <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24">
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#0a0a1a]"></span>
        </button>
      </header>
      {/* END: MainHeader */}

      <main className="flex-1 overflow-y-auto z-10">
        {/* BEGIN: HeroSection */}
        <section className="flex flex-col items-center justify-center px-6 pt-4 pb-8" data-purpose="hero">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative w-80 h-80 mb-6"
            data-purpose="mascot-container"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-full h-full"
            >
              <img
                alt="PaySpin Mascot"
                className="w-full h-full object-contain drop-shadow-[0_0_40px_rgba(124,58,237,0.25)]"
                src="/images/mainpageicon.svg"
              />
            </motion.div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-3 bg-gray-200 dark:bg-gray-800 blur-md rounded-full opacity-50 dark:opacity-60 -z-10 transition-colors"></div>
          </motion.div>
          <div className="text-center max-w-xs mx-auto animate-entrance delay-2">
            <h1 className="text-3xl font-extrabold text-[#1a1a1a] dark:text-white leading-tight transition-colors">
              Let fate decide<br/>who pays!
            </h1>
          </div>
        </section>
        {/* END: HeroSection */}
        
        {/* BEGIN: QuickActions */}
        <section className="grid grid-cols-2 gap-4 px-6" data-purpose="navigation-cards">
          <div 
            onClick={() => { soundManager.playTick(); setView("spin"); }}
            className="action-card bg-white dark:bg-[#12122a]/90 rounded-[1.25rem] p-2 flex flex-row items-center justify-center gap-3 aspect-[3/1] border border-gray-50 dark:border-[#7c3aed]/20 animate-entrance delay-3 cursor-pointer backdrop-blur-sm"
          >
            <div className="flex justify-center text-gray-900 dark:text-white" data-purpose="wheel-illustration">
              <svg height="60" viewBox="0 0 100 100" width="60" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" className="fill-gray-100 dark:fill-slate-800 transition-colors"></circle>
                <path d="M50 50 L50 5 A45 45 0 0 1 95 50 Z" fill="#2563eb" stroke="currentColor" strokeWidth="1.5" className="dark:fill-[#7c3aed] transition-colors"></path>
                <path d="M50 50 L95 50 A45 45 0 0 1 50 95 Z" stroke="currentColor" strokeWidth="1.5" className="fill-white dark:fill-[#1e1e3f] transition-colors"></path>
                <path d="M50 50 L50 95 A45 45 0 0 1 5 50 Z" fill="#3b82f6" stroke="currentColor" strokeWidth="1.5" className="dark:fill-[#ec4899] transition-colors"></path>
                <path d="M50 50 L5 50 A45 45 0 0 1 50 5 Z" stroke="currentColor" strokeWidth="1.5" className="fill-white dark:fill-[#1e1e3f] transition-colors"></path>
                <circle cx="50" cy="50" r="8" stroke="currentColor" strokeWidth="2" className="fill-white dark:fill-slate-700 transition-colors"></circle>
                <circle cx="70" cy="30" r="4" className="fill-[#60a5fa] dark:fill-[#a855f7] transition-colors"></circle>
              </svg>
            </div>
            <span className="font-bold text-gray-800 dark:text-gray-200 text-sm transition-colors">Spin Wheel</span>
          </div>
          <div 
            onClick={() => { soundManager.playTick(); setView("dice"); }}
            className="action-card bg-white dark:bg-[#12122a]/90 rounded-[1.25rem] p-2 flex flex-row items-center justify-center gap-3 aspect-[3/1] border border-gray-50 dark:border-[#7c3aed]/20 animate-entrance delay-4 cursor-pointer backdrop-blur-sm"
          >
            <div className="flex justify-center text-gray-900 dark:text-white" data-purpose="dice-illustration">
              <svg height="60" viewBox="0 0 100 100" width="60" xmlns="http://www.w3.org/2000/svg">
                <rect height="50" rx="8" stroke="currentColor" strokeWidth="2.5" transform="rotate(5 50 50)" width="50" x="25" y="25" className="fill-white dark:fill-[#1e1e3f] transition-colors"></rect>
                <circle cx="42" cy="42" r="4" transform="rotate(5 50 50)" className="fill-gray-900 dark:fill-white transition-colors"></circle>
                <circle cx="58" cy="42" r="4" transform="rotate(5 50 50)" className="fill-gray-900 dark:fill-white transition-colors"></circle>
                <circle cx="50" cy="50" r="4" transform="rotate(5 50 50)" className="fill-gray-900 dark:fill-white transition-colors"></circle>
                <circle cx="42" cy="58" r="4" transform="rotate(5 50 50)" className="fill-gray-900 dark:fill-white transition-colors"></circle>
                <circle cx="58" cy="58" r="4" transform="rotate(5 50 50)" className="fill-gray-900 dark:fill-white transition-colors"></circle>
              </svg>
            </div>
            <span className="font-bold text-gray-800 dark:text-gray-200 text-sm transition-colors">Roll Dice</span>
          </div>
        </section>
        {/* END: QuickActions */}
      </main>


    </div>
  );
}
