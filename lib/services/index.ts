/**
 * Velithra API Services - Index
 * Central export point for all services
 */

// Auth Service
export { authService, AuthService } from './authService';

// HR Service
export { hrService, HRService } from './hrService';

// CRUD Service
export { CrudService } from './crudService';

// Core Services
export {
  appLogService,
  appUserService,
  roleService,
  systemSettingService,
  notificationService,
  notificationServiceExtended,
  auditLogService,
  userPreferenceService,
  dashboardService,
} from './coreServices';

// Module Services
export {
  // Chat
  chatRoomService,
  chatServiceExtended,
  // Inventory
  itemService,
  categoryService,
  stockTransactionService,
  // HR
  employeeService,
  departmentService,
  positionService,
  // Course
  courseService,
  lessonService,
  enrollmentService,
  // Task
  taskService,
  // Module Manager
  moduleService,
} from './moduleServices';

// SignalR Service
export { signalRService } from './signalrService';
