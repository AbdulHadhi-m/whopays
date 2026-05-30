"use client";

import React from "react";
import { useGameStore } from "@/store/useGameStore";
import { soundManager } from "@/components/shared/SoundManager";

// ─── Reusable sub-components ────────────────────────────────────────────────

/** A chevron-right arrow used on navigation rows */
function ChevronRight() {
  return (
    <svg className="h-5 w-5 text-[#c3c6d7] dark:text-slate-600 group-hover:text-[#004ac6] dark:group-hover:text-blue-400 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
    </svg>
  );
}

/** A clickable row that navigates somewhere */
function NavRow({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group w-full flex items-center justify-between py-5 px-2 -mx-2 rounded-lg hover:bg-[#f2f3ff] dark:hover:bg-white/5 transition-colors"
    >
      <div className="flex items-center gap-4">
        <span className="text-[#737686] dark:text-slate-400 group-hover:text-[#004ac6] dark:group-hover:text-blue-400 transition-colors">
          {icon}
        </span>
        <span className="text-base font-semibold text-[#131b2e] dark:text-white">{label}</span>
      </div>
      <ChevronRight />
    </button>
  );
}

/** A toggle row with a smooth CSS toggle switch */
function ToggleRow({
  icon,
  label,
  enabled,
  onToggle,
}: {
  icon: React.ReactNode;
  label: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-5 px-2 -mx-2">
      <div className="flex items-center gap-4">
        <span className="text-[#737686] dark:text-slate-400">{icon}</span>
        <span className="text-base font-semibold text-[#131b2e] dark:text-white">{label}</span>
      </div>
      <button
        role="switch"
        aria-checked={enabled}
        onClick={onToggle}
        className={`relative w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none ${
          enabled ? "bg-green-500" : "bg-[#c3c6d7] dark:bg-slate-600"
        }`}
      >
        <span
          className={`absolute top-[2px] left-[2px] h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${
            enabled ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

/** A section wrapper with a title and divider-separated children */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-xs font-bold mb-4 text-[#131b2e] dark:text-white uppercase tracking-wider">{title}</h2>
      <div className="divide-y divide-[#eaedff] dark:divide-slate-800 border-t border-b border-[#eaedff] dark:border-slate-800">
        {children}
      </div>
    </section>
  );
}

// ─── Icon helpers ────────────────────────────────────────────────────────────

const IconUser = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
  </svg>
);

const IconLock = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
  </svg>
);

const IconSound = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
  </svg>
);

const IconVibration = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M12 18.5a6.5 6.5 0 100-13 6.5 6.5 0 000 13zM4.5 12H3m18 0h-1.5M12 4.5V3m0 18v-1.5M7.05 7.05L6 6m12 12l-1.05-1.05M16.95 7.05L18 6M6 18l1.05-1.05" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
  </svg>
);

const IconMoon = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
  </svg>
);

const IconBell = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
  </svg>
);

const IconDoc = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
  </svg>
);

const IconShield = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
  </svg>
);

const IconLogOut = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
  </svg>
);

// ─── Main Component ──────────────────────────────────────────────────────────

export default function SettingsView() {
  const {
    setView,
    theme,
    toggleTheme,
    soundEnabled,
    setSoundEnabled,
    vibrationEnabled,
    setVibrationEnabled,
    notificationsEnabled,
    setNotificationsEnabled,
  } = useGameStore();

  const isDark = theme === "dark";

  const handleToast = (msg: string) => {
    // Light haptic if available
    if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(30);
    console.log(msg); // No triggerToast here — it lives in page.tsx; toast can be added if needed
  };

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-[#0a0a1a] text-[#131b2e] dark:text-white font-sans transition-colors duration-300 overflow-hidden">

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <header
        className="flex items-center px-6 py-5 sticky top-0 bg-white dark:bg-[#0a0a1a] z-10 border-b border-[#eaedff] dark:border-slate-800/60 transition-colors"
        data-purpose="screen-header"
      >
        <button
          onClick={() => { soundManager.playTick(); setView("home"); }}
          aria-label="Go back"
          className="p-2 -ml-2 hover:bg-[#f2f3ff] dark:hover:bg-white/5 rounded-full transition-colors"
        >
          <svg className="h-6 w-6 text-[#131b2e] dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
          </svg>
        </button>
        <h1 className="flex-1 text-center text-xl font-extrabold mr-8">Settings</h1>
      </header>

      {/* ── Scrollable body ──────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-6 py-8 pb-24">

        {/* Account */}
        <Section title="Account">
          <NavRow
            icon={<IconUser />}
            label="Edit Profile"
            onClick={() => { soundManager.playTick(); handleToast("Edit Profile"); }}
          />
          <NavRow
            icon={<IconLock />}
            label="Change Password"
            onClick={() => { soundManager.playTick(); handleToast("Change Password"); }}
          />
        </Section>

        {/* Preferences */}
        <Section title="Preferences">
          <ToggleRow
            icon={<IconSound />}
            label="Sounds"
            enabled={soundEnabled}
            onToggle={() => {
              soundManager.playTick();
              setSoundEnabled(!soundEnabled);
            }}
          />
          <ToggleRow
            icon={<IconVibration />}
            label="Vibration"
            enabled={vibrationEnabled}
            onToggle={() => {
              soundManager.playTick();
              setVibrationEnabled(!vibrationEnabled);
            }}
          />
          <ToggleRow
            icon={<IconMoon />}
            label="Dark Mode"
            enabled={isDark}
            onToggle={() => {
              soundManager.playTick();
              toggleTheme();
            }}
          />
          <NavRow
            icon={<IconBell />}
            label="Notifications"
            onClick={() => {
              soundManager.playTick();
              setNotificationsEnabled(!notificationsEnabled);
            }}
          />
        </Section>

        {/* About */}
        <Section title="About">
          <NavRow
            icon={<IconDoc />}
            label="Terms & Conditions"
            onClick={() => { soundManager.playTick(); handleToast("Terms & Conditions"); }}
          />
          <NavRow
            icon={<IconShield />}
            label="Privacy Policy"
            onClick={() => { soundManager.playTick(); handleToast("Privacy Policy"); }}
          />
        </Section>

        {/* Log Out */}
        <button
          onClick={() => {
            soundManager.playTick();
            setView("splash");
          }}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-xl border-2 border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-500/5 text-red-500 dark:text-red-400 font-bold text-base hover:bg-red-100 dark:hover:bg-red-500/10 active:scale-[0.98] transition-all"
        >
          <IconLogOut />
          Log Out
        </button>
      </div>
    </div>
  );
}
