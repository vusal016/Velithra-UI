"use client";

import { useState, useEffect, useRef } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Send,
  MessageCircle,
  Loader2,
  Plus,
  Users,
  Hash,
  Lock,
  UserPlus,
  Check,
} from "lucide-react";
import { chatService, userService } from "@/lib/services/api";
import { useChatHub } from "@/lib/hooks/useSignalR";
import type { ChatRoomDto, ChatMessageDto, AppUserDto } from "@/lib/types/api.types";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatPage() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // State
  const [chatRooms, setChatRooms] = useState<ChatRoomDto[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoomDto | null>(null);
  const [messages, setMessages] = useState<ChatMessageDto[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  
  // Create room dialog
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newRoomForm, setNewRoomForm] = useState({
    name: "",
    isPrivate: false,
    participantIds: [] as string[],
  });
  const [availableUsers, setAvailableUsers] = useState<AppUserDto[]>([]);

  // SignalR Chat Hub
  const {
    isConnected,
    currentRoomId,
    joinRoom,
    sendMessage: sendMessageViaHub,
  } = useChatHub({
    roomId: selectedRoom?.id,
    onMessageReceived: (message) => {
      const newMessage: ChatMessageDto = {
        id: message.id || message.messageId || '',
        chatRoomId: message.roomId,
        senderId: message.userId,
        senderName: message.userName,
        content: message.message || message.content || '',
        sentAt: message.timestamp || message.sentAt || new Date().toISOString(),
      };
      setMessages((prev) => [...prev, newMessage]);
      scrollToBottom();
    },
    onUserJoined: (roomId, userId, userName) => {
      console.log(`User ${userName} joined room ${roomId}`);
    },
    onUserLeft: (roomId, userId, userName) => {
      console.log(`User ${userName} left room ${roomId}`);
    },
  });

  useEffect(() => {
    loadChatRooms();
    loadAvailableUsers();
  }, []);

  useEffect(() => {
    if (selectedRoom) {
      loadMessages(selectedRoom.id);
      if (isConnected) {
        joinRoom(selectedRoom.id);
      }
    }
  }, [selectedRoom, isConnected]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChatRooms = async () => {
    try {
      setIsLoadingRooms(true);
      const response = await chatService.getRooms();
      const data = response.data.data || response.data || [];
      setChatRooms(Array.isArray(data) ? data : []);
      if (data.length > 0 && !selectedRoom) {
        setSelectedRoom(data[0]);
      }
    } catch (error: any) {
      console.error("Failed to load chat rooms:", error);
      toast.error("Failed to load chat rooms", {
        description: error.response?.data?.message || error.message || "Please try again later",
      });
    } finally {
      setIsLoadingRooms(false);
    }
  };

  const loadMessages = async (roomId: string) => {
    try {
      setIsLoadingMessages(true);
      const response = await chatService.getMessages(roomId);
      const data = response.data.data || response.data || [];
      setMessages(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error("Failed to load messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const loadAvailableUsers = async () => {
    try {
      const response = await userService.getAll();
      const data = response.data.data || response.data || [];
      setAvailableUsers(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error("Failed to load users:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedRoom) return;

    const message = messageInput.trim();
    setMessageInput("");

    try {
      // Send via SignalR if connected, otherwise fallback to API
      if (isConnected && currentRoomId === selectedRoom.id) {
        await sendMessageViaHub(message);
      } else {
        await chatService.sendMessage({
          chatRoomId: selectedRoom.id,
          content: message,
        });
        loadMessages(selectedRoom.id);
      }
    } catch (error: any) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
      setMessageInput(message); // Restore message on failure
    }
  };

  const handleCreateRoom = async () => {
    if (!newRoomForm.name.trim()) {
      toast.error("Room name is required");
      return;
    }

    try {
      setIsCreating(true);
      await chatService.createRoom({
        name: newRoomForm.name,
        isPrivate: newRoomForm.isPrivate,
        participantIds: newRoomForm.participantIds,
      });
      toast.success("Chat room created successfully");
      setShowCreateDialog(false);
      setNewRoomForm({ name: "", isPrivate: false, participantIds: [] });
      loadChatRooms();
    } catch (error: any) {
      console.error("Failed to create room:", error);
      toast.error("Failed to create room");
    } finally {
      setIsCreating(false);
    }
  };

  const toggleParticipant = (userId: string) => {
    setNewRoomForm((prev) => ({
      ...prev,
      participantIds: prev.participantIds.includes(userId)
        ? prev.participantIds.filter((id) => id !== userId)
        : [...prev.participantIds, userId],
    }));
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (isLoadingRooms) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-[#00d9ff] mx-auto mb-4" />
            <p className="text-white">Loading chat rooms...</p>
          </div>
        </div>
      </div>
    );
  }

  const currentUserId = localStorage.getItem("userId") || "";

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-[#00d9ff]/20 flex items-center justify-center">
              <MessageCircle className="text-[#00d9ff]" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Team Chat</h1>
              <p className="text-gray-300 mt-1">
                Real-time messaging{" "}
                <span
                  className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                    isConnected ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${isConnected ? "bg-green-400" : "bg-gray-400"}`}
                  />
                  {isConnected ? "Connected" : "Connecting..."}
                </span>
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="gap-2 bg-[#00d9ff] hover:bg-[#0099cc] text-[#0a1628]"
          >
            <Plus size={18} />
            Create Room
          </Button>
        </div>

        {/* Chat Interface */}
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-250px)]">
          {/* Rooms Sidebar */}
          <div className="col-span-3">
            <GlassCard className="h-full flex flex-col">
              <div className="p-4 border-b border-white/10">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Users size={18} />
                  Rooms ({chatRooms.length})
                </h3>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {chatRooms.length === 0 ? (
                  <div className="text-center py-8 px-4">
                    <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3 opacity-50" />
                    <p className="text-gray-400 text-sm">No rooms yet</p>
                    <p className="text-gray-500 text-xs mt-1">Create your first room</p>
                  </div>
                ) : (
                  chatRooms.map((room) => (
                    <button
                      key={room.id}
                      onClick={() => setSelectedRoom(room)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        selectedRoom?.id === room.id
                          ? "bg-[#00d9ff]/20 border border-[#00d9ff]/40"
                          : "hover:bg-white/5 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {room.isPrivate ? (
                          <Lock size={14} className="text-yellow-400" />
                        ) : (
                          <Hash size={14} className="text-gray-400" />
                        )}
                        <span className="font-medium text-white text-sm truncate flex-1">
                          {room.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Users size={12} />
                          {room.participantCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle size={12} />
                          {room.messageCount}
                        </span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </GlassCard>
          </div>

          {/* Chat Area */}
          <div className="col-span-9">
            <GlassCard className="h-full flex flex-col">
              {selectedRoom ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#00d9ff]/20 flex items-center justify-center">
                          {selectedRoom.isPrivate ? (
                            <Lock className="text-[#00d9ff]" size={20} />
                          ) : (
                            <Hash className="text-[#00d9ff]" size={20} />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{selectedRoom.name}</h3>
                          <p className="text-gray-400 text-xs">
                            {selectedRoom.participantCount} participants
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {isLoadingMessages ? (
                      <div className="flex items-center justify-center h-full">
                        <Loader2 className="w-8 h-8 animate-spin text-[#00d9ff]" />
                      </div>
                    ) : !messages || messages.length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-50" />
                          <p className="text-gray-300 text-lg">No messages yet</p>
                          <p className="text-gray-400 text-sm mt-2">
                            Start the conversation!
                          </p>
                        </div>
                      </div>
                    ) : (
                      <AnimatePresence>
                        {messages.map((message, index) => {
                          const isOwn = message.senderId === currentUserId;
                          return (
                            <motion.div
                              key={message.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              transition={{ delay: index * 0.02 }}
                              className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                            >
                              <div className="max-w-[70%]">
                                {!isOwn && (
                                  <p className="text-xs text-gray-400 mb-1 ml-2">
                                    {message.senderName || "Unknown"}
                                  </p>
                                )}
                                <div
                                  className={`px-4 py-2 rounded-lg ${
                                    isOwn
                                      ? "bg-[#00d9ff]/20 border border-[#00d9ff]/40"
                                      : "bg-white/5 border border-white/10"
                                  }`}
                                >
                                  <p className="text-white text-sm">{message.content}</p>
                                  <p className="text-gray-500 text-xs mt-1">
                                    {new Date(message.sentAt).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div className="p-4 border-t border-white/10">
                    <div className="flex gap-2">
                      <Input
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                        placeholder="Type a message..."
                        className="bg-white/5 border-white/10 text-white"
                        disabled={!isConnected}
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!messageInput.trim() || !isConnected}
                        className="gap-2 bg-[#00d9ff] hover:bg-[#0099cc] text-[#0a1628]"
                      >
                        <Send size={18} />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-50" />
                    <p className="text-gray-300 text-lg">Select a room to start chatting</p>
                  </div>
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      </div>

      {/* Create Room Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="bg-[#1a2332] border-white/10 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Create Chat Room</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="room-name" className="text-white">
                Room Name <span className="text-red-400">*</span>
              </Label>
              <Input
                id="room-name"
                value={newRoomForm.name}
                onChange={(e) => setNewRoomForm({ ...newRoomForm, name: e.target.value })}
                placeholder="e.g., Team Discussion"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is-private"
                checked={newRoomForm.isPrivate}
                onChange={(e) =>
                  setNewRoomForm({ ...newRoomForm, isPrivate: e.target.checked })
                }
                className="w-4 h-4"
              />
              <Label htmlFor="is-private" className="text-white text-sm cursor-pointer">
                Private room (invite only)
              </Label>
            </div>

            {newRoomForm.isPrivate && (
              <div className="space-y-2">
                <Label className="text-white">Invite Participants</Label>
                <div className="max-h-48 overflow-y-auto space-y-1 border border-white/10 rounded-lg p-2">
                  {availableUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => toggleParticipant(user.id)}
                      className={`w-full text-left p-2 rounded text-sm transition-all flex items-center justify-between ${
                        newRoomForm.participantIds.includes(user.id)
                          ? "bg-[#00d9ff]/20 text-white"
                          : "hover:bg-white/5 text-gray-300"
                      }`}
                    >
                      <span>{user.userName}</span>
                      {newRoomForm.participantIds.includes(user.id) && (
                        <Check size={16} className="text-[#00d9ff]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setShowCreateDialog(false)}
              disabled={isCreating}
              className="text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateRoom}
              disabled={isCreating}
              className="bg-[#00d9ff] hover:bg-[#0099cc] text-[#0a1628]"
            >
              {isCreating ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} />
                  Creating...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2" size={16} />
                  Create Room
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
