/**
 * Velithra - Theme Store (Zustand)
 * Global state management for theme preferences
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';
type ColorScheme = 'blue' | 'cyan' | 'purple' | 'green';

interface ThemeState {
  // State
  theme: Theme;
  colorScheme: ColorScheme;
  sidebarCollapsed: boolean;
  compactMode: boolean;

  // Actions
  setTheme: (theme: Theme) => void;
  setColorScheme: (colorScheme: ColorScheme) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleCompactMode: () => void;
  setCompactMode: (compact: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      // Initial State
      theme: 'dark',
      colorScheme: 'cyan',
      sidebarCollapsed: false,
      compactMode: false,

      // Actions
      setTheme: (theme) => set({ theme }),

      setColorScheme: (colorScheme) => set({ colorScheme }),

      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      toggleCompactMode: () =>
        set((state) => ({ compactMode: !state.compactMode })),

      setCompactMode: (compact) => set({ compactMode: compact }),
    }),
    {
      name: 'velithra-theme',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
