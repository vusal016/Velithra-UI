import * as signalR from '@microsoft/signalr';
import { authService } from './authService';
import { ENV } from '../config/env';

export const signalRService = {
  dashboardConnection: null as signalR.HubConnection | null,
  chatConnection: null as signalR.HubConnection | null,

  async initDashboardHub() {
    this.dashboardConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${ENV.SIGNALR_HUB_URL}/dashboard`, {
        accessTokenFactory: () => authService.getToken() || ''
      })
      .withAutomaticReconnect()
      .build();
    await this.dashboardConnection.start();
  },

  async initChatHub() {
    this.chatConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${ENV.SIGNALR_HUB_URL}/chat`, {
        accessTokenFactory: () => authService.getToken() || ''
      })
      .withAutomaticReconnect()
      .build();
    await this.chatConnection.start();
  },

  async joinChatRoom(roomId: string) {
    if (this.chatConnection) {
      await this.chatConnection.invoke('JoinRoom', roomId);
    }
  },

  async sendMessage(roomId: string, message: string) {
    if (this.chatConnection) {
      await this.chatConnection.invoke('SendMessage', roomId, message);
    }
  },

  async disconnect() {
    if (this.dashboardConnection) {
      await this.dashboardConnection.stop();
    }
    if (this.chatConnection) {
      await this.chatConnection.stop();
    }
  },

  async disconnectAll() {
    await this.disconnect();
  }
};
