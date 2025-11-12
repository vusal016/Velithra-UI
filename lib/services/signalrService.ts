/**
 * Velithra API - SignalR Service
 * Real-time communication for Dashboard and Chat hubs
 */

import * as signalR from '@microsoft/signalr';
import ENV from '@/lib/config/env';
import type { DashboardData, ChatMessageDto } from '@/lib/types';

// ============================================
// SIGNALR SERVICE CLASS
// ============================================

class SignalRService {
  private dashboardConnection: signalR.HubConnection | null = null;
  private chatConnection: signalR.HubConnection | null = null;

  /**
   * Connect to Dashboard Hub
   */
  async connectToDashboard(
    onUpdate: (data: DashboardData) => void
  ): Promise<void> {
    try {
      // Create connection
      this.dashboardConnection = new signalR.HubConnectionBuilder()
        .withUrl(`${ENV.SIGNALR_HUB_URL}/dashboard`, {
          skipNegotiation: false,
          transport: signalR.HttpTransportType.WebSockets |
                     signalR.HttpTransportType.ServerSentEvents |
                     signalR.HttpTransportType.LongPolling,
        })
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: (retryContext) => {
            // Exponential backoff: 0s, 2s, 10s, 30s
            if (retryContext.previousRetryCount === 0) return 0;
            if (retryContext.previousRetryCount === 1) return 2000;
            if (retryContext.previousRetryCount === 2) return 10000;
            return 30000;
          },
        })
        .configureLogging(
          ENV.IS_DEVELOPMENT
            ? signalR.LogLevel.Information
            : signalR.LogLevel.Warning
        )
        .build();

      // Register event handlers
      this.dashboardConnection.on('UpdateDashboard', onUpdate);

      // Connection event handlers
      this.dashboardConnection.onreconnecting((error) => {
        console.warn('[Dashboard Hub] Reconnecting...', error);
      });

      this.dashboardConnection.onreconnected((connectionId) => {
        console.log('[Dashboard Hub] Reconnected:', connectionId);
      });

      this.dashboardConnection.onclose((error) => {
        console.error('[Dashboard Hub] Connection closed:', error);
      });

      // Start connection
      await this.dashboardConnection.start();
      console.log('[Dashboard Hub] Connected successfully');
    } catch (error) {
      console.error('[Dashboard Hub] Connection failed:', error);
      throw error;
    }
  }

  /**
   * Connect to Chat Hub
   */
  async connectToChat(
    roomId: string,
    callbacks: {
      onMessage: (roomId: string, userId: string, message: string, timestamp: Date) => void;
      onUserJoined: (roomId: string, userId: string) => void;
      onUserLeft: (roomId: string, userId: string) => void;
    }
  ): Promise<void> {
    try {
      const token = localStorage.getItem('velithra_token');

      // Create connection with authentication
      this.chatConnection = new signalR.HubConnectionBuilder()
        .withUrl(`${ENV.SIGNALR_HUB_URL}/chat`, {
          accessTokenFactory: () => token || '',
          skipNegotiation: false,
          transport: signalR.HttpTransportType.WebSockets |
                     signalR.HttpTransportType.ServerSentEvents |
                     signalR.HttpTransportType.LongPolling,
        })
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: (retryContext) => {
            if (retryContext.previousRetryCount === 0) return 0;
            if (retryContext.previousRetryCount === 1) return 2000;
            if (retryContext.previousRetryCount === 2) return 10000;
            return 30000;
          },
        })
        .configureLogging(
          ENV.IS_DEVELOPMENT
            ? signalR.LogLevel.Information
            : signalR.LogLevel.Warning
        )
        .build();

      // Register event handlers
      this.chatConnection.on('ReceiveMessage', callbacks.onMessage);
      this.chatConnection.on('UserJoined', callbacks.onUserJoined);
      this.chatConnection.on('UserLeft', callbacks.onUserLeft);

      // Connection event handlers
      this.chatConnection.onreconnecting((error) => {
        console.warn('[Chat Hub] Reconnecting...', error);
      });

      this.chatConnection.onreconnected(async (connectionId) => {
        console.log('[Chat Hub] Reconnected:', connectionId);
        // Rejoin room after reconnection
        await this.joinRoom(roomId);
      });

      this.chatConnection.onclose((error) => {
        console.error('[Chat Hub] Connection closed:', error);
      });

      // Start connection
      await this.chatConnection.start();
      console.log('[Chat Hub] Connected successfully');

      // Join room
      await this.joinRoom(roomId);
    } catch (error) {
      console.error('[Chat Hub] Connection failed:', error);
      throw error;
    }
  }

  /**
   * Send message to chat room
   */
  async sendMessage(roomId: string, message: string): Promise<void> {
    if (!this.chatConnection) {
      throw new Error('Chat connection not established');
    }

    try {
      await this.chatConnection.invoke('SendMessage', roomId, message);
    } catch (error) {
      console.error('[Chat Hub] Send message failed:', error);
      throw error;
    }
  }

  /**
   * Join chat room
   */
  async joinRoom(roomId: string): Promise<void> {
    if (!this.chatConnection) {
      throw new Error('Chat connection not established');
    }

    try {
      await this.chatConnection.invoke('JoinRoom', roomId);
      console.log(`[Chat Hub] Joined room: ${roomId}`);
    } catch (error) {
      console.error('[Chat Hub] Join room failed:', error);
      throw error;
    }
  }

  /**
   * Leave chat room
   */
  async leaveRoom(roomId: string): Promise<void> {
    if (!this.chatConnection) {
      throw new Error('Chat connection not established');
    }

    try {
      await this.chatConnection.invoke('LeaveRoom', roomId);
      console.log(`[Chat Hub] Left room: ${roomId}`);
    } catch (error) {
      console.error('[Chat Hub] Leave room failed:', error);
      throw error;
    }
  }

  /**
   * Disconnect from Dashboard Hub
   */
  async disconnectDashboard(): Promise<void> {
    if (this.dashboardConnection) {
      await this.dashboardConnection.stop();
      this.dashboardConnection = null;
      console.log('[Dashboard Hub] Disconnected');
    }
  }

  /**
   * Disconnect from Chat Hub
   */
  async disconnectChat(): Promise<void> {
    if (this.chatConnection) {
      await this.chatConnection.stop();
      this.chatConnection = null;
      console.log('[Chat Hub] Disconnected');
    }
  }

  /**
   * Disconnect all hubs
   */
  async disconnectAll(): Promise<void> {
    await Promise.all([
      this.disconnectDashboard(),
      this.disconnectChat(),
    ]);
  }

  /**
   * Get Dashboard connection state
   */
  getDashboardState(): signalR.HubConnectionState | null {
    return this.dashboardConnection?.state || null;
  }

  /**
   * Get Chat connection state
   */
  getChatState(): signalR.HubConnectionState | null {
    return this.chatConnection?.state || null;
  }
}

// Export singleton instance
export const signalRService = new SignalRService();
export default signalRService;
