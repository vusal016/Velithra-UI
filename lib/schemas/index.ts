/**
 * Velithra - Form Schemas
 * Zod validation schemas for common forms
 */

import { z } from 'zod';

// ============================================
// AUTH SCHEMAS
// ============================================

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z
  .object({
    userName: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// ============================================
// MODULE SCHEMAS
// ============================================

export const moduleCreateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

export const moduleUpdateSchema = z.object({
  id: z.string().uuid('Invalid module ID'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  isActive: z.boolean(),
});

// ============================================
// EMPLOYEE SCHEMAS
// ============================================

export const employeeCreateSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().optional(),
  departmentId: z.string().uuid('Please select a department'),
  positionId: z.string().uuid('Please select a position'),
  hireDate: z.string(),
  salary: z.number().positive('Salary must be positive'),
});

export const employeeUpdateSchema = employeeCreateSchema.extend({
  id: z.string().uuid('Invalid employee ID'),
});

// ============================================
// TASK SCHEMAS
// ============================================

export const taskCreateSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  priority: z.enum(['Low', 'Medium', 'High'], {
    errorMap: () => ({ message: 'Please select a priority' }),
  }),
  dueDate: z.string(),
  assignedToId: z.string().uuid('Please assign to a user').optional(),
});

export const taskUpdateSchema = taskCreateSchema.extend({
  id: z.string().uuid('Invalid task ID'),
  status: z.enum(['Pending', 'InProgress', 'Completed'], {
    errorMap: () => ({ message: 'Please select a status' }),
  }),
});

// ============================================
// COURSE SCHEMAS
// ============================================

export const courseCreateSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  instructorName: z.string().min(2, 'Instructor name is required'),
  duration: z.number().positive('Duration must be positive'),
  maxEnrollments: z.number().positive('Max enrollments must be positive'),
  startDate: z.string(),
  endDate: z.string(),
});

export const courseUpdateSchema = courseCreateSchema.extend({
  id: z.string().uuid('Invalid course ID'),
  isActive: z.boolean(),
});

// ============================================
// INVENTORY SCHEMAS
// ============================================

export const itemCreateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  categoryId: z.string().uuid('Please select a category'),
  quantity: z.number().int().min(0, 'Quantity cannot be negative'),
  unit: z.string().min(1, 'Unit is required'),
  reorderLevel: z.number().int().min(0, 'Reorder level cannot be negative'),
  price: z.number().positive('Price must be positive'),
});

export const itemUpdateSchema = itemCreateSchema.extend({
  id: z.string().uuid('Invalid item ID'),
});

// ============================================
// TYPE EXPORTS
// ============================================

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ModuleCreateFormData = z.infer<typeof moduleCreateSchema>;
export type ModuleUpdateFormData = z.infer<typeof moduleUpdateSchema>;
export type EmployeeCreateFormData = z.infer<typeof employeeCreateSchema>;
export type EmployeeUpdateFormData = z.infer<typeof employeeUpdateSchema>;
export type TaskCreateFormData = z.infer<typeof taskCreateSchema>;
export type TaskUpdateFormData = z.infer<typeof taskUpdateSchema>;
export type CourseCreateFormData = z.infer<typeof courseCreateSchema>;
export type CourseUpdateFormData = z.infer<typeof courseUpdateSchema>;
export type ItemCreateFormData = z.infer<typeof itemCreateSchema>;
export type ItemUpdateFormData = z.infer<typeof itemUpdateSchema>;
