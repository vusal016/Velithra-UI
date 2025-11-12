"use client"

import { useState } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Bell, CheckCircle, AlertCircle, Info } from "lucide-react"

interface Notification {
  id: string
  type: "success" | "warning" | "info"
  title: string
  message: string
  timestamp: string
  read: boolean
}

const notifications: Notification[] = [
  {
    id: "1",
    type: "success",
    title: "User Added",
    message: "New user alice@velithra.local registered",
    timestamp: "5 mins ago",
    read: false,
  },
  {
    id: "2",
    type: "info",
    title: "Module Updated",
    message: "HR Manager module has been updated",
    timestamp: "1 hour ago",
    read: false,
  },
  {
    id: "3",
    type: "warning",
    title: "Low Stock Alert",
    message: "5 items are below minimum stock",
    timestamp: "2 hours ago",
    read: true,
  },
]

const iconMap = {
  success: CheckCircle,
  warning: AlertCircle,
  info: Info,
}

const colorMap = {
  success: "text-green-400 bg-green-500/20",
  warning: "text-yellow-400 bg-yellow-500/20",
  info: "text-blue-400 bg-blue-500/20",
}

export default function NotificationsPage() {
  const [notificationList] = useState<Notification[]>(notifications)

  return (
    <div className="space-y-8 p-8 max-w-4xl">
      <div className="flex items-center gap-3">
        <Bell className="text-primary" size={32} />
        <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
      </div>

      <div className="space-y-4">
        {notificationList.map((notif) => {
          const Icon = iconMap[notif.type]
          return (
            <GlassCard key={notif.id}>
              <div className="p-4 flex items-start gap-4">
                <div className={`p-3 rounded-lg ${colorMap[notif.type]}`}>
                  <Icon size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{notif.title}</h3>
                  <p className="text-sm text-muted mt-1">{notif.message}</p>
                  <p className="text-xs text-muted mt-2">{notif.timestamp}</p>
                </div>
                {!notif.read && <div className="w-2 h-2 rounded-full bg-primary mt-2" />}
              </div>
            </GlassCard>
          )
        })}
      </div>
    </div>
  )
}
