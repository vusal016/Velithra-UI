"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuthContext } from "@/components/providers/auth-provider";
import { notificationService } from "@/lib/services/coreServices";
import { useRouter } from "next/navigation";

export default function UserHeader() {
  const router = useRouter();
  const { user } = useAuthContext();
  const [userName, setUserName] = useState<string>("User");
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      setUserName(user.userName || user.email || "User");
      // Use user.email as fallback for notificationService.getByUser if id is not present
      const userKey = (user as any).id || user.email;
      if (userKey) {
        notificationService.getByUser(userKey).then((notifications: any) => {
          if (notifications) {
            const unread = notifications.filter((n: any) => !n.isRead).length;
            setUnreadCount(unread);
          }
        }).catch((error: any) => {
          console.error("Failed to load notifications:", error);
        });
      }
    }
  }, [user]);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-black/20 backdrop-blur-xl border-b border-white/10 p-4"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Welcome back!</h2>
          <p className="text-sm text-gray-400">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/user/notifications")}
            className="relative hover:bg-white/10"
          >
            <Bell className="h-5 w-5 text-gray-400" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                {unreadCount > 9 ? "9+" : unreadCount}
              </Badge>
            )}
          </Button>

          {/* User Profile */}
          <div className="flex items-center gap-3 px-3 py-2 bg-white/5 rounded-lg border border-white/10">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">{userName}</p>
              <p className="text-xs text-gray-400">User</p>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
