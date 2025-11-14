/**
 * Velithra - Module Store (Zustand)
 * Global state management for active modules and permissions
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface ModuleConfig {
  code: string;
  name: string;
  path: string;
  icon: string;
  roles: string[];
  isActive: boolean;
  order: number;
}

interface ModuleState {
  // State
  modules: ModuleConfig[];
  activeModuleCodes: string[];
  isLoading: boolean;
  lastFetched: number | null;

  // Actions
  setModules: (modules: ModuleConfig[]) => void;
  setActiveModuleCodes: (codes: string[]) => void;
  toggleModuleStatus: (code: string, isActive: boolean) => void;
  isModuleActive: (code: string) => boolean;
  getVisibleModules: (userRoles: string[]) => ModuleConfig[];
  setLoading: (isLoading: boolean) => void;
  clearModules: () => void;
  updateLastFetched: () => void;
  shouldRefetch: () => boolean;
}

const REFETCH_INTERVAL = 300000; // 5 minutes

export const useModuleStore = create<ModuleState>()(
  persist(
    (set, get) => ({
      // Initial State
      modules: [],
      activeModuleCodes: [],
      isLoading: false,
      lastFetched: null,

      // Actions
      setModules: (modules) => {
        const activeCodes = modules.filter((m) => m.isActive).map((m) => m.code);
        set({ modules, activeModuleCodes: activeCodes, lastFetched: Date.now() });
      },

      setActiveModuleCodes: (codes) => set({ activeModuleCodes: codes }),

      toggleModuleStatus: (code, isActive) => {
        const { modules } = get();
        const updated = modules.map((m) =>
          m.code === code ? { ...m, isActive } : m
        );
        const activeCodes = updated.filter((m) => m.isActive).map((m) => m.code);
        set({ modules: updated, activeModuleCodes: activeCodes });
      },

      isModuleActive: (code) => {
        const { activeModuleCodes } = get();
        return activeModuleCodes.includes(code);
      },

      getVisibleModules: (userRoles) => {
        const { modules, activeModuleCodes } = get();
        return modules
          .filter(
            (m) =>
              activeModuleCodes.includes(m.code) &&
              m.roles.some((role) => userRoles.includes(role))
          )
          .sort((a, b) => a.order - b.order);
      },

      setLoading: (isLoading) => set({ isLoading }),

      clearModules: () =>
        set({
          modules: [],
          activeModuleCodes: [],
          isLoading: false,
          lastFetched: null,
        }),

      updateLastFetched: () => set({ lastFetched: Date.now() }),

      shouldRefetch: () => {
        const { lastFetched } = get();
        if (!lastFetched) return true;
        return Date.now() - lastFetched > REFETCH_INTERVAL;
      },
    }),
    {
      name: 'velithra-modules',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        modules: state.modules,
        activeModuleCodes: state.activeModuleCodes,
        lastFetched: state.lastFetched,
      }),
    }
  )
);
