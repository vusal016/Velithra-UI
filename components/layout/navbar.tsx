"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { VelithraLogo } from "@/components/logo/velithra-logo"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LogOut, Bell } from "lucide-react"
import { notificationService } from "@/lib/services/notificationService"
import { LanguageSwitcher, useTranslation } from "@/lib/i18n"

interface NavbarProps {
  user?: { email: string; role: string } | null
  onLogout?: () => void
}

export function Navbar({ user, onLogout }: NavbarProps) {
  const router = useRouter()
  const { t } = useTranslation()
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (user) {
      loadUnreadCount()
      // Refresh every 30 seconds
      const interval = setInterval(loadUnreadCount, 30000)
      return () => clearInterval(interval)
    }
  }, [user])

  const loadUnreadCount = async () => {
    try {
      const count = await notificationService.getUnreadCount()
      setUnreadCount(count)
    } catch (error) {
      console.error("Failed to load unread count:", error)
    }
  }

  const handleNotificationClick = () => {
    router.push('/notifications')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 h-[72px] bg-[#0a1628] border-b border-white/10 z-50 backdrop-blur-xl">
      <div className="max-w-full mx-auto px-6 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
          <VelithraLogo size={60} animate={false} />
          <span className="text-lg font-bold text-[#00d9ff] hidden sm:inline">Velithra</span>
        </Link>

        {user && (
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <LanguageSwitcher />
            
            {/* Notifications */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleNotificationClick}
              className="relative gap-2"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Badge>
              )}
            </Button>
            
            {/* User Info */}
            <div className="text-sm text-muted hidden sm:block">
              <div className="font-medium text-foreground">{user.email}</div>
              <div className="text-xs capitalize">{user.role}</div>
            </div>
            
            {/* Logout */}
            <Button variant="ghost" size="sm" onClick={onLogout} className="gap-2">
              <LogOut size={16} />
            </Button>
          </div>
        )}
      </div>
    </nav>
  )
}
