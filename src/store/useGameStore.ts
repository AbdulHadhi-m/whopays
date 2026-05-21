import { create } from "zustand";

export interface SpinRecord {
  id: string;
  participants: string[];
  winner: string;
  createdAt: string;
}

interface GameState {
  participants: string[];
  isSpinning: boolean;
  winner: string | null;
  winnerIndex: number | null;
  spinHistory: SpinRecord[];
  
  // Actions
  addParticipant: (name: string) => void;
  removeParticipant: (index: number) => void;
  clearParticipants: () => void;
  setSpinning: (spinning: boolean) => void;
  setWinner: (winner: string | null, index: number | null) => void;
  fetchHistory: () => Promise<void>;
  triggerSpin: () => Promise<number | null>;
}

export const useGameStore = create<GameState>((set, get) => ({
  participants: ["Slay 💅", "Rizzler ⚡", "No Cap 🧢", "Skibidi 🚽", "Glow Up ✨", "Sus 🤫"],
  isSpinning: false,
  winner: null,
  winnerIndex: null,
  spinHistory: [],

  addParticipant: (name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    set((state) => ({
      participants: [...state.participants, trimmed],
    }));
  },

  removeParticipant: (index) => {
    set((state) => {
      const updated = [...state.participants];
      updated.splice(index, 1);
      return { participants: updated };
    });
  },

  clearParticipants: () => {
    set({ participants: [] });
  },

  setSpinning: (spinning) => {
    set({ isSpinning: spinning });
  },

  setWinner: (winner, index) => {
    set({ winner, winnerIndex: index });
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
        body: JSON.stringify({ participants }),
      });

      if (!res.ok) {
        throw new Error("API spin request failed");
      }

      const data = await res.json();
      
      // Update winnerIndex in store so the visual wheel component knows where to stop
      set({ winnerIndex: data.selectedIndex });
      return data.selectedIndex;
    } catch (err) {
      console.error("Error triggering server spin:", err);
      // Fallback: local random spin in case of server failure
      const fallbackIndex = Math.floor(Math.random() * participants.length);
      set({ winnerIndex: fallbackIndex });
      return fallbackIndex;
    }
  },
}));
