/**
 * Velithra - Notification Store (Zustand)
 * Global state management for notifications
 */

import { create } from 'zustand';
import type { NotificationDto } from '@/lib/types';

interface NotificationState {
  // State
  notifications: NotificationDto[];
  unreadCount: number;
  isLoading: boolean;
  lastFetched: number | null;

  // Actions
  setNotifications: (notifications: NotificationDto[]) => void;
  addNotification: (notification: NotificationDto) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  setUnreadCount: (count: number) => void;
  setLoading: (isLoading: boolean) => void;
  clearAll: () => void;
  updateLastFetched: () => void;
  shouldRefetch: () => boolean;
}

const REFETCH_INTERVAL = 30000; // 30 seconds

export const useNotificationStore = create<NotificationState>((set, get) => ({
  // Initial State
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  lastFetched: null,

  // Actions
  setNotifications: (notifications) => {
    const unreadCount = notifications.filter((n) => !n.isRead).length;
    set({ notifications, unreadCount, lastFetched: Date.now() });
  },

  addNotification: (notification) => {
    const { notifications } = get();
    const updated = [notification, ...notifications];
    const unreadCount = updated.filter((n) => !n.isRead).length;
    set({ notifications: updated, unreadCount });
  },

  markAsRead: (id) => {
    const { notifications } = get();
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, isRead: true } : n
    );
    const unreadCount = updated.filter((n) => !n.isRead).length;
    set({ notifications: updated, unreadCount });
  },

  markAllAsRead: () => {
    const { notifications } = get();
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    set({ notifications: updated, unreadCount: 0 });
  },

  removeNotification: (id) => {
    const { notifications } = get();
    const updated = notifications.filter((n) => n.id !== id);
    const unreadCount = updated.filter((n) => !n.isRead).length;
    set({ notifications: updated, unreadCount });
  },

  setUnreadCount: (unreadCount) => set({ unreadCount }),

  setLoading: (isLoading) => set({ isLoading }),

  clearAll: () =>
    set({
      notifications: [],
      unreadCount: 0,
      isLoading: false,
      lastFetched: null,
    }),

  updateLastFetched: () => set({ lastFetched: Date.now() }),

  shouldRefetch: () => {
    const { lastFetched } = get();
    if (!lastFetched) return true;
    return Date.now() - lastFetched > REFETCH_INTERVAL;
  },
}));
