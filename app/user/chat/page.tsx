"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Send,
  Loader2,
  Users,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authService } from "@/lib/services/authService";
import { chatService, type ChatRoomDto, type ChatMessageDto } from "@/lib/services/chatService";
import { signalRService } from "@/lib/services/signalrService";
import { toast } from "sonner";

export default function UserChatPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState<ChatRoomDto[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoomDto | null>(null);
  const [messages, setMessages] = useState<ChatMessageDto[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check authentication
    if (!authService.isAuthenticated()) {
      router.push("/login");
      return;
    }

    loadRooms();
    setupSignalR();

    return () => {
      signalRService.disconnectAll();
    };
  }, [router]);

  useEffect(() => {
    if (selectedRoom) {
      loadMessages(selectedRoom.id);
    }
  }, [selectedRoom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const setupSignalR = async () => {
    try {
      // Start chat SignalR connection
      await signalRService.initChatHub();

      // Listen for new messages via the chat hub listener
      // Messages will be received automatically through signalRService
      console.log("SignalR chat connection established");
    } catch (error) {
      console.error("Failed to setup SignalR:", error);
    }
  };

  const loadRooms = async () => {
    try {
      setLoading(true);
      const rooms = await chatService.getMyRooms();

      if (rooms) {
        setRooms(rooms);
        
        // Auto-select first room
        if (rooms.length > 0) {
          setSelectedRoom(rooms[0]);
        }
      }
    } catch (error: any) {
      console.error("Failed to load chat rooms:", error);
      toast.error("Failed to load chat rooms");
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (roomId: string) => {
    try {
      const messages = await chatService.getMessages(roomId);

      if (messages) {
        setMessages(messages);
      }
    } catch (error: any) {
      console.error("Failed to load messages:", error);
      toast.error("Failed to load messages");
    }
  };

  const sendMessage = async () => {
    if (!messageInput.trim() || !selectedRoom) return;

    try {
      setSending(true);

      await chatService.sendMessage(selectedRoom.id, {
        content: messageInput,
      });

      // Reload messages after sending
      await loadMessages(selectedRoom.id);
      setMessageInput("");
    } catch (error: any) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const currentUser = authService.getUser();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#00d9ff] mx-auto mb-4" />
          <p className="text-white">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Team Chat</h1>
          <p className="text-gray-400">Real-time communication with your team</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          {/* Chat Rooms List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-1"
          >
            <GlassCard className="p-4 h-full overflow-y-auto">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Chat Rooms
              </h2>
              <div className="space-y-2">
                {rooms.length === 0 ? (
                  <p className="text-gray-400 text-sm">No chat rooms available</p>
                ) : (
                  rooms.map((room) => (
                    <button
                      key={room.id}
                      onClick={() => setSelectedRoom(room)}
                      className={`w-full p-3 rounded-lg text-left transition-colors ${
                        selectedRoom?.id === room.id
                          ? "bg-primary/20 border border-primary/50"
                          : "bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-primary" />
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">
                            {room.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {room.isPrivate ? "Private" : "Public"}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </GlassCard>
          </motion.div>

          {/* Messages Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-3"
          >
            <GlassCard className="h-full flex flex-col">
              {selectedRoom ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-white/10">
                    <h2 className="text-xl font-semibold text-white">
                      {selectedRoom.name}
                    </h2>
                    <p className="text-sm text-gray-400">
                      {selectedRoom.isPrivate ? "Private Room" : "Public Room"}
                    </p>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {messages.length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <MessageCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                          <p className="text-gray-400">No messages yet</p>
                          <p className="text-sm text-gray-500 mt-2">
                            Be the first to send a message!
                          </p>
                        </div>
                      </div>
                    ) : (
                      messages.map((message, index) => {
                        const isOwnMessage =
                          message.userId === currentUser?.userName ||
                          message.userName === currentUser?.userName;

                        return (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.02 }}
                            className={`flex ${
                              isOwnMessage ? "justify-end" : "justify-start"
                            }`}
                          >
                            <div
                              className={`max-w-[70%] ${
                                isOwnMessage
                                  ? "bg-primary/20 border border-primary/50"
                                  : "bg-white/5 border border-white/10"
                              } rounded-lg p-3`}
                            >
                              <p className="text-xs text-gray-400 mb-1">
                                {message.userName}
                              </p>
                              <p className="text-white text-sm">
                                {message.content}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(message.sentAt).toLocaleTimeString()}
                              </p>
                            </div>
                          </motion.div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-white/10">
                    <div className="flex gap-2">
                      <Input
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        className="flex-1 bg-white/5 border-white/10"
                        disabled={sending}
                      />
                      <Button
                        onClick={sendMessage}
                        disabled={!messageInput.trim() || sending}
                        className="bg-primary hover:bg-primary-dark"
                      >
                        {sending ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Send className="w-5 h-5" />
                        )}
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <MessageCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">Select a chat room to start messaging</p>
                  </div>
                </div>
              )}
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
