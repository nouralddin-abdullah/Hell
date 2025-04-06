import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  isDarkerMode: boolean;
  toggleTheme: () => void;
  toggleDarkerMode: () => void;
  setTheme: (theme: Theme) => void;
}

const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "light",
      isDarkerMode: false,
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "light" ? "dark" : "light",
          isDarkerMode: state.theme === "dark" ? false : state.isDarkerMode, // Reset darker mode when switching to light
        })),
      toggleDarkerMode: () =>
        set((state) => ({
          isDarkerMode: !state.isDarkerMode,
        })),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "theme-storage",
    }
  )
);

export default useThemeStore;
