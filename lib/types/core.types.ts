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
  confirmPassword: string;
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

// AppUser (matches backend API exactly)
export interface AppUserDto {
  id: string;
  userName: string;
  email: string;
  fullName: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AppUserCreateDto {
  email: string;
  userName: string;
  fullName: string;
  password: string;
  roleId: string;
}

export interface AppUserUpdateDto {
  id: string;
  userName: string;
  email: string;
}

export interface UpdateUserRequest {
  id: string;
  email: string;
  userName: string;
  password?: string;
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
  sentAt: string;
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

// Dashboard (matches backend endpoints)
export interface DashboardStatistics {
  users: number;
  roles: number;
  notifications: number;
}

export interface AdminDashboardData {
  users: number;
  roles: number;
  notifications: number;
}

export interface ManagerDashboardData {
  userId: string;
  notifications: number;
}

export interface UserDashboardData {
  userId: string;
  notifications: number;
}

// ============================================
// USER CONTEXT & ROLE DETECTION
// ============================================

export interface CurrentUser {
  id: string;
  userName: string;
  email: string;
  fullName?: string;
  roles: string[];
}

export type UserRole = 'Admin' | 'Manager' | 'User';

export interface RoleRedirect {
  role: UserRole;
  path: string;
}

// ============================================
// EMPLOYEE-USER LINKING
// ============================================

export interface EmployeeUserLink {
  employeeId: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface EnrollmentEligibility {
  isEligible: boolean;
  employeeId?: string;
  reason?: string;
}
