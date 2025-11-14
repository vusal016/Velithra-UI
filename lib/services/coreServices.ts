/**
 * Velithra API - Core Services
 * Services for Core module entities (AppUser, Role, Notification, Dashboard, etc.)
 */

import apiClient from '@/lib/api/client';
import type {
  GenericResponse,
  PagedResult,
  AppUserDto,
  AppUserCreateDto,
  AppUserUpdateDto,
  RoleDto,
  RoleCreateDto,
  RoleUpdateDto,
  NotificationDto,
  NotificationCreateDto,
  NotificationUpdateDto,
  AuditLogDto,
  DashboardStatistics,
  AdminDashboardData,
  ManagerDashboardData,
  UserDashboardData,
} from '@/lib/types';

// ============================================
// USER MANAGEMENT SERVICE (Admin Only)
// ============================================

export class UserManagementService {
  private endpoint = '/appuser';

  /**
   * GET /api/appuser - Get all users
   */
  async getAll(): Promise<AppUserDto[]> {
    try {
      const response = await apiClient.get<GenericResponse<AppUserDto[]>>(this.endpoint);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data || [];
    } catch (error: any) {
      throw this.handleError(error, 'Failed to fetch users');
    }
  }

  /**
   * GET /api/appuser/paged - Get users with pagination
   */
  async getPaged(pageNumber: number = 1, pageSize: number = 10): Promise<PagedResult<AppUserDto>> {
    try {
      const response = await apiClient.get<GenericResponse<PagedResult<AppUserDto>>>(
        `${this.endpoint}/paged`,
        {
          params: { pageNumber, pageSize }
        }
      );
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to fetch paginated users');
    }
  }

  /**
   * GET /api/appuser/{id} - Get user by ID
   */
  async getById(id: string): Promise<AppUserDto> {
    try {
      const response = await apiClient.get<GenericResponse<AppUserDto>>(`${this.endpoint}/${id}`);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to fetch user');
    }
  }

  /**
   * POST /api/appuser - Create user (Admin only)
   */
  async create(data: AppUserCreateDto): Promise<string> {
    try {
      const response = await apiClient.post<GenericResponse<string>>(this.endpoint, data);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to create user');
    }
  }

  /**
   * PUT /api/appuser - Update user
   */
  async update(data: AppUserUpdateDto): Promise<string> {
    try {
      const response = await apiClient.put<GenericResponse<string>>(this.endpoint, data);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to update user');
    }
  }

  /**
   * DELETE /api/appuser/{id} - Delete user
   */
  async delete(id: string): Promise<boolean> {
    try {
      const response = await apiClient.delete<GenericResponse<boolean>>(`${this.endpoint}/${id}`);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to delete user');
    }
  }

  private handleError(error: any, defaultMessage: string): Error {
    if (error.response?.data) {
      const errorResponse = error.response.data as GenericResponse<any>;
      const errorMessage = errorResponse.errors?.join(', ') || errorResponse.message || defaultMessage;
      return new Error(errorMessage);
    }
    return error;
  }
}

// ============================================
// ROLE MANAGEMENT SERVICE (Admin Only)
// ============================================

export class RoleManagementService {
  private endpoint = '/role';

  /**
   * GET /api/role - Get all roles
   */
  async getAll(): Promise<RoleDto[]> {
    try {
      const response = await apiClient.get<GenericResponse<RoleDto[]>>(this.endpoint);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data || [];
    } catch (error: any) {
      throw this.handleError(error, 'Failed to fetch roles');
    }
  }

  /**
   * GET /api/role/{id} - Get role by ID
   */
  async getById(id: string): Promise<RoleDto> {
    try {
      const response = await apiClient.get<GenericResponse<RoleDto>>(`${this.endpoint}/${id}`);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to fetch role');
    }
  }

  /**
   * POST /api/role - Create role
   */
  async create(data: RoleCreateDto): Promise<string> {
    try {
      const response = await apiClient.post<GenericResponse<string>>(this.endpoint, data);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to create role');
    }
  }

  /**
   * PUT /api/role/{id} - Update role
   */
  async update(id: string, data: RoleUpdateDto): Promise<string> {
    try {
      const response = await apiClient.put<GenericResponse<string>>(`${this.endpoint}/${id}`, data);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to update role');
    }
  }

  /**
   * DELETE /api/role/{id} - Delete role
   */
  async delete(id: string): Promise<boolean> {
    try {
      const response = await apiClient.delete<GenericResponse<boolean>>(`${this.endpoint}/${id}`);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to delete role');
    }
  }

  private handleError(error: any, defaultMessage: string): Error {
    if (error.response?.data) {
      const errorResponse = error.response.data as GenericResponse<any>;
      const errorMessage = errorResponse.errors?.join(', ') || errorResponse.message || defaultMessage;
      return new Error(errorMessage);
    }
    return error;
  }
}

// ============================================
// DASHBOARD SERVICE (Role-Based)
// ============================================

export class DashboardService {
  private endpoint = '/dashboard';

  /**
   * GET /api/dashboard/admin - Admin dashboard
   */
  async getAdminDashboard(): Promise<AdminDashboardData> {
    try {
      const response = await apiClient.get<GenericResponse<AdminDashboardData>>(`${this.endpoint}/admin`);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to fetch admin dashboard');
    }
  }

  /**
   * GET /api/dashboard/manager - Manager dashboard
   */
  async getManagerDashboard(): Promise<ManagerDashboardData> {
    try {
      const response = await apiClient.get<GenericResponse<ManagerDashboardData>>(`${this.endpoint}/manager`);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to fetch manager dashboard');
    }
  }

  /**
   * GET /api/dashboard/user - User dashboard
   */
  async getUserDashboard(): Promise<UserDashboardData> {
    try {
      const response = await apiClient.get<GenericResponse<UserDashboardData>>(`${this.endpoint}/user`);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to fetch user dashboard');
    }
  }

  /**
   * GET /api/dashboard/statistics - Dashboard statistics (all roles)
   */
  async getStatistics(): Promise<DashboardStatistics> {
    try {
      const response = await apiClient.get<GenericResponse<DashboardStatistics>>(`${this.endpoint}/statistics`);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to fetch statistics');
    }
  }

  private handleError(error: any, defaultMessage: string): Error {
    if (error.response?.data) {
      const errorResponse = error.response.data as GenericResponse<any>;
      const errorMessage = errorResponse.errors?.join(', ') || errorResponse.message || defaultMessage;
      return new Error(errorMessage);
    }
    return error;
  }
}

// ============================================
// NOTIFICATION SERVICE
// ============================================

export class NotificationService {
  private endpoint = '/notification';

  /**
   * GET /api/notification - Get all notifications
   */
  async getAll(): Promise<NotificationDto[]> {
    try {
      const response = await apiClient.get<GenericResponse<NotificationDto[]>>(this.endpoint);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data || [];
    } catch (error: any) {
      throw this.handleError(error, 'Failed to fetch notifications');
    }
  }

  /**
   * GET /api/notification/{id} - Get notification by ID
   */
  async getById(id: string): Promise<NotificationDto> {
    try {
      const response = await apiClient.get<GenericResponse<NotificationDto>>(`${this.endpoint}/${id}`);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to fetch notification');
    }
  }

  /**
   * POST /api/notification/{id}/mark-read - Mark notification as read
   */
  async markAsRead(id: string): Promise<boolean> {
    try {
      const response = await apiClient.post<GenericResponse<boolean>>(`${this.endpoint}/${id}/mark-read`);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to mark notification as read');
    }
  }

  /**
   * POST /api/notification - Create notification
   */
  async create(data: NotificationCreateDto): Promise<string> {
    try {
      const response = await apiClient.post<GenericResponse<string>>(this.endpoint, data);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to create notification');
    }
  }

  /**
   * PUT /api/notification - Update notification
   */
  async update(data: NotificationUpdateDto): Promise<string> {
    try {
      const response = await apiClient.put<GenericResponse<string>>(this.endpoint, data);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to update notification');
    }
  }

  /**
   * GET /api/notification/user/{userId} - Get notifications by user ID (custom method)
   */
  async getByUser(userId: string): Promise<NotificationDto[]> {
    try {
      // Filter all notifications by userId on client side since backend doesn't have this endpoint
      const allNotifications = await this.getAll();
      return allNotifications.filter(n => n.userId === userId);
    } catch (error: any) {
      throw this.handleError(error, 'Failed to fetch user notifications');
    }
  }

  /**
   * DELETE /api/notification/{id} - Delete notification
   */
  async delete(id: string): Promise<boolean> {
    try {
      const response = await apiClient.delete<GenericResponse<boolean>>(`${this.endpoint}/${id}`);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to delete notification');
    }
  }

  private handleError(error: any, defaultMessage: string): Error {
    if (error.response?.data) {
      const errorResponse = error.response.data as GenericResponse<any>;
      const errorMessage = errorResponse.errors?.join(', ') || errorResponse.message || defaultMessage;
      return new Error(errorMessage);
    }
    return error;
  }
}

// ============================================
// AUDIT LOG SERVICE
// ============================================

export class AuditLogService {
  private endpoint = '/auditlog';

  /**
   * GET /api/auditlog - Get all audit logs
   */
  async getAll(): Promise<AuditLogDto[]> {
    try {
      const response = await apiClient.get<GenericResponse<AuditLogDto[]>>(this.endpoint);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data || [];
    } catch (error: any) {
      throw this.handleError(error, 'Failed to fetch audit logs');
    }
  }

  /**
   * GET /api/auditlog/paged - Get audit logs with pagination
   */
  async getPaged(pageNumber: number = 1, pageSize: number = 10): Promise<PagedResult<AuditLogDto>> {
    try {
      const response = await apiClient.get<GenericResponse<PagedResult<AuditLogDto>>>(
        `${this.endpoint}/paged`,
        {
          params: { pageNumber, pageSize }
        }
      );
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to fetch paginated audit logs');
    }
  }

  /**
   * GET /api/auditlog/{id} - Get audit log by ID
   */
  async getById(id: string): Promise<AuditLogDto> {
    try {
      const response = await apiClient.get<GenericResponse<AuditLogDto>>(`${this.endpoint}/${id}`);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to fetch audit log');
    }
  }

  private handleError(error: any, defaultMessage: string): Error {
    if (error.response?.data) {
      const errorResponse = error.response.data as GenericResponse<any>;
      const errorMessage = errorResponse.errors?.join(', ') || errorResponse.message || defaultMessage;
      return new Error(errorMessage);
    }
    return error;
  }
}

// ============================================
// SERVICE INSTANCES
// ============================================

export const userManagementService = new UserManagementService();
export const roleManagementService = new RoleManagementService();
export const dashboardService = new DashboardService();
export const notificationService = new NotificationService();
export const auditLogService = new AuditLogService();
