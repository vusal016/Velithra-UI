/**
 * Velithra - Keyboard Navigation Hook
 * Accessibility support for keyboard shortcuts
 */

'use client';

import React from 'react';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  action: () => void;
  description: string;
}

/**
 * Global keyboard shortcuts
 */
export function useKeyboardNavigation(shortcuts: KeyboardShortcut[] = []) {
  const router = useRouter();

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Check if user is typing in an input
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      // Default shortcuts
      const defaultShortcuts: KeyboardShortcut[] = [
        {
          key: 'h',
          alt: true,
          action: () => router.push('/dashboard'),
          description: 'Go to Dashboard (Alt+H)',
        },
        {
          key: 'm',
          alt: true,
          action: () => router.push('/dashboard/modules'),
          description: 'Go to Modules (Alt+M)',
        },
        {
          key: 'u',
          alt: true,
          action: () => router.push('/dashboard/users'),
          description: 'Go to Users (Alt+U)',
        },
        {
          key: 'c',
          alt: true,
          action: () => router.push('/dashboard/courses'),
          description: 'Go to Courses (Alt+C)',
        },
        {
          key: '/',
          ctrl: true,
          action: () => {
            // Focus search input if exists
            const searchInput = document.querySelector<HTMLInputElement>(
              'input[type="search"], input[placeholder*="Search"]'
            );
            searchInput?.focus();
          },
          description: 'Focus Search (Ctrl+/)',
        },
        {
          key: 'Escape',
          action: () => {
            // Close modals/dialogs
            const closeButtons = document.querySelectorAll<HTMLButtonElement>(
              '[data-dialog-close], [data-modal-close], [aria-label*="Close"]'
            );
            closeButtons[closeButtons.length - 1]?.click();
          },
          description: 'Close Modal/Dialog (Esc)',
        },
      ];

      const allShortcuts = [...defaultShortcuts, ...shortcuts];

      for (const shortcut of allShortcuts) {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = shortcut.ctrl ? event.ctrlKey : !event.ctrlKey;
        const altMatch = shortcut.alt ? event.altKey : !event.altKey;
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;

        if (keyMatch && ctrlMatch && altMatch && shiftMatch) {
          event.preventDefault();
          shortcut.action();
          break;
        }
      }
    },
    [router, shortcuts]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

/**
 * Focus trap for modals/dialogs
 */
export function useFocusTrap(isActive: boolean, containerRef: React.RefObject<HTMLElement>) {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    // Focus first element
    firstElement?.focus();

    container.addEventListener('keydown', handleTabKey);
    return () => container.removeEventListener('keydown', handleTabKey);
  }, [isActive, containerRef]);
}

/**
 * Skip to main content
 */
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:shadow-lg"
    >
      Skip to main content
    </a>
  );
}
