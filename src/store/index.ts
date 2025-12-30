import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { NavPage, Theme } from '@/types';

// Detect system preference for initial theme
function getInitialTheme(): Theme {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
}

interface AppState {
  // Navigation
  currentPage: NavPage;
  setPage: (page: NavPage) => void;

  // Theme
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Navigation
      currentPage: 'Home',
      setPage: (page) => set({ currentPage: page }),

      // Theme - will be overridden by persisted value if exists
      theme: getInitialTheme(),
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set({ theme: get().theme === 'light' ? 'dark' : 'light' }),
    }),
    {
      name: 'financial-tools-storage',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);
