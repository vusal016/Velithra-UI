/**
 * Velithra - Module Configuration
 * Define all available modules with their permissions
 */

import { 
  Home, 
  Users, 
  BookOpen, 
  Package, 
  MessageCircle, 
  CheckSquare, 
  Bell, 
  FileText, 
  Settings,
  UserPlus,
  Building2,
  Briefcase,
  type LucideIcon
} from 'lucide-react';

export interface ModuleDefinition {
  code: string;
  name: string;
  path: string;
  icon: LucideIcon;
  roles: string[];
  order: number;
  category?: 'core' | 'hr' | 'lms' | 'operations' | 'admin';
  description?: string;
}

export const MODULES: Record<string, ModuleDefinition> = {
  DASHBOARD: {
    code: 'DASHBOARD',
    name: 'Dashboard',
    path: '/dashboard',
    icon: Home,
    roles: ['Admin', 'Manager', 'Employee'],
    order: 1,
    category: 'core',
    description: 'Main dashboard overview',
  },
  
  USERS: {
    code: 'USERS',
    name: 'User Management',
    path: '/dashboard/users/create',
    icon: UserPlus,
    roles: ['Admin'],
    order: 2,
    category: 'admin',
    description: 'Create and manage users',
  },
  
  HR: {
    code: 'HR',
    name: 'HR Manager',
    path: '/dashboard/hr',
    icon: Users,
    roles: ['Admin', 'Manager'],
    order: 3,
    category: 'hr',
    description: 'Human Resources management',
  },
  
  EMPLOYEES: {
    code: 'EMPLOYEES',
    name: 'Employees',
    path: '/dashboard/hr/employees',
    icon: Briefcase,
    roles: ['Admin', 'Manager'],
    order: 4,
    category: 'hr',
    description: 'Employee management',
  },
  
  DEPARTMENTS: {
    code: 'DEPARTMENTS',
    name: 'Departments',
    path: '/dashboard/hr/departments',
    icon: Building2,
    roles: ['Admin', 'Manager'],
    order: 5,
    category: 'hr',
    description: 'Department management',
  },
  
  COURSES: {
    code: 'COURSES',
    name: 'Course Manager',
    path: '/dashboard/course',
    icon: BookOpen,
    roles: ['Admin', 'Manager', 'Employee'],
    order: 6,
    category: 'lms',
    description: 'Learning Management System',
  },
  
  TASKS: {
    code: 'TASKS',
    name: 'Task Manager',
    path: '/dashboard/task',
    icon: CheckSquare,
    roles: ['Admin', 'Manager', 'Employee'],
    order: 7,
    category: 'operations',
    description: 'Task and project management',
  },
  
  INVENTORY: {
    code: 'INVENTORY',
    name: 'Inventory',
    path: '/dashboard/inventory',
    icon: Package,
    roles: ['Admin', 'Manager'],
    order: 8,
    category: 'operations',
    description: 'Inventory management',
  },
  
  CHAT: {
    code: 'CHAT',
    name: 'Chat',
    path: '/dashboard/chat',
    icon: MessageCircle,
    roles: ['Admin', 'Manager', 'Employee'],
    order: 9,
    category: 'core',
    description: 'Real-time messaging',
  },
  
  NOTIFICATIONS: {
    code: 'NOTIFICATIONS',
    name: 'Notifications',
    path: '/dashboard/notifications',
    icon: Bell,
    roles: ['Admin', 'Manager', 'Employee'],
    order: 10,
    category: 'core',
    description: 'Notification center',
  },
  
  AUDIT: {
    code: 'AUDIT',
    name: 'Audit Logs',
    path: '/dashboard/audit-logs',
    icon: FileText,
    roles: ['Admin'],
    order: 11,
    category: 'admin',
    description: 'System audit logs',
  },
  
  MODULES: {
    code: 'MODULES',
    name: 'Module Manager',
    path: '/dashboard/modules',
    icon: Settings,
    roles: ['Admin'],
    order: 12,
    category: 'admin',
    description: 'Module configuration',
  },
};

/**
 * Get modules filtered by user roles and active status
 */
export function getVisibleModules(
  userRoles: string[],
  activeModuleCodes: string[]
): ModuleDefinition[] {
  return Object.values(MODULES)
    .filter((module) => {
      const hasRole = module.roles.some((role) => userRoles.includes(role));
      const isActive = activeModuleCodes.includes(module.code);
      return hasRole && isActive;
    })
    .sort((a, b) => a.order - b.order);
}

/**
 * Get modules by category
 */
export function getModulesByCategory(
  category: string,
  userRoles: string[],
  activeModuleCodes: string[]
): ModuleDefinition[] {
  return getVisibleModules(userRoles, activeModuleCodes).filter(
    (module) => module.category === category
  );
}

/**
 * Check if user has access to module
 */
export function hasModuleAccess(
  moduleCode: string,
  userRoles: string[],
  activeModuleCodes: string[]
): boolean {
  const module = MODULES[moduleCode];
  if (!module) return false;
  
  const hasRole = module.roles.some((role) => userRoles.includes(role));
  const isActive = activeModuleCodes.includes(moduleCode);
  
  return hasRole && isActive;
}
