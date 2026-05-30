import { create } from "zustand";

export interface SpinRecord {
  id: string;
  participants: string[];
  winner: string;
  createdAt: string;
  type?: "spin" | "dice";
  dice1?: number;
  dice2?: number;
  diceMode?: string;
}

export interface GroupActivity {
  name: string;
  action: string;
  time: string;
  amount?: number;
}

export interface Group {
  id: string;
  name: string;
  emoji: string;
  members: string[];
  rounds: number;
  totalPaid: number;
  activity: GroupActivity[];
}

export interface Achievement {
  id: string;
  title: string;
  desc: string;
  icon: string;
  unlocked: boolean;
  progress: string;
}

interface GameState {
  participants: string[];
  isSpinning: boolean;
  winner: string | null;
  winnerIndex: number | null;
  lastGameType: "spin" | "dice" | null;
  spinHistory: SpinRecord[];
  
  // Navigation & Views
  currentView: string;
  setView: (view: string) => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  
  // Dark/Light Theme
  theme: "light" | "dark";
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;

  // Dice Modes & Rules
  diceMode: "classic" | "double" | "lucky" | "chaos" | "elimination" | "troll";
  setDiceMode: (mode: "classic" | "double" | "lucky" | "chaos" | "elimination" | "troll") => void;

  // Settings Toggles
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  notificationsEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  setVibrationEnabled: (enabled: boolean) => void;
  setNotificationsEnabled: (enabled: boolean) => void;

  // Group Management
  groups: Group[];
  activeGroupId: string;
  setActiveGroupId: (id: string) => void;
  createGroup: (name: string, members: string[], emoji?: string) => void;
  deleteGroup: (id: string) => void;
  joinGroup: (code: string) => boolean;

  // Meme Generator Text
  memeTopText: string;
  memeBottomText: string;
  setMemeText: (top: string, bottom: string) => void;

  // Achievements & Profile Stats
  achievements: Achievement[];
  userXP: number;
  userLevel: number;
  addUserXP: (amount: number) => void;

  // Actions
  addParticipant: (name: string) => void;
  removeParticipant: (index: number) => void;
  editParticipant: (index: number, name: string) => void;
  clearParticipants: () => void;
  setSpinning: (spinning: boolean) => void;
  setWinner: (winner: string | null, index: number | null, gameType?: "spin" | "dice") => void;
  fetchHistory: () => Promise<void>;
  triggerSpin: () => Promise<number | null>;
  triggerDiceRoll: () => Promise<{ selectedIndex: number; winner: string; dice1: number; dice2: number; } | null>;
}

export const useGameStore = create<GameState>((set, get) => ({
  participants: ["Alex 😎", "Jamie 🌟", "Sam 🎉", "Taylor 🔥", "Morgan 💫", "You 👆"],
  isSpinning: false,
  winner: null,
  winnerIndex: null,
  lastGameType: null,
  spinHistory: [],

  // Navigation & Views
  currentView: "splash",
  setView: (view) => set({ currentView: view }),
  menuOpen: false,
  setMenuOpen: (open) => set({ menuOpen: open }),

  // Dark/Light Theme
  theme: "light",
  toggleTheme: () => {
    const nextTheme = get().theme === "light" ? "dark" : "light";
    if (typeof window !== "undefined") {
      if (nextTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      localStorage.setItem("theme", nextTheme);
    }
    set({ theme: nextTheme });
  },
  setTheme: (theme) => {
    if (typeof window !== "undefined") {
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      localStorage.setItem("theme", theme);
    }
    set({ theme });
  },

  // Dice Modes
  diceMode: "classic",
  setDiceMode: (mode) => set({ diceMode: mode }),

  // Settings
  soundEnabled: true,
  vibrationEnabled: true,
  notificationsEnabled: true,
  setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
  setVibrationEnabled: (enabled) => set({ vibrationEnabled: enabled }),
  setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),

  // Group Management
  activeGroupId: "mock-group-1",
  setActiveGroupId: (id) => {
    const group = get().groups.find((g) => g.id === id);
    if (group) {
      set({ activeGroupId: id, participants: group.members });
    }
  },
  groups: [
    {
      id: "mock-group-1",
      name: "Weekend Squad",
      emoji: "😎",
      members: ["Alex 😎", "Jamie 🌟", "Sam 🎉", "Taylor 🔥", "Morgan 💫", "You 👆"],
      rounds: 12,
      totalPaid: 340,
      activity: [
        { name: "Alex 😎", action: "paid", amount: 85, time: "2m ago" },
        { name: "Jamie 🌟", action: "escaped", time: "10m ago" },
        { name: "Sam 🎉", action: "paid", amount: 45, time: "20m ago" },
        { name: "Taylor 🔥", action: "avoided", time: "1h ago" },
        { name: "Morgan 💫", action: "escaped", time: "2h ago" },
        { name: "You 👆", action: "paid", amount: 210, time: "1d ago" },
      ]
    },
    {
      id: "mock-group-2",
      name: "Dinner Squad",
      emoji: "🍲",
      members: ["Alex 😎", "Jamie 🌟", "Mosey 🧁", "Casey 🦄", "Jordan 🪐", "Taylor 🔥"],
      rounds: 8,
      totalPaid: 210,
      activity: [
        { name: "Mosey 🧁", action: "paid", amount: 90, time: "3h ago" },
        { name: "Jordan 🪐", action: "paid", amount: 120, time: "5h ago" },
        { name: "Alex 😎", action: "escaped", time: "1d ago" }
      ]
    }
  ],
  createGroup: (name, members, emoji = "👥") => {
    const newGroup: Group = {
      id: `group-${Date.now()}`,
      name,
      emoji,
      members,
      rounds: 0,
      totalPaid: 0,
      activity: [],
    };
    set((state) => ({
      groups: [...state.groups, newGroup],
      activeGroupId: newGroup.id,
      participants: members,
    }));
  },

  deleteGroup: (id) => {
    set((state) => {
      const remaining = state.groups.filter((g) => g.id !== id);
      if (remaining.length === 0) return state;
      const nextActive = state.activeGroupId === id ? remaining[0].id : state.activeGroupId;
      const activeGroup = remaining.find((g) => g.id === nextActive);
      return {
        groups: remaining,
        activeGroupId: nextActive,
        participants: activeGroup?.members ?? [],
      };
    });
  },
  joinGroup: (code) => {
    // Mock successful group join
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode.length === 6) {
      const state = get();
      // Join group if found or create a mock joined group
      const joinedGroup: Group = {
        id: `group-joined-${Date.now()}`,
        name: "Dinner Squad 🍲",
        emoji: "🍲",
        members: ["Alex 😎", "Jamie 🌟", "Mosey 🧁", "Casey 🦄", "Jordan 🪐", "Taylor 🔥"],
        rounds: 8,
        totalPaid: 210,
        activity: [
          { name: "Mosey 🧁", action: "paid", amount: 90, time: "3h ago" },
          { name: "Jordan 🪐", action: "paid", amount: 120, time: "5h ago" },
          { name: "Alex 😎", action: "escaped", time: "1d ago" }
        ]
      };
      set({
        groups: [...state.groups, joinedGroup],
        activeGroupId: joinedGroup.id,
        participants: joinedGroup.members,
        currentView: "group",
      });
      return true;
    }
    return false;
  },

  // Meme Generator
  memeTopText: "WHEN ALEX SEES THE BILL",
  memeBottomText: "NOT TODAY BRO!",
  setMemeText: (top, bottom) => set({ memeTopText: top, memeBottomText: bottom }),

  // Achievements & Levels
  userXP: 320,
  userLevel: 7,
  addUserXP: (amount) => {
    set((state) => {
      let nextXP = state.userXP + amount;
      let nextLevel = state.userLevel;
      const xpNeeded = 700; // Level cap for level 7
      if (nextXP >= xpNeeded) {
        nextXP -= xpNeeded;
        nextLevel += 1;
      }
      return { userXP: nextXP, userLevel: nextLevel };
    });
  },
  achievements: [
    { id: "1", title: "First Blood", desc: "Win your first round", icon: "/icons/First Blood.svg", unlocked: true, progress: "1/1" },
    { id: "2", title: "Wallet Killer", desc: "Pay 10 times", icon: "/icons/Wallet Killer.svg", unlocked: true, progress: "10/10" },
    { id: "3", title: "Unlucky King", desc: "Pay 25 times", icon: "/icons/Unlucky King.svg", unlocked: false, progress: "12/25" },
    { id: "4", title: "Lucky One", desc: "Escape 10 times", icon: "/icons/Lucky One.svg", unlocked: true, progress: "10/10" },
    { id: "5", title: "Roast Master", desc: "Roast 5 friends", icon: "/icons/Roast Master.svg", unlocked: true, progress: "5/5" },
    { id: "6", title: "Group Master", desc: "Create 5 groups", icon: "/icons/Group Master.svg", unlocked: false, progress: "3/5" }
  ],

  // Participant Management
  addParticipant: (name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    set((state) => {
      const nextParticipants = [...state.participants, trimmed];
      // update active group members if matches activeGroupId
      const updatedGroups = state.groups.map((g) => {
        if (g.id === state.activeGroupId) {
          return { ...g, members: nextParticipants };
        }
        return g;
      });
      return {
        participants: nextParticipants,
        groups: updatedGroups,
      };
    });
  },

  removeParticipant: (index) => {
    set((state) => {
      const updated = [...state.participants];
      updated.splice(index, 1);
      const updatedGroups = state.groups.map((g) => {
        if (g.id === state.activeGroupId) {
          return { ...g, members: updated };
        }
        return g;
      });
      return {
        participants: updated,
        groups: updatedGroups,
      };
    });
  },

  editParticipant: (index, name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    set((state) => {
      const updated = [...state.participants];
      updated[index] = trimmed;
      const updatedGroups = state.groups.map((g) => {
        if (g.id === state.activeGroupId) {
          return { ...g, members: updated };
        }
        return g;
      });
      return {
        participants: updated,
        groups: updatedGroups,
      };
    });
  },

  clearParticipants: () => {
    set((state) => {
      const updatedGroups = state.groups.map((g) => {
        if (g.id === state.activeGroupId) {
          return { ...g, members: [] };
        }
        return g;
      });
      return {
        participants: [],
        groups: updatedGroups,
      };
    });
  },

  setSpinning: (spinning) => {
    set({ isSpinning: spinning });
  },

  setWinner: (winner, index, gameType) => {
    set({ winner, winnerIndex: index, lastGameType: gameType ?? null });
    if (winner) {
      // Add XP to user for finishing a round
      get().addUserXP(50);
      
      // Log to active group activity
      const { activeGroupId, groups } = get();
      set({
        groups: groups.map((g) => {
          if (g.id === activeGroupId) {
            const amount = Math.floor(Math.random() * 80) + 15;
            const newActivity = { name: winner, action: "paid", amount, time: "Just now" };
            return {
              ...g,
              rounds: g.rounds + 1,
              totalPaid: g.totalPaid + amount,
              activity: [newActivity, ...g.activity],
            };
          }
          return g;
        }),
      });
    }
  },

  fetchHistory: async () => {
    try {
      const res = await fetch("/api/game/spin");
      if (res.ok) {
        const data = await res.json();
        set({ spinHistory: data.history || [] });
      }
    } catch (err) {
      console.error("Failed to fetch spin history:", err);
    }
  },

  triggerSpin: async () => {
    const { participants, isSpinning } = get();
    if (isSpinning || participants.length < 2) return null;

    set({ isSpinning: true, winner: null, winnerIndex: null });

    try {
      const res = await fetch("/api/game/spin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participants, type: "spin" }),
      });

      if (!res.ok) {
        throw new Error("API spin request failed");
      }

      const data = await res.json();
      set({ winnerIndex: data.selectedIndex });
      return data.selectedIndex;
    } catch (err) {
      console.error("Error triggering server spin:", err);
      const fallbackIndex = Math.floor(Math.random() * participants.length);
      set({ winnerIndex: fallbackIndex });
      return fallbackIndex;
    }
  },

  triggerDiceRoll: async () => {
    const { participants, isSpinning, diceMode } = get();
    if (isSpinning || participants.length < 2) return null;

    set({ isSpinning: true, winner: null, winnerIndex: null });

    try {
      const res = await fetch("/api/game/spin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participants, type: "dice", diceMode }),
      });

      if (!res.ok) {
        throw new Error("API dice request failed");
      }

      const data = await res.json();
      
      // If diceMode is double, return two winners
      if (diceMode === "double") {
        const idx1 = data.selectedIndex;
        const idx2 = (data.selectedIndex + 1) % participants.length;
        return {
          selectedIndex: idx1,
          winner: `${participants[idx1]} & ${participants[idx2]}`,
          dice1: data.dice1,
          dice2: data.dice2,
        };
      }
      
      // If diceMode is lucky escape, select someone who escapes and someone who pays
      if (diceMode === "lucky") {
        const escIdx = data.selectedIndex;
        let payIdx = (data.selectedIndex + 1) % participants.length;
        if (payIdx === escIdx) payIdx = (payIdx + 1) % participants.length;
        return {
          selectedIndex: payIdx,
          winner: `${participants[payIdx]} (Lucky Escape: ${participants[escIdx]} escaped!)`,
          dice1: data.dice1,
          dice2: data.dice2,
        };
      }
      
      if (diceMode === "chaos") {
        const rollSum = data.dice1 + data.dice2;
        if (rollSum % 3 === 0) {
          return {
            selectedIndex: data.selectedIndex,
            winner: `Everyone Splits! (Except ${participants[data.selectedIndex]})`,
            dice1: data.dice1,
            dice2: data.dice2,
          };
        } else if (rollSum % 2 === 0) {
          return {
            selectedIndex: data.selectedIndex,
            winner: `${participants[data.selectedIndex]} Pays Double! 💳`,
            dice1: data.dice1,
            dice2: data.dice2,
          };
        }
      }

      return data;
    } catch (err) {
      console.error("Error triggering server dice roll:", err);
      const dice1 = Math.floor(Math.random() * 6) + 1;
      const dice2 = Math.floor(Math.random() * 6) + 1;
      let fallbackIndex = (dice1 + dice2) % participants.length;

      if (diceMode === "double") {
        const idx2 = (fallbackIndex + 1) % participants.length;
        return {
          selectedIndex: fallbackIndex,
          winner: `${participants[fallbackIndex]} & ${participants[idx2]}`,
          dice1,
          dice2,
        };
      }
      
      if (diceMode === "lucky") {
        const escIdx = fallbackIndex;
        let payIdx = (fallbackIndex + 1) % participants.length;
        return {
          selectedIndex: payIdx,
          winner: `${participants[payIdx]} (Lucky Escape: ${participants[escIdx]} escaped!)`,
          dice1,
          dice2,
        };
      }

      return {
        selectedIndex: fallbackIndex,
        winner: participants[fallbackIndex],
        dice1,
        dice2,
      };
    }
  },
}));

