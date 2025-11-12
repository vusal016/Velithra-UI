"use client"

import { useState } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { Send, MessageCircle } from "lucide-react"

interface Message {
  id: string
  author: string
  content: string
  timestamp: string
  avatar: string
}

const initialMessages: Message[] = [
  {
    id: "1",
    author: "Sarah Johnson",
    content: "Hey team, the API authentication is almost complete!",
    timestamp: "2:45 PM",
    avatar: "S",
  },
  {
    id: "2",
    author: "Marcus Chen",
    content: "Great! Can you share the PR link?",
    timestamp: "2:46 PM",
    avatar: "M",
  },
  {
    id: "3",
    author: "Alex Rivera",
    content: "I can review it today after the standup.",
    timestamp: "2:48 PM",
    avatar: "A",
  },
]

export default function ChatPage() {
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState("")

  const handleSend = () => {
    if (input.trim()) {
      const newMessage: Message = {
        id: String(messages.length + 1),
        author: "You",
        content: input,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        avatar: "Y",
      }
      setMessages([...messages, newMessage])
      setInput("")
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <MessageCircle className="text-primary" size={32} />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Team Chat</h1>
            <p className="text-muted mt-1">Real-time team communication</p>
          </div>
        </div>

        {/* Chat Messages */}
        <GlassCard>
          <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
            {messages.map((message, i) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                  {message.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground text-sm">{message.author}</p>
                    <p className="text-xs text-muted">{message.timestamp}</p>
                  </div>
                  <p className="text-sm text-muted mt-1">{message.content}</p>
                </div>
              </motion.div>
            ))}
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
              <Button onClick={handleSend} className="bg-primary hover:bg-primary-dark text-background px-4">
                <Send size={18} />
              </Button>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
