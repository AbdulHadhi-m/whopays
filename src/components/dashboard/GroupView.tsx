"use client";

import React from "react";
import { motion } from "framer-motion";
import { useGameStore } from "@/store/useGameStore";
import { soundManager } from "@/components/shared/SoundManager";

const AVATAR_IMAGES = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBA3W5jkBZSjF4GHjkUw8VbfdweO1ahhn5i91hzs8fU50I2YVA-QdCCs9BnvNNObyrJnnIbjpWn5Ehi0WQn8eklhEDn4N4HbeXUM0MP2w_p7nAoQ3kbvarOypeL3-OLuuEiVY2NAYIEYYIa2nL16yceeanFA0GZz1PGA_dhoulA7jagA5zS-QNDdnwTvyVf2MDHhXX5auzU0VzO0miVodsomXXw8UFld3T87mKe-UNVtcLE-hYfdkopjf3b9wOe291jX_7JpXUTmao4",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCS0g_flfDWDvmL-VwSSibQDX20wCsvvdeL3mSaL2c9R87d-O5MaJa2IO9rf-8YwFRg2QbcdAN0mgMdE7JLEK4EVdrNHU4d9yODgN0zyF79hGaFwoU-TX2X3aNmL3tl_LpZFRwVhX8uaXuYaWrehLGyTFuXWexv7ix42ZJcEEZMs-IaltDSZdyf-YxIHLhRfFlFqs-O2GjRwPOeJv3X0q9PMVEMFTbQVOLZc3FKXdpzvvzOl9e8W4FyeqHmSn4wl0VRhpvfCppPz2xI",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDKV8s45ReFP03rGgMLPfSiA3XlEzhOEp46zeZVaJWLWHsiLyIdhkbRZai5pJo59cUUV2JH3jFSv4DFPFSbQdDCSzrNqhrc1B8QprrHmZn1Lxnu7OCW0LZrKWREeLMP4QVUkqo8yIrsi6Sn_LjzLmpHsHkf3R55c2gCfrprTOaS20Fo03CtFTm4J-HY1czf_cZ1jSuAxOYS3OaDjbT2NXQP-Bo88nGJu8WCd-KFyv2EbzNL9xM0xS6dh9xQpuosCF3Z5pwwOK7z9GA1",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBY2ceI9BVNTEcsVmkYEdpXilrAcG38NA1H_HADCmEBOTlEoGU_ge7uK5cCAys0d9NxNmSCiWFrKdpWKHL1vJIrX0CUi1B3HBkCWOrL1C61Ans6YVTenGAxtEdFNq-SAuyxEcSPNO2gA4gyBN6caNz6VYKOWPMdwX24xnFXttSaZLIugC65TPWWTEryI5WLLUTnvdcRon30ysXqPzBvv_ZPto9nz5ftgkWYXj-DQ3-whn7b1JZYItN89Q5eZF_RUAoJ7g_A79hiq3HD",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAlZ4AXLSAfHRDn3sWDNnkCFaOMhEkj7SZAWu_RujDX5xFgdtJJTEmI8V2voSup8Ilo1GofuwqYTrjID_5y6qQAmt9SL8MAomNyx6z-f4hXMK_jIsLp2DhSY9qBpBqk--BNlIoXCiv6nfI70tPFeZM1Fkc-Me5s4iBvpsw9GVBLA0OI8s8ijvtRZAphznfoai5YR65EXf4_LsbpJR_C0tYwmi6v-Po-NA-NpxVtcGkkRwEv17AimAsxzAfHe10xYHQH0yPN-HXNCZsx",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAz1Mrw5brcuK_PqGrdRC5KR2fQxfLRYqnzhBQsdG9AQWxhi8W6LUBW2vPUuyGloKMvJ1gZ1uaLXiX9xS5YaLJIQrPcQD6b2rEOdO-vYXOLfqfuvPPsat_0zJD-S1OJRAuG4pte8X8j2WqYAYiWvEYNQU43EWYPzmFU0L37Q8N77B8hRv9u0ee4FLMJ8SFTaEA9lEFjThs2HDsty3ESqPQcZ12A_HFwPmoWHHjMb8ry2EwDYSCtBEN7DSQiKiTSiySmwdJxGjWcDTdt",
];

const STATUS_COLORS = [
  "bg-yellow-400",
  "bg-yellow-400",
  "bg-purple-500",
  "bg-purple-500",
  "bg-red-500",
  "bg-green-500",
];

const MEMBER_STYLES = `
  .member-list-item:last-child {
    border-bottom: none !important;
  }
  .status-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
  }
`;

export default function GroupView() {
  const { setView, groups, activeGroupId, setActiveGroupId, deleteGroup, addParticipant, removeParticipant, editParticipant } = useGameStore();
  const [showGroups, setShowGroups] = React.useState(false);
  const [newMemberName, setNewMemberName] = React.useState("");
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);
  const [editName, setEditName] = React.useState("");
  const activeGroup = groups.find((g) => g.id === activeGroupId) || groups[0];
  const members = activeGroup?.members ?? [];

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newMemberName.trim();
    if (!name) return;
    soundManager.playTick();
    addParticipant(name);
    setNewMemberName("");
  };

  const handleDeleteMember = (index: number) => {
    soundManager.playTick();
    removeParticipant(index);
  };

  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setEditName(members[index]);
  };

  const handleSaveEdit = () => {
    if (editingIndex === null || !editName.trim()) return;
    soundManager.playTick();
    editParticipant(editingIndex, editName);
    setEditingIndex(null);
    setEditName("");
  };

  return (
    <div className="flex-1 flex flex-col bg-[#faf8ff] dark:bg-[#0a0a1a] text-slate-800 dark:text-white transition-colors duration-300 overflow-hidden">
      {/* Inline styles for member list tweaks */}
      <style>{MEMBER_STYLES}</style>

      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="flex flex-col items-center px-4 pt-6 pb-2 sticky top-0 bg-[#faf8ff] dark:bg-[#0a0a1a] z-10 transition-colors border-b border-slate-100 dark:border-slate-800/50">
        <div className="flex items-center justify-between w-full">
          {/* Back */}
          <button
            onClick={() => { soundManager.playTick(); setView("home"); }}
            aria-label="Go back"
            className="p-2 -ml-2 text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" width="24">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>

          {/* Title (clickable to toggle group list) */}
          <div className="text-center">
            <button onClick={() => setShowGroups(!showGroups)} className="flex items-center gap-1.5 mx-auto">
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {activeGroup?.name || "Dinner Squad"}
              </h1>
              <svg className={`w-4 h-4 text-slate-400 transition-transform ${showGroups ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
              </svg>
            </button>
          </div>

          {/* Settings */}
          <button
            onClick={() => { soundManager.playTick(); setView("settings"); }}
            aria-label="Settings"
            className="p-2 -mr-2 text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
        </div>

        {/* Member count subtitle */}
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
          {members.length} Members
        </span>

        {/* Group Switcher Dropdown */}
        {showGroups && (
          <div className="w-full mt-3 bg-white dark:bg-[#12122a] rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-lg">
            {groups.map((g) => (
              <div
                key={g.id}
                className={`flex items-center gap-3 px-4 py-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                  g.id === activeGroupId ? "bg-blue-50 dark:bg-blue-900/20" : ""
                }`}
              >
                <button
                  onClick={() => { soundManager.playTick(); setActiveGroupId(g.id); setShowGroups(false); }}
                  className="flex items-center gap-3 flex-1 text-left"
                >
                  <span className="text-xl">{g.emoji}</span>
                  <div className="flex-1">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">{g.name}</span>
                    <span className="text-xs text-slate-400 ml-2">{g.members.length} members</span>
                  </div>
                  {g.id === activeGroupId && (
                    <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
                {groups.length > 1 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); soundManager.playTick(); deleteGroup(g.id); }}
                    className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-500 flex items-center justify-center flex-shrink-0 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => { soundManager.playTick(); setShowGroups(false); setView("create-group"); }}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 text-blue-600 dark:text-blue-400 font-bold"
            >
              <span className="text-xl">+</span>
              <span>Create New Group</span>
            </button>
          </div>
        )}
      </header>

      {/* ── Main Content ────────────────────────────────────────── */}
      <main className="flex-grow pb-24 overflow-y-auto">

        {/* Hero Illustration */}
        <section className="px-4 py-4">
          <div className="w-full flex justify-center">
            <motion.img
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              alt="Group page icon"
              className="w-full h-auto max-w-[420px] object-contain drop-shadow-[0_0_30px_rgba(124,58,237,0.2)]"
              src="/images/grouptpageicon.svg"
            />
          </div>
        </section>

        {/* Members Section */}
        <section className="mt-2 px-4">
          {/* Section header */}
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Members</h2>
            <button
              onClick={() => { soundManager.playTick(); setView("create-group"); }}
              className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 px-4 py-1.5 rounded-full transition-all active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 5v14m-7-7h14" strokeLinecap="round" strokeWidth="2.5"/></svg>
              New Group
            </button>
          </div>

          {/* Add member form */}
          <form onSubmit={handleAddMember} className="flex gap-2 mb-4">
            <input
              type="text"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              placeholder="Add member name..."
              maxLength={15}
              className="flex-1 px-4 py-2.5 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-[#12122a] text-sm font-semibold text-slate-800 dark:text-white outline-none focus:border-blue-400 dark:focus:border-blue-500 transition-colors"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 active:scale-95 transition-all"
            >
              Add
            </button>
          </form>

          {/* Member list card */}
          <div className="bg-white dark:bg-[#12122a] rounded-2xl shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800 transition-colors">
            {members.length === 0 ? (
              <p className="text-center text-sm text-slate-400 py-8 font-semibold">
                No members yet. Add someone!
              </p>
            ) : (
              members.map((member, index) => {
                const isAdmin = index === 0;
                const avatarSrc = AVATAR_IMAGES[index % AVATAR_IMAGES.length];
                const statusColor = STATUS_COLORS[index % STATUS_COLORS.length];
                const isEditing = editingIndex === index;

                return (
                  <div
                    key={index}
                    className="member-list-item flex items-center justify-between px-4 py-3 border-b border-slate-50 dark:border-slate-800/50"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-100 dark:border-slate-700 flex-shrink-0">
                        <img alt={member} className="w-full h-full object-cover" src={avatarSrc} />
                      </div>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") handleSaveEdit(); if (e.key === "Escape") setEditingIndex(null); }}
                          maxLength={15}
                          autoFocus
                          className="flex-1 px-2 py-1 rounded-lg border-2 border-blue-400 bg-white dark:bg-[#1a1a3e] text-sm font-bold text-slate-800 dark:text-white outline-none min-w-0"
                        />
                      ) : (
                        <span className="font-bold text-sm text-slate-800 dark:text-gray-200 truncate">{member}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                      {isAdmin ? (
                        <span className="px-2.5 py-0.5 bg-pink-50 dark:bg-pink-500/10 text-pink-500 dark:text-pink-400 text-[10px] font-bold rounded-full">Admin</span>
                      ) : isEditing ? (
                        <>
                          <button onClick={handleSaveEdit} className="w-7 h-7 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 hover:bg-green-200 flex items-center justify-center transition-colors">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"/></svg>
                          </button>
                          <button onClick={() => setEditingIndex(null)} className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200 flex items-center justify-center transition-colors">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"/></svg>
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleStartEdit(index)} className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-500 flex items-center justify-center transition-colors">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>
                          </button>
                          <button onClick={() => handleDeleteMember(index)} className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-500 flex items-center justify-center transition-colors">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
