"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Trash2, Bell, AlertCircle, CheckCircle } from "lucide-react"

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "warning" | "success" | "error"
  timestamp: string
  read: boolean
}

const notifications: Notification[] = [
  {
    id: "1",
    title: "Module Updated",
    message: "HR Management module has been updated to v1.1.0",
    type: "info",
    timestamp: "2 hours ago",
    read: false,
  },
  {
    id: "2",
    title: "System Alert",
    message: "CPU usage exceeded 80% threshold",
    type: "warning",
    timestamp: "30 minutes ago",
    read: false,
  },
  {
    id: "3",
    title: "Task Completed",
    message: "Sarah Johnson completed the API authentication task",
    type: "success",
    timestamp: "1 hour ago",
    read: true,
  },
  {
    id: "4",
    title: "User Joined",
    message: "New user registered: user@velithra.local",
    type: "info",
    timestamp: "3 hours ago",
    read: true,
  },
]

export default function NotificationsPage() {
  const typeColors = {
    info: "border-primary/40 bg-primary/10",
    warning: "border-yellow-500/40 bg-yellow-500/10",
    success: "border-green-500/40 bg-green-500/10",
    error: "border-red-500/40 bg-red-500/10",
  }

  const typeIcons = {
    info: <Bell size={18} className="text-primary" />,
    warning: <AlertCircle size={18} className="text-yellow-400" />,
    success: <CheckCircle size={18} className="text-green-400" />,
    error: <AlertCircle size={18} className="text-red-400" />,
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted mt-1">System notifications and alerts</p>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.map((notif, i) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <GlassCard>
                <div className={`p-6 border-l-4 ${typeColors[notif.type]} flex items-start justify-between`}>
                  <div className="flex gap-4 flex-1">
                    <div className="mt-1">{typeIcons[notif.type]}</div>
                    <div>
                      <h3 className="font-semibold text-foreground">{notif.title}</h3>
                      <p className="text-sm text-muted mt-1">{notif.message}</p>
                      <p className="text-xs text-muted mt-2">{notif.timestamp}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-400">
                    <Trash2 size={16} />
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
