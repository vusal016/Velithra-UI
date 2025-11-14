"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Bell, CheckCircle, AlertCircle, Info, Loader2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { notificationService } from "@/lib/services/coreServices"
import { NotificationDto } from "@/lib/types/core.types"
import { toast } from "sonner"



export default function NotificationsPage() {
  const [notificationList, setNotificationList] = useState<NotificationDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [markingAsRead, setMarkingAsRead] = useState<string | null>(null)

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    try {
      setIsLoading(true)
      const data = await notificationService.getAll()
      setNotificationList(data)
    } catch (error: any) {
      toast.error("Failed to load notifications", {
        description: error.message || "Please try again later"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      setMarkingAsRead(notificationId)
      await notificationService.markAsRead(notificationId)
      toast.success("Notification marked as read")
      loadNotifications()
    } catch (error: any) {
      toast.error("Failed to mark as read", {
        description: error.message || "Please try again"
      })
    } finally {
      setMarkingAsRead(null)
    }
  }

  const formatTimestamp = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins} mins ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-[#00d9ff]" size={48} />
      </div>
    )
  }

  return (
    <div className="space-y-8 p-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="text-[#00d9ff]" size={32} />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
            <p className="text-sm text-[#6b8ca8]">
              {notificationList.filter(n => !n.isRead).length} unread notifications
            </p>
          </div>
        </div>
      </div>

      {notificationList.length === 0 ? (
        <GlassCard>
          <div className="p-12 text-center">
            <Bell className="mx-auto text-[#6b8ca8] mb-4" size={64} />
            <h3 className="text-xl font-semibold text-foreground mb-2">No notifications</h3>
            <p className="text-[#6b8ca8]">You're all caught up!</p>
          </div>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {notificationList.map((notif) => (
            <GlassCard key={notif.id}>
              <div className="p-4 flex items-start gap-4">
                <div className="p-3 rounded-lg text-blue-400 bg-blue-500/20">
                  <Info size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{notif.title}</h3>
                  <p className="text-sm text-[#6b8ca8] mt-1">{notif.message}</p>
                  <p className="text-xs text-[#6b8ca8] mt-2">{formatTimestamp(notif.sentAt)}</p>
                </div>
                <div className="flex items-center gap-2">
                  {!notif.isRead && (
                    <>
                      <div className="w-2 h-2 rounded-full bg-[#00d9ff] mt-2" />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleMarkAsRead(notif.id)}
                        disabled={markingAsRead === notif.id}
                        className="text-xs"
                      >
                        {markingAsRead === notif.id ? (
                          <Loader2 className="animate-spin" size={14} />
                        ) : (
                          <>
                            <Check size={14} className="mr-1" />
                            Mark as read
                          </>
                        )}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  )
}
