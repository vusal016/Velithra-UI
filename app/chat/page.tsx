"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { Send, MessageCircle, Loader2, Users } from "lucide-react"
import { chatService } from "@/lib/services/moduleServices"
import { toast } from "@/hooks/use-toast"
import type { ChatRoomDto, ChatMessageDto } from "@/lib/types"

export default function ChatPage() {
  const [rooms, setRooms] = useState<ChatRoomDto[]>([])
  const [selectedRoom, setSelectedRoom] = useState<ChatRoomDto | null>(null)
  const [messages, setMessages] = useState<ChatMessageDto[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    loadRooms()
  }, [])

  const loadRooms = async () => {
    try {
      setIsLoading(true)
      const data = await chatService.getMyRooms()
      setRooms(data)
      if (data.length > 0) {
        selectRoom(data[0])
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load chat rooms",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const selectRoom = async (room: ChatRoomDto) => {
    try {
      setSelectedRoom(room)
      const msgs = await chatService.getMessages(room.id)
      setMessages(msgs)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load messages",
        variant: "destructive"
      })
    }
  }

  const handleSend = async () => {
    if (!input.trim() || !selectedRoom) return
    
    try {
      setIsSending(true)
      await chatService.sendMessage(selectedRoom.id, {
        content: input
      })
      setInput("")
      selectRoom(selectedRoom)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive"
      })
    } finally {
      setIsSending(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageCircle className="text-primary" size={32} />
            <div>
              <h1 className="text-3xl font-bold text-foreground">{selectedRoom?.name || "Team Chat"}</h1>
              <p className="text-muted mt-1">Real-time team communication</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted">
            <Users size={18} className="text-primary" />
            <span>{rooms.length} Rooms</span>
          </div>
        </div>

        {/* Chat Messages */}
        <GlassCard>
          <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="text-center text-muted py-8">
                <MessageCircle className="mx-auto mb-2 text-primary" size={48} />
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((message, i) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                    {message.senderId?.substring(0, 1).toUpperCase() || "U"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground text-sm">{message.senderId}</p>
                      <p className="text-xs text-muted">{new Date(message.sentAt).toLocaleTimeString()}</p>
                    </div>
                    <p className="text-sm text-foreground mt-1">{message.content}</p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </GlassCard>

        {/* Chat Input */}
        <GlassCard>
          <div className="p-4">
            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                className="bg-white/5 border-white/10"
              />
              <Button 
                onClick={handleSend} 
                disabled={isSending || !input.trim()}
                className="bg-primary hover:bg-primary-dark text-background px-4"
              >
                {isSending ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
              </Button>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
