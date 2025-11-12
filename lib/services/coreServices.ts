/**
 * Velithra API - Core Services
 * Service instances for all core entities
 */

import { CrudService } from './crudService';
import type {
  AppLogDto,
  AppLogCreateDto,
  AppLogUpdateDto,
  AppUserDto,
  AppUserCreateDto,
  AppUserUpdateDto,
  RoleDto,
  RoleCreateDto,
  RoleUpdateDto,
  SystemSettingDto,
  SystemSettingCreateDto,
  SystemSettingUpdateDto,
  NotificationDto,
  NotificationCreateDto,
  NotificationUpdateDto,
  AuditLogDto,
  AuditLogCreateDto,
  AuditLogUpdateDto,
  UserPreferenceDto,
  UserPreferenceCreateDto,
  UserPreferenceUpdateDto,
  DashboardStatistics,
} from '@/lib/types';
import apiClient from '@/lib/api/client';
import type { GenericResponse } from '@/lib/types';

// ============================================
// CORE ENTITY SERVICES
// ============================================

export const appLogService = new CrudService<
  AppLogDto,
  AppLogCreateDto,
  AppLogUpdateDto
>('applog');

export const appUserService = new CrudService<
  AppUserDto,
  AppUserCreateDto,
  AppUserUpdateDto
>('appuser');

export const roleService = new CrudService<
  RoleDto,
  RoleCreateDto,
  RoleUpdateDto
>('role');

export const systemSettingService = new CrudService<
  SystemSettingDto,
  SystemSettingCreateDto,
  SystemSettingUpdateDto
>('systemsetting');

export const notificationService = new CrudService<
  NotificationDto,
  NotificationCreateDto,
  NotificationUpdateDto
>('notification');

export const auditLogService = new CrudService<
  AuditLogDto,
  AuditLogCreateDto,
  AuditLogUpdateDto
>('auditlog');

export const userPreferenceService = new CrudService<
  UserPreferenceDto,
  UserPreferenceCreateDto,
  UserPreferenceUpdateDto
>('userpreference');

// ============================================
// DASHBOARD SERVICE
// ============================================

export const dashboardService = {
  async getStatistics(): Promise<DashboardStatistics> {
    const response = await apiClient.get<GenericResponse<DashboardStatistics>>(
      '/dashboard/statistics'
    );
    return response.data.data!;
  },

  async refresh(): Promise<DashboardStatistics> {
    const response = await apiClient.get<GenericResponse<DashboardStatistics>>(
      '/dashboard/refresh'
    );
    return response.data.data!;
  },
};

// ============================================
// NOTIFICATION EXTENDED SERVICE
// ============================================

export const notificationServiceExtended = {
  ...notificationService,

  /**
   * Mark notification as read
   */
  async markAsRead(id: string): Promise<void> {
    await apiClient.post(`/notification/${id}/mark-read`);
  },
};
