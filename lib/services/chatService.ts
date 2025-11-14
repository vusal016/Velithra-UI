/**
 * Velithra API - Chat Service
 * Backend API Endpoint: /api/Chat
 */

import apiClient from '../api/client';
import type { GenericResponse } from '../types';

export interface ChatRoomDto {
  id: string;
  name: string;
  isPrivate: boolean;
  createdAt: string;
}

export interface ChatRoomCreateDto {
  name: string;
  isPrivate: boolean;
}

export interface ChatMessageDto {
  id: string;
  content: string;
  userId: string;
  userName: string;
  roomId: string;
  sentAt: string;
}

export interface SendMessageDto {
  content: string;
}

export interface AddParticipantDto {
  userId: string;
}

export const chatService = {
  /**
   * POST /api/Chat/rooms - Create chat room
   */
  async createRoom(data: ChatRoomCreateDto): Promise<string> {
    try {
      const response = await apiClient.post<GenericResponse<string>>('/chat/rooms', data);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to create chat room');
    }
  },

  /**
   * GET /api/Chat/rooms/my-rooms - Get my chat rooms
   */
  async getMyRooms(): Promise<ChatRoomDto[]> {
    try {
      const response = await apiClient.get<GenericResponse<ChatRoomDto[]>>('/chat/rooms/my-rooms');
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data || [];
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch chat rooms');
    }
  },

  /**
   * POST /api/Chat/rooms/{roomId}/participants - Add participant to room
   */
  async addParticipant(roomId: string, data: AddParticipantDto): Promise<boolean> {
    try {
      const response = await apiClient.post<GenericResponse<boolean>>(
        `/chat/rooms/${roomId}/participants`,
        data
      );
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to add participant');
    }
  },

  /**
   * DELETE /api/Chat/rooms/{roomId}/participants/{userId} - Remove participant from room
   */
  async removeParticipant(roomId: string, userId: string): Promise<boolean> {
    try {
      const response = await apiClient.delete<GenericResponse<boolean>>(
        `/chat/rooms/${roomId}/participants/${userId}`
      );
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to remove participant');
    }
  },

  /**
   * POST /api/Chat/rooms/{roomId}/messages - Send message
   */
  async sendMessage(roomId: string, data: SendMessageDto): Promise<string> {
    try {
      const response = await apiClient.post<GenericResponse<string>>(
        `/chat/rooms/${roomId}/messages`,
        data
      );
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to send message');
    }
  },

  /**
   * GET /api/Chat/rooms/{roomId}/messages - Get messages by room
   */
  async getMessages(roomId: string): Promise<ChatMessageDto[]> {
    try {
      const response = await apiClient.get<GenericResponse<ChatMessageDto[]>>(
        `/chat/rooms/${roomId}/messages`
      );
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data || [];
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch messages');
    }
  }
};
