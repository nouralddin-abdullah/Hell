import { create } from "zustand";

interface GreetingStore {
  hasSeenGreeting: boolean;
  markAsSeen: () => void;
}

export const useGreetingStore = create<GreetingStore>((set) => {
  // Retrieve initial state from localStorage
  const storedValue =
    typeof window !== "undefined"
      ? localStorage.getItem("bishell-ramadan-2025")
      : null;
  const initialState = storedValue === "true";

  return {
    hasSeenGreeting: initialState,
    markAsSeen: () => {
      localStorage.setItem("bishell-ramadan-2025", "true");
      set({ hasSeenGreeting: true });
    },
  };
});
