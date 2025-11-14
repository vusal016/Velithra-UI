/**
 * Velithra - SignalR React Hooks
 * Custom hooks for real-time communication
 */

'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import { authService } from '@/lib/services/authService';
import { ENV } from '@/lib/config/env';
import { toast } from 'sonner';
import { useNotificationStore } from '@/lib/store';
import type { NotificationDto } from '@/lib/types';

// ============================================
// DASHBOARD HUB HOOK
// ============================================

interface DashboardMetrics {
  users: number;
  roles: number;
  logs: number;
  unreadNotifications: number;
}

interface UseDashboardHubOptions {
  onMetricsUpdate?: (metrics: DashboardMetrics) => void;
  enabled?: boolean;
}

export function useDashboardHub(options: UseDashboardHubOptions = {}) {
  const { onMetricsUpdate, enabled = true } = options;
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${ENV.SIGNALR_HUB_URL}/dashboard`, {
        accessTokenFactory: () => authService.getToken() || '',
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: () => 3000,
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();

    // Event: MetricsUpdated
    hubConnection.on('MetricsUpdated', (data: DashboardMetrics) => {
      setMetrics(data);
      onMetricsUpdate?.(data);
    });

    // Event: Reconnecting
    hubConnection.onreconnecting(() => {
      setIsConnected(false);
      console.log('[Dashboard Hub] Reconnecting...');
    });

    // Event: Reconnected
    hubConnection.onreconnected(() => {
      setIsConnected(true);
      console.log('[Dashboard Hub] Reconnected');
      toast.success('Dashboard connection restored');
    });

    // Event: Closed
    hubConnection.onclose(() => {
      setIsConnected(false);
      console.log('[Dashboard Hub] Connection closed');
    });

    // Start connection
    hubConnection
      .start()
      .then(() => {
        setIsConnected(true);
        setConnection(hubConnection);
        console.log('[Dashboard Hub] Connected');
      })
      .catch((error) => {
        console.error('[Dashboard Hub] Connection failed:', error);
        toast.error('Failed to connect to dashboard');
      });

    return () => {
      hubConnection.stop();
    };
  }, [enabled, onMetricsUpdate]);

  const refreshMetrics = useCallback(async () => {
    if (connection && isConnected) {
      try {
        await connection.invoke('RequestMetrics');
      } catch (error) {
        console.error('[Dashboard Hub] Failed to request metrics:', error);
      }
    }
  }, [connection, isConnected]);

  return {
    connection,
    isConnected,
    metrics,
    refreshMetrics,
  };
}

// ============================================
// NOTIFICATION HUB HOOK
// ============================================

interface UseNotificationHubOptions {
  enabled?: boolean;
}

export function useNotificationHub(options: UseNotificationHubOptions = {}) {
  const { enabled = true } = options;
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  
  const { addNotification, setUnreadCount } = useNotificationStore();

  useEffect(() => {
    if (!enabled) return;

    const hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${ENV.SIGNALR_HUB_URL}/notifications`, {
        accessTokenFactory: () => authService.getToken() || '',
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: () => 3000,
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();

    // Event: ReceiveNotification
    hubConnection.on('ReceiveNotification', (notification: NotificationDto) => {
      addNotification(notification);
      
      toast.info(notification.title, {
        description: notification.message,
        duration: 5000,
      });
    });

    // Event: UnreadCountUpdated
    hubConnection.on('UnreadCountUpdated', (count: number) => {
      setUnreadCount(count);
    });

    // Event: Reconnecting
    hubConnection.onreconnecting(() => {
      setIsConnected(false);
      console.log('[Notification Hub] Reconnecting...');
    });

    // Event: Reconnected
    hubConnection.onreconnected(() => {
      setIsConnected(true);
      console.log('[Notification Hub] Reconnected');
    });

    // Event: Closed
    hubConnection.onclose(() => {
      setIsConnected(false);
      console.log('[Notification Hub] Connection closed');
    });

    // Start connection
    hubConnection
      .start()
      .then(() => {
        setIsConnected(true);
        setConnection(hubConnection);
        console.log('[Notification Hub] Connected');
      })
      .catch((error) => {
        console.error('[Notification Hub] Connection failed:', error);
      });

    return () => {
      hubConnection.stop();
    };
  }, [enabled, addNotification, setUnreadCount]);

  return {
    connection,
    isConnected,
  };
}

// ============================================
// CHAT HUB HOOK
// ============================================

export interface ChatMessage {
  id: string;
  messageId?: string;
  roomId: string;
  userId: string;
  userName: string;
  message: string;
  content?: string;
  timestamp: string;
  sentAt?: string;
}

interface UseChatHubOptions {
  roomId?: string;
  onMessageReceived?: (message: ChatMessage) => void;
  onUserJoined?: (roomId: string, userId: string, userName: string) => void;
  onUserLeft?: (roomId: string, userId: string, userName: string) => void;
  enabled?: boolean;
}

export function useChatHub(options: UseChatHubOptions = {}) {
  const {
    roomId,
    onMessageReceived,
    onUserJoined,
    onUserLeft,
    enabled = true,
  } = options;
  
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(roomId || null);

  useEffect(() => {
    if (!enabled) return;

    const hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${ENV.SIGNALR_HUB_URL}/chat`, {
        accessTokenFactory: () => authService.getToken() || '',
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: () => 3000,
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();

    // Event: ReceiveMessage
    hubConnection.on('ReceiveMessage', (message: ChatMessage) => {
      onMessageReceived?.(message);
    });

    // Event: UserJoined
    hubConnection.on('UserJoined', (roomId: string, userId: string, userName: string) => {
      onUserJoined?.(roomId, userId, userName);
      toast.success(`${userName} joined the chat`);
    });

    // Event: UserLeft
    hubConnection.on('UserLeft', (roomId: string, userId: string, userName: string) => {
      onUserLeft?.(roomId, userId, userName);
      toast.info(`${userName} left the chat`);
    });

    // Event: Reconnecting
    hubConnection.onreconnecting(() => {
      setIsConnected(false);
      console.log('[Chat Hub] Reconnecting...');
    });

    // Event: Reconnected
    hubConnection.onreconnected(() => {
      setIsConnected(true);
      console.log('[Chat Hub] Reconnected');
      
      // Rejoin room if was in one
      if (currentRoomId) {
        hubConnection.invoke('JoinRoom', currentRoomId);
      }
    });

    // Event: Closed
    hubConnection.onclose(() => {
      setIsConnected(false);
      console.log('[Chat Hub] Connection closed');
    });

    // Start connection
    hubConnection
      .start()
      .then(() => {
        setIsConnected(true);
        setConnection(hubConnection);
        console.log('[Chat Hub] Connected');
        
        // Auto-join room if specified
        if (roomId) {
          hubConnection.invoke('JoinRoom', roomId);
          setCurrentRoomId(roomId);
        }
      })
      .catch((error) => {
        console.error('[Chat Hub] Connection failed:', error);
      });

    return () => {
      if (currentRoomId) {
        hubConnection.invoke('LeaveRoom', currentRoomId);
      }
      hubConnection.stop();
    };
  }, [enabled, roomId, onMessageReceived, onUserJoined, onUserLeft]);

  const joinRoom = useCallback(
    async (roomId: string) => {
      if (connection && isConnected) {
        try {
          // Leave current room first
          if (currentRoomId) {
            await connection.invoke('LeaveRoom', currentRoomId);
          }
          
          // Join new room
          await connection.invoke('JoinRoom', roomId);
          setCurrentRoomId(roomId);
          console.log(`[Chat Hub] Joined room: ${roomId}`);
        } catch (error) {
          console.error('[Chat Hub] Failed to join room:', error);
          toast.error('Failed to join chat room');
        }
      }
    },
    [connection, isConnected, currentRoomId]
  );

  const leaveRoom = useCallback(async () => {
    if (connection && isConnected && currentRoomId) {
      try {
        await connection.invoke('LeaveRoom', currentRoomId);
        setCurrentRoomId(null);
        console.log(`[Chat Hub] Left room: ${currentRoomId}`);
      } catch (error) {
        console.error('[Chat Hub] Failed to leave room:', error);
      }
    }
  }, [connection, isConnected, currentRoomId]);

  const sendMessage = useCallback(
    async (message: string) => {
      if (connection && isConnected && currentRoomId) {
        try {
          await connection.invoke('SendMessage', currentRoomId, message);
        } catch (error) {
          console.error('[Chat Hub] Failed to send message:', error);
          toast.error('Failed to send message');
        }
      }
    },
    [connection, isConnected, currentRoomId]
  );

  return {
    connection,
    isConnected,
    currentRoomId,
    joinRoom,
    leaveRoom,
    sendMessage,
  };
}
