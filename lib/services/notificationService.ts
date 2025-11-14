import apiClient from '../api/client';

export interface NotificationDto {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export const notificationService = {
  async getAll(): Promise<NotificationDto[]> {
    const response = await apiClient.get<NotificationDto[]>('/Notification');
    return response.data;
  },

  async getPaged(pageNumber: number = 1, pageSize: number = 10): Promise<PagedResult<NotificationDto>> {
    const response = await apiClient.get<PagedResult<NotificationDto>>(
      `/Notification/paged?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    return response.data;
  },

  async getById(id: string): Promise<NotificationDto> {
    const response = await apiClient.get<NotificationDto>(`/Notification/${id}`);
    return response.data;
  },

  async markAsRead(id: string): Promise<void> {
    await apiClient.patch(`/Notification/${id}/mark-as-read`);
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/Notification/${id}`);
  },

  async getUnreadCount(): Promise<number> {
    const data = await this.getAll();
    return data.filter(n => !n.isRead).length;
  }
};
