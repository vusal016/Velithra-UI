/**
 * Velithra Backend API - Type Definitions
 * Core Types & Interfaces for API Integration
 */

// ============================================
// GENERIC RESPONSE TYPES
// ============================================

export interface GenericResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  errors: string[] | null;
  statusCode: number;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

// ============================================
// AUTH TYPES
// ============================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  userName: string;
  email: string;
  password: string;
  fullName: string;
}

export interface AuthResponse {
  token: string;
  expiration: string;
  userName: string;
  email: string;
  roles: string[];
}

export interface User {
  userName: string;
  email: string;
  roles: string[];
}

// ============================================
// CORE ENTITY TYPES
// ============================================

// AppUser
export interface AppUserDto {
  id: string;
  userName: string;
  email: string;
  fullName: string;
  profileImageUrl?: string;
  bio?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface AppUserCreateDto {
  userName: string;
  email: string;
  password: string;
  roleId: string;
  fullName?: string;
  profileImageUrl?: string;
  bio?: string;
}

export interface AppUserUpdateDto {
  id: string;
  userName?: string;
  email?: string;
  fullName?: string;
  profileImageUrl?: string;
  bio?: string;
}

// AppLog
export interface AppLogDto {
  id: string;
  level: string; // "Information" | "Warning" | "Error"
  message: string;
  timestamp: Date;
  stackTrace?: string;
}

export interface AppLogCreateDto {
  level: string;
  message: string;
  stackTrace?: string;
}

export interface AppLogUpdateDto {
  id: string;
  level: string;
  message: string;
  stackTrace?: string;
}

// Role
export interface RoleDto {
  id: string;
  name: string;
  description: string;
}

export interface RoleCreateDto {
  name: string;
  description: string;
}

export interface RoleUpdateDto {
  id: string;
  name?: string;
  description?: string;
}

// SystemSetting
export interface SystemSettingDto {
  id: string;
  key: string;
  value: string;
}

export interface SystemSettingCreateDto {
  key: string;
  value: string;
}

export interface SystemSettingUpdateDto {
  id: string;
  key?: string;
  value?: string;
}

// Notification
export interface NotificationDto {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

export interface NotificationCreateDto {
  userId: string;
  title: string;
  message: string;
}

export interface NotificationUpdateDto {
  id: string;
  title?: string;
  message?: string;
  isRead?: boolean;
}

// AuditLog
export interface AuditLogDto {
  id: string;
  action: string;
  performedBy: string;
  timestamp: Date;
  details?: string;
}

export interface AuditLogCreateDto {
  action: string;
  performedBy: string;
  details?: string;
}

export interface AuditLogUpdateDto {
  id: string;
  action?: string;
  details?: string;
}

// UserPreference
export interface UserPreferenceDto {
  id: string;
  userId: string;
  key: string;
  value: string;
  createdAt: Date;
}

export interface UserPreferenceCreateDto {
  userId: string;
  key: string;
  value: string;
}

export interface UserPreferenceUpdateDto {
  id: string;
  key?: string;
  value?: string;
}

// Dashboard
export interface DashboardStatistics {
  users: number;
  roles: number;
  logs: number;
  notifications: number;
}

export interface DashboardData {
  users: number;
  roles: number;
  logs: number;
  unread: number;
}
