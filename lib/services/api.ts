/**
 * Velithra - Complete API Services
 * All backend endpoints with TypeScript types
 */

import apiClient from './client';
import type {
  // Auth
  LoginDto,
  RegisterDto,
  LoginResponseDto,
  RefreshTokenDto,
  
  // Users
  AppUserDto,
  AppUserUpdateDto,
  
  // Roles
  RoleDto,
  RoleCreateDto,
  RoleUpdateDto,
  
  // Modules
  ModuleDto,
  ModuleCreateDto,
  ModuleUpdateDto,
  ModuleStatusUpdateDto,
  
  // Employees
  EmployeeDto,
  EmployeeCreateDto,
  EmployeeUpdateDto,
  
  // Departments
  DepartmentDto,
  DepartmentCreateDto,
  DepartmentUpdateDto,
  
  // Positions
  PositionDto,
  PositionCreateDto,
  PositionUpdateDto,
  
  // Courses
  CourseDto,
  CourseCreateDto,
  CourseUpdateDto,
  
  // Lessons
  LessonDto,
  LessonCreateDto,
  LessonUpdateDto,
  
  // Enrollments
  EnrollmentDto,
  EnrollmentCreateDto,
  
  // Items
  ItemDto,
  ItemCreateDto,
  ItemUpdateDto,
  
  // Categories
  CategoryDto,
  CategoryCreateDto,
  CategoryUpdateDto,
  
  // Stock Transactions
  StockTransactionDto,
  StockTransactionCreateDto,
  
  // Tasks
  TaskDto,
  TaskCreateDto,
  TaskUpdateDto,
  
  // Task Comments
  TaskCommentDto,
  TaskCommentCreateDto,
  
  // Chat
  ChatRoomDto,
  ChatRoomCreateDto,
  ChatMessageDto,
  ChatMessageCreateDto,
  
  // Notifications
  NotificationDto,
  
  // Audit Logs
  AuditLogDto,
  
  // Generic
  PagedResult,
  GenericResponse,
} from '@/lib/types';

// ============================================
// AUTH SERVICES
// ============================================

export const authService = {
  login: (data: LoginDto) =>
    apiClient.post<GenericResponse<LoginResponseDto>>('/api/Auth/login', data),
  
  register: (data: RegisterDto) =>
    apiClient.post<GenericResponse<LoginResponseDto>>('/api/Auth/register', data),
  
  refreshToken: (data: RefreshTokenDto) =>
    apiClient.post<GenericResponse<LoginResponseDto>>('/api/Auth/refresh-token', data),
  
  logout: () =>
    apiClient.post('/api/Auth/logout'),
  
  getUserInfo: () =>
    apiClient.get<GenericResponse<AppUserDto>>('/api/Auth/user-info'),
};

// ============================================
// USER SERVICES
// ============================================

export const userService = {
  getAll: () =>
    apiClient.get<GenericResponse<AppUserDto[]>>('/api/AppUser'),
  
  getPaged: (pageNumber: number, pageSize: number) =>
    apiClient.get<GenericResponse<PagedResult<AppUserDto>>>(`/api/AppUser/paged?pageNumber=${pageNumber}&pageSize=${pageSize}`),
  
  getById: (id: string) =>
    apiClient.get<GenericResponse<AppUserDto>>(`/api/AppUser/${id}`),
  
  update: (id: string, data: AppUserUpdateDto) =>
    apiClient.put<GenericResponse<void>>(`/api/AppUser/${id}`, data),
  
  delete: (id: string) =>
    apiClient.delete<GenericResponse<void>>(`/api/AppUser/${id}`),
  
  assignRoles: (userId: string, roleIds: string[]) =>
    apiClient.post<GenericResponse<void>>(`/api/AppUser/${userId}/roles`, roleIds),
};

// ============================================
// ROLE SERVICES
// ============================================

export const roleService = {
  getAll: () =>
    apiClient.get<GenericResponse<RoleDto[]>>('/api/Role'),
  
  getById: (id: string) =>
    apiClient.get<GenericResponse<RoleDto>>(`/api/Role/${id}`),
  
  create: (data: RoleCreateDto) =>
    apiClient.post<GenericResponse<string>>('/api/Role', data),
  
  update: (id: string, data: RoleUpdateDto) =>
    apiClient.put<GenericResponse<void>>(`/api/Role/${id}`, data),
  
  delete: (id: string) =>
    apiClient.delete<GenericResponse<void>>(`/api/Role/${id}`),
};

// ============================================
// MODULE SERVICES
// ============================================

export const moduleService = {
  getAll: () =>
    apiClient.get<GenericResponse<ModuleDto[]>>('/api/Module'),
  
  getActive: () =>
    apiClient.get<GenericResponse<ModuleDto[]>>('/api/Module/active'),
  
  getById: (id: string) =>
    apiClient.get<GenericResponse<ModuleDto>>(`/api/Module/${id}`),
  
  create: (data: ModuleCreateDto) =>
    apiClient.post<GenericResponse<string>>('/api/Module', data),
  
  update: (data: ModuleUpdateDto) =>
    apiClient.put<GenericResponse<void>>('/api/Module', data),
  
  updateStatus: (data: ModuleStatusUpdateDto) =>
    apiClient.patch<GenericResponse<void>>('/api/Module/status', data),
  
  delete: (id: string) =>
    apiClient.delete<GenericResponse<void>>(`/api/Module/${id}`),
};

// ============================================
// EMPLOYEE SERVICES
// ============================================

export const employeeService = {
  getAll: () =>
    apiClient.get<GenericResponse<EmployeeDto[]>>('/api/Employee'),
  
  getPaged: (pageNumber: number, pageSize: number) =>
    apiClient.get<GenericResponse<PagedResult<EmployeeDto>>>(`/api/Employee/paged?pageNumber=${pageNumber}&pageSize=${pageSize}`),
  
  getById: (id: string) =>
    apiClient.get<GenericResponse<EmployeeDto>>(`/api/Employee/${id}`),
  
  create: (data: EmployeeCreateDto) =>
    apiClient.post<GenericResponse<string>>('/api/Employee', data),
  
  update: (id: string, data: EmployeeUpdateDto) =>
    apiClient.put<GenericResponse<void>>(`/api/Employee/${id}`, data),
  
  delete: (id: string) =>
    apiClient.delete<GenericResponse<void>>(`/api/Employee/${id}`),
};

// ============================================
// DEPARTMENT SERVICES
// ============================================

export const departmentService = {
  getAll: () =>
    apiClient.get<GenericResponse<DepartmentDto[]>>('/api/Department'),
  
  getById: (id: string) =>
    apiClient.get<GenericResponse<DepartmentDto>>(`/api/Department/${id}`),
  
  create: (data: DepartmentCreateDto) =>
    apiClient.post<GenericResponse<string>>('/api/Department', data),
  
  update: (id: string, data: DepartmentUpdateDto) =>
    apiClient.put<GenericResponse<void>>(`/api/Department/${id}`, data),
  
  delete: (id: string) =>
    apiClient.delete<GenericResponse<void>>(`/api/Department/${id}`),
};

// ============================================
// POSITION SERVICES
// ============================================

export const positionService = {
  getAll: () =>
    apiClient.get<GenericResponse<PositionDto[]>>('/api/Position'),
  
  getById: (id: string) =>
    apiClient.get<GenericResponse<PositionDto>>(`/api/Position/${id}`),
  
  create: (data: PositionCreateDto) =>
    apiClient.post<GenericResponse<string>>('/api/Position', data),
  
  update: (id: string, data: PositionUpdateDto) =>
    apiClient.put<GenericResponse<void>>(`/api/Position/${id}`, data),
  
  delete: (id: string) =>
    apiClient.delete<GenericResponse<void>>(`/api/Position/${id}`),
};

// ============================================
// COURSE SERVICES
// ============================================

export const courseService = {
  getAll: () =>
    apiClient.get<GenericResponse<CourseDto[]>>('/api/Course'),
  
  getPaged: (pageNumber: number, pageSize: number) =>
    apiClient.get<GenericResponse<PagedResult<CourseDto>>>(`/api/Course/paged?pageNumber=${pageNumber}&pageSize=${pageSize}`),
  
  getById: (id: string) =>
    apiClient.get<GenericResponse<CourseDto>>(`/api/Course/${id}`),
  
  create: (data: CourseCreateDto) =>
    apiClient.post<GenericResponse<string>>('/api/Course', data),
  
  update: (id: string, data: CourseUpdateDto) =>
    apiClient.put<GenericResponse<void>>(`/api/Course/${id}`, data),
  
  delete: (id: string) =>
    apiClient.delete<GenericResponse<void>>(`/api/Course/${id}`),
};

// ============================================
// LESSON SERVICES
// ============================================

export const lessonService = {
  getAll: () =>
    apiClient.get<GenericResponse<LessonDto[]>>('/api/Lesson'),
  
  getByCourse: (courseId: string) =>
    apiClient.get<GenericResponse<LessonDto[]>>(`/api/Lesson/course/${courseId}`),
  
  getById: (id: string) =>
    apiClient.get<GenericResponse<LessonDto>>(`/api/Lesson/${id}`),
  
  create: (data: LessonCreateDto) =>
    apiClient.post<GenericResponse<string>>('/api/Lesson', data),
  
  update: (id: string, data: LessonUpdateDto) =>
    apiClient.put<GenericResponse<void>>(`/api/Lesson/${id}`, data),
  
  delete: (id: string) =>
    apiClient.delete<GenericResponse<void>>(`/api/Lesson/${id}`),
};

// ============================================
// ENROLLMENT SERVICES
// ============================================

export const enrollmentService = {
  enroll: (data: EnrollmentCreateDto) =>
    apiClient.post<GenericResponse<string>>('/api/Enrollment/enroll', data),
  
  complete: (enrollmentId: string) =>
    apiClient.post<GenericResponse<void>>(`/api/Enrollment/complete/${enrollmentId}`),
  
  getByCourse: (courseId: string) =>
    apiClient.get<GenericResponse<EnrollmentDto[]>>(`/api/Enrollment/course/${courseId}`),
  
  getByEmployee: (employeeId: string) =>
    apiClient.get<GenericResponse<EnrollmentDto[]>>(`/api/Enrollment/employee/${employeeId}`),
};

// ============================================
// ITEM SERVICES
// ============================================

export const itemService = {
  getAll: () =>
    apiClient.get<GenericResponse<ItemDto[]>>('/api/Item'),
  
  getPaged: (pageNumber: number, pageSize: number) =>
    apiClient.get<GenericResponse<PagedResult<ItemDto>>>(`/api/Item/paged?pageNumber=${pageNumber}&pageSize=${pageSize}`),
  
  getById: (id: string) =>
    apiClient.get<GenericResponse<ItemDto>>(`/api/Item/${id}`),
  
  create: (data: ItemCreateDto) =>
    apiClient.post<GenericResponse<string>>('/api/Item', data),
  
  update: (id: string, data: ItemUpdateDto) =>
    apiClient.put<GenericResponse<void>>(`/api/Item/${id}`, data),
  
  delete: (id: string) =>
    apiClient.delete<GenericResponse<void>>(`/api/Item/${id}`),
};

// ============================================
// CATEGORY SERVICES
// ============================================

export const categoryService = {
  getAll: () =>
    apiClient.get<GenericResponse<CategoryDto[]>>('/api/Category'),
  
  getById: (id: string) =>
    apiClient.get<GenericResponse<CategoryDto>>(`/api/Category/${id}`),
  
  create: (data: CategoryCreateDto) =>
    apiClient.post<GenericResponse<string>>('/api/Category', data),
  
  update: (id: string, data: CategoryUpdateDto) =>
    apiClient.put<GenericResponse<void>>(`/api/Category/${id}`, data),
  
  delete: (id: string) =>
    apiClient.delete<GenericResponse<void>>(`/api/Category/${id}`),
};

// ============================================
// STOCK TRANSACTION SERVICES
// ============================================

export const stockTransactionService = {
  getAll: () =>
    apiClient.get<GenericResponse<StockTransactionDto[]>>('/api/StockTransaction'),
  
  getPaged: (pageNumber: number, pageSize: number) =>
    apiClient.get<GenericResponse<PagedResult<StockTransactionDto>>>(`/api/StockTransaction/paged?pageNumber=${pageNumber}&pageSize=${pageSize}`),
  
  getById: (id: string) =>
    apiClient.get<GenericResponse<StockTransactionDto>>(`/api/StockTransaction/${id}`),
  
  create: (data: StockTransactionCreateDto) =>
    apiClient.post<GenericResponse<string>>('/api/StockTransaction', data),
  
  delete: (id: string) =>
    apiClient.delete<GenericResponse<void>>(`/api/StockTransaction/${id}`),
};

// ============================================
// TASK SERVICES
// ============================================

export const taskService = {
  getAll: () =>
    apiClient.get<GenericResponse<TaskDto[]>>('/api/Task'),
  
  getById: (id: string) =>
    apiClient.get<GenericResponse<TaskDto>>(`/api/Task/${id}`),
  
  create: (data: TaskCreateDto) =>
    apiClient.post<GenericResponse<string>>('/api/Task', data),
  
  update: (id: string, data: TaskUpdateDto) =>
    apiClient.put<GenericResponse<void>>(`/api/Task/${id}`, data),
  
  delete: (id: string) =>
    apiClient.delete<GenericResponse<void>>(`/api/Task/${id}`),
  
  getComments: (taskId: string) =>
    apiClient.get<GenericResponse<TaskCommentDto[]>>(`/api/Task/${taskId}/comments`),
  
  addComment: (data: TaskCommentCreateDto) =>
    apiClient.post<GenericResponse<string>>('/api/TaskComment', data),
};

// ============================================
// CHAT SERVICES
// ============================================

export const chatService = {
  getRooms: () =>
    apiClient.get<GenericResponse<ChatRoomDto[]>>('/api/Chat/rooms'),
  
  getRoom: (id: string) =>
    apiClient.get<GenericResponse<ChatRoomDto>>(`/api/Chat/rooms/${id}`),
  
  createRoom: (data: ChatRoomCreateDto) =>
    apiClient.post<GenericResponse<string>>('/api/Chat/rooms', data),
  
  getMessages: (roomId: string) =>
    apiClient.get<GenericResponse<ChatMessageDto[]>>(`/api/Chat/messages/${roomId}`),
  
  sendMessage: (data: ChatMessageCreateDto) =>
    apiClient.post<GenericResponse<string>>('/api/Chat/messages', data),
  
  joinRoom: (roomId: string) =>
    apiClient.post<GenericResponse<void>>(`/api/Chat/rooms/${roomId}/join`),
};

// ============================================
// NOTIFICATION SERVICES
// ============================================

export const notificationService = {
  getAll: () =>
    apiClient.get<GenericResponse<NotificationDto[]>>('/api/Notification'),
  
  getPaged: (pageNumber: number, pageSize: number) =>
    apiClient.get<GenericResponse<PagedResult<NotificationDto>>>(`/api/Notification/paged?pageNumber=${pageNumber}&pageSize=${pageSize}`),
  
  getById: (id: string) =>
    apiClient.get<GenericResponse<NotificationDto>>(`/api/Notification/${id}`),
  
  markAsRead: (id: string) =>
    apiClient.patch<GenericResponse<void>>(`/api/Notification/${id}/mark-as-read`),
  
  delete: (id: string) =>
    apiClient.delete<GenericResponse<void>>(`/api/Notification/${id}`),
};

// ============================================
// AUDIT LOG SERVICES
// ============================================

export const auditLogService = {
  getAll: () =>
    apiClient.get<GenericResponse<AuditLogDto[]>>('/api/AuditLog'),
  
  getPaged: (pageNumber: number, pageSize: number) =>
    apiClient.get<GenericResponse<PagedResult<AuditLogDto>>>(`/api/AuditLog/paged?pageNumber=${pageNumber}&pageSize=${pageSize}`),
  
  getById: (id: string) =>
    apiClient.get<GenericResponse<AuditLogDto>>(`/api/AuditLog/${id}`),
};

// ============================================
// DASHBOARD SERVICES
// ============================================

export const dashboardService = {
  getMetrics: () =>
    apiClient.get<GenericResponse<any>>('/api/Dashboard/metrics'),
  
  getAdminDashboard: () =>
    apiClient.get<GenericResponse<any>>('/api/Dashboard/admin'),
  
  getManagerDashboard: () =>
    apiClient.get<GenericResponse<any>>('/api/Dashboard/manager'),
  
  getUserDashboard: () =>
    apiClient.get<GenericResponse<any>>('/api/Dashboard/user'),
};
