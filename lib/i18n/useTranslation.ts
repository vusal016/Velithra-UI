/**
 * Velithra - i18n Hook
 * React hook for internationalization
 */

'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { translations, type Language, type Translations } from './translations';

interface I18nState {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

export const useI18nStore = create<I18nState>()(
  persist(
    (set, get) => ({
      language: 'en',
      setLanguage: (lang: Language) =>
        set({
          language: lang,
          t: translations[lang],
        }),
      t: translations.en,
    }),
    {
      name: 'velithra-i18n',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        language: state.language,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Update translations after rehydration
          state.t = translations[state.language];
        }
      },
    }
  )
);

/**
 * Hook to use translations
 */
export function useTranslation() {
  const { language, setLanguage, t } = useI18nStore();
  
  return {
    language,
    setLanguage,
    t,
  };
}

/**
 * Format translation string with variables
 * Example: formatMessage("Minimum length is {min} characters", { min: 5 })
 */
export function formatMessage(message: string, params?: Record<string, string | number>): string {
  if (!params) return message;
  
  let formatted = message;
  Object.entries(params).forEach(([key, value]) => {
    formatted = formatted.replace(`{${key}}`, String(value));
  });
  
  return formatted;
}

/**
 * Get nested translation path
 * Example: getNestedTranslation(t, 'common.save')
 */
export function getNestedTranslation(obj: any, path: string): string {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj) || path;
}
