/**
 * Role-Based Access Control Configuration
 * Define roles, their permissions, and accessible endpoints without database seeds
 */

export interface RoleConfig {
  name: string;
  displayName: string;
  description: string;
  panelRoute: string; // Where to redirect after login
  permissions: {
    endpoints: string[]; // API endpoints this role can access
    uiRoutes: string[]; // UI routes this role can access
  };
}

/**
 * All available API endpoints in the system
 */
export const ALL_ENDPOINTS = {
  // Auth
  AUTH: [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/refresh-token',
    '/api/auth/revoke-token',
  ],
  
  // User Management
  USER: [
    '/api/appuser',
    '/api/appuser/paged',
    '/api/appuser/{id}',
  ],
  
  // Role Management
  ROLE: [
    '/api/role',
    '/api/role/{id}',
    '/api/role/assign',
  ],
  
  // Dashboard
  DASHBOARD: [
    '/api/dashboard/stats',
    '/api/dashboard/recent-activity',
  ],
  
  // HR Module
  EMPLOYEE: [
    '/api/employee',
    '/api/employee/paged',
    '/api/employee/{id}',
    '/api/employee/create',
  ],
  DEPARTMENT: [
    '/api/department',
    '/api/department/{id}',
  ],
  POSITION: [
    '/api/position',
    '/api/position/{id}',
  ],
  
  // Course Module
  COURSE: [
    '/api/course',
    '/api/course/paged',
    '/api/course/{id}',
    '/api/course/create',
  ],
  LESSON: [
    '/api/lesson',
    '/api/lesson/{id}',
    '/api/lesson/bycourse/{courseId}',
  ],
  ENROLLMENT: [
    '/api/enrollment',
    '/api/enrollment/{id}',
    '/api/enrollment/user/{userId}',
    '/api/enrollment/course/{courseId}',
  ],
  
  // Task Module
  TASK: [
    '/api/task',
    '/api/task/paged',
    '/api/task/{id}',
    '/api/task/create',
    '/api/task/assign',
  ],
  
  // Module Management
  MODULE: [
    '/api/module',
    '/api/module/{id}',
  ],
  
  // Inventory Module
  CATEGORY: [
    '/api/category',
    '/api/category/{id}',
  ],
  ITEM: [
    '/api/item',
    '/api/item/{id}',
  ],
  STOCK_TRANSACTION: [
    '/api/stocktransaction',
    '/api/stocktransaction/{id}',
  ],
  
  // Notification Module
  NOTIFICATION: [
    '/api/notification',
    '/api/notification/{id}',
    '/api/notification/user/{userId}',
  ],
  
  // Chat Module (via SignalR)
  CHAT: [
    '/api/chat/messages',
    '/api/chat/rooms',
  ],
  
  // Audit Log
  AUDIT: [
    '/api/auditlog',
    '/api/auditlog/paged',
  ],
};

/**
 * Role Configurations
 * Add new roles here and they will be dynamically available in the system
 */
export const ROLE_CONFIGS: Record<string, RoleConfig> = {
  Admin: {
    name: 'Admin',
    displayName: 'Administrator',
    description: 'Full system access with all permissions',
    panelRoute: '/dashboard',
    permissions: {
      endpoints: [
        ...ALL_ENDPOINTS.AUTH,
        ...ALL_ENDPOINTS.USER,
        ...ALL_ENDPOINTS.ROLE,
        ...ALL_ENDPOINTS.DASHBOARD,
        ...ALL_ENDPOINTS.EMPLOYEE,
        ...ALL_ENDPOINTS.DEPARTMENT,
        ...ALL_ENDPOINTS.POSITION,
        ...ALL_ENDPOINTS.COURSE,
        ...ALL_ENDPOINTS.LESSON,
        ...ALL_ENDPOINTS.ENROLLMENT,
        ...ALL_ENDPOINTS.TASK,
        ...ALL_ENDPOINTS.MODULE,
        ...ALL_ENDPOINTS.CATEGORY,
        ...ALL_ENDPOINTS.ITEM,
        ...ALL_ENDPOINTS.STOCK_TRANSACTION,
        ...ALL_ENDPOINTS.NOTIFICATION,
        ...ALL_ENDPOINTS.CHAT,
        ...ALL_ENDPOINTS.AUDIT,
      ],
      uiRoutes: [
        '/dashboard',
        '/admin/users',
        '/admin/roles',
        '/dashboard/users',
        '/dashboard/roles',
        '/dashboard/audit-logs',
        '/dashboard/modules',
        '/dashboard/notifications',
        '/hr/employees',
        '/hr/departments',
        '/hr/positions',
        '/courses',
        '/tasks',
        '/inventory',
        '/chat',
        '/notifications',
        '/audit-logs',
      ],
    },
  },

  HR: {
    name: 'HR',
    displayName: 'Human Resources',
    description: 'Manage employees, departments, and positions',
    panelRoute: '/hr',
    permissions: {
      endpoints: [
        ...ALL_ENDPOINTS.AUTH,
        ...ALL_ENDPOINTS.EMPLOYEE,
        ...ALL_ENDPOINTS.DEPARTMENT,
        ...ALL_ENDPOINTS.POSITION,
        ...ALL_ENDPOINTS.USER.filter(e => e.includes('/paged') || !e.includes('{')), // Can view users but not modify
        ...ALL_ENDPOINTS.NOTIFICATION,
        ...ALL_ENDPOINTS.CHAT,
        ...ALL_ENDPOINTS.TASK.filter(e => !e.includes('create')), // Can view tasks, not create
      ],
      uiRoutes: [
        '/hr',
        '/hr/employees',
        '/hr/employees/create',
        '/hr/employees/edit',
        '/hr/departments',
        '/hr/positions',
        '/tasks',
        '/notifications',
        '/chat',
      ],
    },
  },

  User: {
    name: 'User',
    displayName: 'Regular User',
    description: 'Basic user access to tasks, notifications, and chat',
    panelRoute: '/user',
    permissions: {
      endpoints: [
        ...ALL_ENDPOINTS.AUTH,
        ...ALL_ENDPOINTS.TASK,
        ...ALL_ENDPOINTS.NOTIFICATION,
        ...ALL_ENDPOINTS.CHAT,
      ],
      uiRoutes: [
        '/user',
        '/user/dashboard',
        '/user/tasks',
        '/user/notifications',
        '/user/chat',
      ],
    },
  },

  // Teacher role can be added dynamically via /admin/roles page
  Teacher: {
    name: 'Teacher',
    displayName: 'Teacher',
    description: 'Manage courses, lessons, and student enrollments',
    panelRoute: '/user', // Uses user panel but with extended permissions
    permissions: {
      endpoints: [
        ...ALL_ENDPOINTS.AUTH,
        ...ALL_ENDPOINTS.COURSE,
        ...ALL_ENDPOINTS.LESSON,
        ...ALL_ENDPOINTS.ENROLLMENT,
        ...ALL_ENDPOINTS.TASK,
        ...ALL_ENDPOINTS.NOTIFICATION,
        ...ALL_ENDPOINTS.CHAT,
      ],
      uiRoutes: [
        '/user',
        '/user/dashboard',
        '/user/courses',
        '/user/tasks',
        '/user/notifications',
        '/user/chat',
      ],
    },
  },
};

/**
 * Get role configuration by name
 */
export function getRoleConfig(roleName: string): RoleConfig | null {
  return ROLE_CONFIGS[roleName] || null;
}

/**
 * Check if role has access to specific endpoint
 */
export function canAccessEndpoint(roleName: string, endpoint: string): boolean {
  const config = getRoleConfig(roleName);
  if (!config) return false;
  
  // Check exact match or pattern match (e.g., /api/employee/{id})
  return config.permissions.endpoints.some(allowed => {
    const pattern = allowed.replace(/\{[^}]+\}/g, '[^/]+');
    return new RegExp(`^${pattern}$`).test(endpoint);
  });
}

/**
 * Check if role has access to specific UI route
 */
export function canAccessRoute(roleName: string, route: string): boolean {
  const config = getRoleConfig(roleName);
  if (!config) return false;
  
  return config.permissions.uiRoutes.some(allowed => 
    route.startsWith(allowed)
  );
}

/**
 * Get all available roles
 */
export function getAllRoles(): RoleConfig[] {
  return Object.values(ROLE_CONFIGS);
}

/**
 * Add new role dynamically (used by /admin/roles page)
 */
export function addRole(config: RoleConfig): void {
  ROLE_CONFIGS[config.name] = config;
}

/**
 * Update existing role
 */
export function updateRole(roleName: string, config: Partial<RoleConfig>): boolean {
  if (!ROLE_CONFIGS[roleName]) return false;
  ROLE_CONFIGS[roleName] = { ...ROLE_CONFIGS[roleName], ...config };
  return true;
}

/**
 * Remove role
 */
export function removeRole(roleName: string): boolean {
  if (!ROLE_CONFIGS[roleName]) return false;
  delete ROLE_CONFIGS[roleName];
  return true;
}
