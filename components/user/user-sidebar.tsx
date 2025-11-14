"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  HomeIcon,
  CheckSquareIcon,
  BookOpenIcon,
  MessageCircleIcon,
  BellIcon,
  LogOutIcon,
} from "lucide-react";
import { VelithraLogo } from "@/components/logo/velithra-logo";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/components/providers/auth-provider";

const navigation = [
  { name: "Dashboard", href: "/user/dashboard", icon: HomeIcon },
  { name: "My Tasks", href: "/user/tasks", icon: CheckSquareIcon },
  { name: "Courses", href: "/user/courses", icon: BookOpenIcon },
  { name: "Chat", href: "/user/chat", icon: MessageCircleIcon },
  { name: "Notifications", href: "/user/notifications", icon: BellIcon },
];

export default function UserSidebar() {
  const pathname = usePathname();

  const { logout } = useAuthContext();
  const handleLogout = () => {
    logout();
  };

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-64 bg-black/20 backdrop-blur-xl border-r border-white/10 flex flex-col"
    >
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <VelithraLogo />
        <p className="text-sm text-gray-400 mt-2">User Portal</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                isActive
                  ? "bg-primary/20 text-primary border border-primary/50"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-white/10">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full border-white/20 hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-400"
        >
          <LogOutIcon className="h-5 w-5 mr-2" />
          Logout
        </Button>
      </div>
    </motion.aside>
  );
}
