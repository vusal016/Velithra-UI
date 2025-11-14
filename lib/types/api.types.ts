/**
 * Velithra - Backend DTO Types
 * Matches ASP.NET Core WebAPI DTOs exactly
 */

// ============================================
// GENERIC TYPES
// ============================================

export interface GenericResponse<T> {
  data: T;
  message: string;
  success: boolean;
  statusCode: number;
  errors?: string[]; // Validation errors
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

// ============================================
// AUTH TYPES
// ============================================

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  userName: string;
  email: string;
  password: string;
  fullName: string;
}

export interface RefreshTokenDto {
  token: string;
  refreshToken: string;
}

export interface LoginResponseDto {
  token: string;
  refreshToken: string;
  userId: string;
  roles: string[];
}

// Aliases for compatibility
export type LoginRequest = LoginDto;
export type RegisterRequest = RegisterDto;

// User type for frontend
export interface User {
  id: string;
  userName: string;
  email: string;
  fullName: string;
  roles: string[];
  profileImageUrl?: string;
  bio?: string;
  createdAt?: string;
}

// ============================================
// USER TYPES
// ============================================

export interface AppUserDto {
  id: string;
  userName: string;
  email: string;
  fullName: string;
  profileImageUrl?: string;
  bio?: string;
  createdAt: string;
  roles: string[];
}

export interface AppUserUpdateDto {
  fullName: string;
  bio?: string;
  profileImageUrl?: string;
}

export interface AppUserCreateDto {
  userName: string;
  email: string;
  password: string;
  fullName: string;
  roleId?: string;
}

// ============================================
// ROLE TYPES
// ============================================

export interface RoleDto {
  id: string;
  name: string;
  description?: string;
}

export interface RoleCreateDto {
  name: string;
  description?: string;
}

export interface RoleUpdateDto {
  id: string;
  name: string;
  description?: string;
}

// ============================================
// MODULE TYPES
// ============================================

export interface ModuleDto {
  id: string;
  name: string;
  description?: string;
  code: string;
  isActive: boolean;
  activatedAt?: string;
  deactivatedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ModuleCreateDto {
  name: string;
  description?: string;
  code: string;
}

export interface ModuleUpdateDto {
  id: string;
  name: string;
  description?: string;
  code: string;
}

export interface ModuleStatusUpdateDto {
  id: string;
  isActive: boolean;
}

// ============================================
// EMPLOYEE TYPES
// ============================================

export enum EmployeeStatus {
  Active = 'Active',
  OnLeave = 'OnLeave',
  Suspended = 'Suspended',
  Terminated = 'Terminated',
}

export interface EmployeeDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  positionId: string;
  positionTitle?: string;
  departmentId: string;
  departmentName?: string;
  userId?: string;
  hireDate: string;
  status: EmployeeStatus;
  phoneNumber?: string;
  address?: string;
  dateOfBirth?: string;
  createdAt: string;
}

export interface EmployeeCreateDto {
  firstName: string;
  lastName: string;
  email: string;
  positionId: string;
  departmentId: string;
  hireDate: string;
  phoneNumber?: string;
  address?: string;
  dateOfBirth?: string;
}

export interface EmployeeUpdateDto {
  firstName: string;
  lastName: string;
  email: string;
  positionId: string;
  departmentId: string;
  hireDate?: string;
  status: EmployeeStatus;
  phoneNumber?: string;
  address?: string;
  dateOfBirth?: string;
}

// ============================================
// DEPARTMENT TYPES
// ============================================

export interface DepartmentDto {
  id: string;
  name: string;
  description?: string;
  managerId?: string;
  managerName?: string;
  employeeCount: number;
  createdAt: string;
}

export interface DepartmentCreateDto {
  name: string;
  description?: string;
  managerId?: string;
}

export interface DepartmentUpdateDto {
  name: string;
  description?: string;
  managerId?: string;
}

// ============================================
// POSITION TYPES
// ============================================

export interface PositionDto {
  id: string;
  title: string;
  description?: string;
  departmentId: string;
  departmentName?: string;
  employeeCount: number;
  createdAt: string;
}

export interface PositionCreateDto {
  title: string;
  description?: string;
  departmentId: string;
}

export interface PositionUpdateDto {
  title: string;
  description?: string;
  departmentId: string;
}

// ============================================
// COURSE TYPES
// ============================================

export interface CourseDto {
  id: string;
  title: string;
  description?: string;
  durationInHours: number;
  lessonCount: number;
  enrollmentCount: number;
  createdAt: string;
}

export interface CourseCreateDto {
  title: string;
  description?: string;
  durationInHours: number;
}

export interface CourseUpdateDto {
  title: string;
  description?: string;
  durationInHours: number;
}

// ============================================
// LESSON TYPES
// ============================================

export interface LessonDto {
  id: string;
  title: string;
  content: string;
  courseId: string;
  courseTitle?: string;
  createdAt: string;
}

export interface LessonCreateDto {
  title: string;
  content: string;
  courseId: string;
}

export interface LessonUpdateDto {
  title: string;
  content: string;
}

// ============================================
// ENROLLMENT TYPES
// ============================================

export enum EnrollmentStatus {
  Active = 'Active',
  Completed = 'Completed',
  Suspended = 'Suspended',
  Cancelled = 'Cancelled',
}

export interface EnrollmentDto {
  id: string;
  courseId: string;
  courseTitle?: string;
  employeeId: string;
  employeeName?: string;
  userId?: string; // Added for compatibility
  enrolledAt: string;
  enrollmentDate?: string; // Alias for enrolledAt
  completedAt?: string;
  status: EnrollmentStatus;
  progress: number;
}

export interface EnrollmentCreateDto {
  courseId: string;
  employeeId: string;
}

// ============================================
// ITEM TYPES
// ============================================

export interface ItemDto {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice?: number; // Added for inventory pricing
  categoryId: string;
  categoryName?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ItemCreateDto {
  name: string;
  description?: string;
  quantity: number;
  unitPrice?: number;
  categoryId: string;
}

export interface ItemUpdateDto {
  name: string;
  description?: string;
  categoryId: string;
}

// ============================================
// CATEGORY TYPES
// ============================================

export interface CategoryDto {
  id: string;
  name: string;
  description?: string;
  itemCount: number;
  createdAt: string;
}

export interface CategoryCreateDto {
  name: string;
  description?: string;
}

export interface CategoryUpdateDto {
  name: string;
  description?: string;
}

// ============================================
// STOCK TRANSACTION TYPES
// ============================================

export enum TransactionType {
  Purchase = 'Purchase',
  Sale = 'Sale',
  Return = 'Return',
  Adjustment = 'Adjustment',
  Transfer = 'Transfer',
}

export interface StockTransactionDto {
  id: string;
  itemId: string;
  itemName?: string;
  quantity: number;
  transactionType: TransactionType;
  transactionDate: string;
  notes?: string;
}

export interface StockTransactionCreateDto {
  itemId: string;
  quantity: number;
  transactionType: TransactionType;
  notes?: string;
}

// ============================================
// TASK TYPES
// ============================================

export enum TaskState {
  Pending = 'Pending',
  InProgress = 'InProgress',
  Completed = 'Completed',
  OnHold = 'OnHold',
  Cancelled = 'Cancelled',
}

export interface TaskDto {
  id: string;
  title: string;
  description?: string;
  deadline: string;
  assignedUserId: string;
  assignedUserName?: string;
  state: TaskState;
  commentCount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface TaskCreateDto {
  title: string;
  description?: string;
  deadline: string;
  assignedUserId: string;
}

export interface TaskUpdateDto {
  title: string;
  description?: string;
  deadline: string;
  state: TaskState;
}

export interface TaskAssignDto {
  taskId: string;
  assignedUserId: string;
}

// ============================================
// TASK COMMENT TYPES
// ============================================

export interface TaskCommentDto {
  id: string;
  taskId: string;
  authorId: string;
  authorName?: string;
  content: string;
  createdAt: string;
}

export interface TaskCommentCreateDto {
  taskId: string;
  content: string;
}

// ============================================
// CHAT TYPES
// ============================================

export interface ChatRoomDto {
  id: string;
  name: string;
  isPrivate: boolean;
  createdBy: string;
  createdByName?: string;
  participantCount: number;
  messageCount: number;
  createdAt: string;
}

export interface ChatRoomCreateDto {
  name: string;
  isPrivate: boolean;
  participantIds: string[];
}

export interface ChatRoomUpdateDto {
  name: string;
  isPrivate: boolean;
}

export interface ChatMessageDto {
  id: string;
  messageId?: string; // Alias for id
  chatRoomId: string;
  senderId: string;
  senderName?: string;
  content: string;
  message?: string; // Alias for content
  sentAt: string;
}

export interface ChatMessageCreateDto {
  chatRoomId: string;
  content: string;
}

// SignalR Chat Message (for real-time)
export interface ChatMessage {
  id: string;
  messageId: string;
  roomId: string;
  userId: string;
  userName: string;
  message: string;
  content: string;
  timestamp: string;
  sentAt: string;
}

// ============================================
// NOTIFICATION TYPES
// ============================================

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
  title: string;
  message: string;
  isRead: boolean;
}

// ============================================
// AUDIT LOG TYPES
// ============================================

export interface AuditLogDto {
  id: string;
  userId?: string;
  userName?: string;
  action: string;
  tableName: string;
  recordId?: string;
  details?: string;
  timestamp: string;
}

// ============================================
// DASHBOARD TYPES
// ============================================

export interface DashboardMetrics {
  totalUsers: number;
  totalEmployees: number;
  activeTasks: number;
  unreadNotifications: number;
  activeModules: number;
  recentActivities: AuditLogDto[];
}

// Dashboard Data Types
export interface AdminDashboardData {
  totalUsers: number;
  totalEmployees: number;
  activeModules: number;
  auditLogs: AuditLogDto[];
  systemHealth: {
    status: string;
    uptime: number;
  };
}

export interface ManagerDashboardData {
  teamMembers: number;
  activeTasks: number;
  pendingEnrollments: number;
  lowStockItems: number;
}

export interface UserDashboardData {
  myCourses: number;
  myTasks: number;
  unreadNotifications: number;
}

export interface DashboardStatistics {
  users: number;
  employees: number;
  tasks: number;
  courses: number;
  notifications: number;
}
