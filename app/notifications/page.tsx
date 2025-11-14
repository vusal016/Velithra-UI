"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Check, Trash2, RefreshCw } from "lucide-react"
import { notificationService, NotificationDto } from "@/lib/services/notificationService"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadNotifications()
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadNotifications = async () => {
    try {
      setIsLoading(true)
      const data = await notificationService.getAll()
      console.log("Notifications loaded:", data)
      setNotifications(data)
    } catch (error: any) {
      console.error("Notification load error:", error)
      toast.error("Failed to load notifications", {
        description: error.message
      })
    } finally {
      setIsLoading(false)
      setRefreshing(false)
    }
  }

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id)
      toast.success("Marked as read")
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      )
    } catch (error: any) {
      console.error("Mark as read error:", error)
      toast.error("Failed to mark as read")
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await notificationService.delete(id)
      toast.success("Notification deleted")
      setNotifications(prev => prev.filter(n => n.id !== id))
    } catch (error: any) {
      console.error("Delete notification error:", error)
      toast.error("Failed to delete notification")
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    loadNotifications()
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-400">Loading notifications...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Bell className="h-8 w-8 text-blue-500" />
          <div>
            <h1 className="text-3xl font-bold text-white">Notifications</h1>
            <p className="text-gray-400">
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          variant="outline"
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {notifications.length === 0 ? (
        <GlassCard className="p-12 text-center">
          <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No notifications</h3>
          <p className="text-gray-400">You're all caught up! New notifications will appear here.</p>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <GlassCard
              key={notification.id}
              className={`p-4 transition-all ${
                !notification.isRead 
                  ? 'border-l-4 border-blue-500 bg-blue-500/5' 
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-white">
                      {notification.title}
                    </h3>
                    {!notification.isRead && (
                      <Badge variant="default" className="bg-blue-500">New</Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {notification.type}
                    </Badge>
                  </div>
                  <p className="text-gray-300 mb-2">{notification.message}</p>
                  <p className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </p>
                </div>

                <div className="flex gap-2">
                  {!notification.isRead && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="gap-2"
                    >
                      <Check className="h-4 w-4" />
                      Mark Read
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(notification.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  )
}
