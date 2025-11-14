"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Bell,
  Loader2,
  Check,
  Trash2,
  Mail,
  MailOpen,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { authService } from "@/lib/services/authService";
import { notificationService } from "@/lib/services/coreServices";
import { toast } from "sonner";
import type { NotificationDto } from "@/lib/types/core.types";

export default function UserNotificationsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<NotificationDto[]>([]);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  useEffect(() => {
    // Check authentication
    if (!authService.isAuthenticated()) {
      router.push("/login");
      return;
    }

    loadNotifications();
  }, [router]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const userId = authService.getUserId();

      if (!userId) {
        toast.error("User ID not found");
        return;
      }

      const notifications = await notificationService.getByUser(userId);

      if (notifications) {
        // Sort by most recent first
        const sorted = [...notifications].sort(
          (a, b) =>
            new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
        );
        setNotifications(sorted);
      }
    } catch (error: any) {
      console.error("Failed to load notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await notificationService.update({
        id: notificationId,
        isRead: true,
      });

      // Update local state
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
      );

      toast.success("Marked as read");
    } catch (error: any) {
      console.error("Failed to mark as read:", error);
      toast.error("Failed to update notification");
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter((n) => !n.isRead);

      for (const notification of unreadNotifications) {
        await notificationService.update({
          id: notification.id,
          isRead: true,
        });
      }

      await loadNotifications();
      toast.success("All notifications marked as read");
    } catch (error: any) {
      console.error("Failed to mark all as read:", error);
      toast.error("Failed to update notifications");
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      await notificationService.delete(notificationId);
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      toast.success("Notification deleted");
    } catch (error: any) {
      console.error("Failed to delete notification:", error);
      toast.error("Failed to delete notification");
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.isRead;
    if (filter === "read") return n.isRead;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#00d9ff] mx-auto mb-4" />
          <p className="text-white">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Notifications
              </h1>
              <p className="text-gray-400">
                Stay updated with your latest activities
              </p>
            </div>
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white text-lg px-4 py-2">
                {unreadCount} Unread
              </Badge>
            )}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <GlassCard className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filter === "all" ? "default" : "outline"}
                  onClick={() => setFilter("all")}
                  className={
                    filter === "all"
                      ? "bg-primary"
                      : "border-white/20 hover:bg-white/10"
                  }
                >
                  All ({notifications.length})
                </Button>
                <Button
                  variant={filter === "unread" ? "default" : "outline"}
                  onClick={() => setFilter("unread")}
                  className={
                    filter === "unread"
                      ? "bg-primary"
                      : "border-white/20 hover:bg-white/10"
                  }
                >
                  Unread ({unreadCount})
                </Button>
                <Button
                  variant={filter === "read" ? "default" : "outline"}
                  onClick={() => setFilter("read")}
                  className={
                    filter === "read"
                      ? "bg-primary"
                      : "border-white/20 hover:bg-white/10"
                  }
                >
                  Read ({notifications.length - unreadCount})
                </Button>
              </div>

              {unreadCount > 0 && (
                <Button
                  onClick={markAllAsRead}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Mark All as Read
                </Button>
              )}
            </div>
          </GlassCard>
        </motion.div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <GlassCard className="p-12">
                <div className="text-center">
                  <Bell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">No notifications found</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {filter === "unread"
                      ? "You're all caught up!"
                      : "New notifications will appear here"}
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          ) : (
            filteredNotifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <GlassCard
                  className={`p-5 ${
                    !notification.isRead ? "border-l-4 border-primary" : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-lg ${
                        notification.isRead
                          ? "bg-gray-500/20"
                          : "bg-primary/20"
                      }`}
                    >
                      {notification.isRead ? (
                        <MailOpen className="w-5 h-5 text-gray-400" />
                      ) : (
                        <Mail className="w-5 h-5 text-primary" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-white font-semibold">
                          {notification.title}
                        </h3>
                        {!notification.isRead && (
                          <Badge className="bg-primary/20 text-primary border-primary/50 border shrink-0">
                            New
                          </Badge>
                        )}
                      </div>

                      <p className="text-gray-300 text-sm mb-3">
                        {notification.message}
                      </p>

                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                          {new Date(notification.sentAt).toLocaleString()}
                        </p>

                        <div className="flex gap-2">
                          {!notification.isRead && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => markAsRead(notification.id)}
                              className="text-primary hover:bg-primary/10"
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Mark Read
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteNotification(notification.id)}
                            className="text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
