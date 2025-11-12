"use client"

import { useState } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, MessageCircle } from "lucide-react"

interface Message {
  id: string
  sender: string
  text: string
  timestamp: string
  isOwn: boolean
}

interface ChatRoom {
  id: string
  name: string
  type: "personal" | "team"
  unread: number
  lastMessage: string
}

const chatRooms: ChatRoom[] = [
  { id: "1", name: "General", type: "team", unread: 0, lastMessage: "Welcome to the team!" },
  { id: "2", name: "Engineering", type: "team", unread: 3, lastMessage: "New update released" },
  { id: "3", name: "John Doe", type: "personal", unread: 1, lastMessage: "See you tomorrow" },
]

const messages: Message[] = [
  { id: "1", sender: "John Doe", text: "Hi there!", timestamp: "10:30 AM", isOwn: false },
  { id: "2", sender: "You", text: "Hey! How are you?", timestamp: "10:32 AM", isOwn: true },
  { id: "3", sender: "John Doe", text: "Doing great! How about you?", timestamp: "10:35 AM", isOwn: false },
]

export default function ChatPage() {
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom>(chatRooms[0])
  const [messageList] = useState<Message[]>(messages)
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setNewMessage("")
    }
  }

  return (
    <div className="h-screen flex gap-6 p-8">
      {/* Chat Rooms List */}
      <GlassCard className="w-64 flex flex-col">
        <div className="p-4 border-b border-white/10">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <MessageCircle size={18} /> Messages
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto space-y-2 p-4">
          {chatRooms.map((room) => (
            <button
              key={room.id}
              onClick={() => setSelectedRoom(room)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                selectedRoom.id === room.id ? "bg-[#00d9ff]/20 border border-[#00d9ff]/40 shadow-sm shadow-[#00d9ff]/20" : "hover:bg-white/5"
              }`}
            >
              <p className="text-sm font-medium text-foreground">{room.name}</p>
              <p className="text-xs text-[#6b8ca8] truncate">{room.lastMessage}</p>
              {room.unread > 0 && (
                <span className="inline-block mt-1 px-2 py-0.5 bg-[#00d9ff] text-[#0a1628] text-xs rounded-full font-medium">
                  {room.unread}
                </span>
              )}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Chat Window */}
      <GlassCard className="flex-1 flex flex-col">
        <div className="p-4 border-b border-white/10">
          <h2 className="font-semibold text-foreground">{selectedRoom.name}</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messageList.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs px-3 py-2 rounded-lg ${
                  msg.isOwn ? "bg-[#00d9ff]/20 border border-[#00d9ff]/40" : "bg-white/5 border border-white/10"
                }`}
              >
                <p className="text-sm text-foreground">{msg.text}</p>
                <p className="text-xs text-[#6b8ca8] mt-1">{msg.timestamp}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-white/10 flex gap-2">
          <Input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="bg-white/5 border-white/10"
          />
          <Button onClick={handleSendMessage} className="bg-[#00d9ff] hover:bg-[#0099cc] text-[#0a1628] shadow-lg shadow-[#00d9ff]/30">
            <Send size={18} />
          </Button>
        </div>
      </GlassCard>
    </div>
  )
}
