/**
 * Velithra Backend API - Module Type Definitions
 * Types for Chat, Inventory, HR, Course, Task modules
 */

// ============================================
// CHAT MANAGER MODULE
// ============================================

export interface ChatRoomDto {
  id: string;
  name: string;
  isPrivate: boolean;
  createdBy: string;
  createdAt: Date;
  participants?: ChatParticipantDto[];
  messages?: ChatMessageDto[];
}

export interface ChatRoomCreateDto {
  name: string;
  isPrivate: boolean;
  createdBy: string;
}

export interface ChatRoomUpdateDto {
  id: string;
  name?: string;
  isPrivate?: boolean;
}

export interface ChatMessageDto {
  id: string;
  chatRoomId: string;
  senderId: string;
  content: string;
  sentAt: Date;
}

export interface ChatMessageCreateDto {
  chatRoomId: string;
  senderId: string;
  content: string;
}

export interface ChatParticipantDto {
  id: string;
  chatRoomId: string;
  userId: string;
  joinedAt: Date;
}

export interface ChatParticipantCreateDto {
  chatRoomId: string;
  userId: string;
}

// ============================================
// INVENTORY MANAGER MODULE
// ============================================

export interface ItemDto {
  id: string;
  name: string;
  description?: string;
  categoryId: string;
  quantity: number;
  unitPrice: number;
  createdAt: Date;
  updatedAt?: Date;
}

export interface ItemCreateDto {
  name: string;
  description?: string;
  categoryId: string;
  quantity: number;
  unitPrice: number;
}

export interface ItemUpdateDto {
  id: string;
  name?: string;
  description?: string;
  categoryId?: string;
  quantity?: number;
  unitPrice?: number;
}

export interface CategoryDto {
  id: string;
  name: string;
  description?: string;
}

export interface CategoryCreateDto {
  name: string;
  description?: string;
}

export interface CategoryUpdateDto {
  id: string;
  name?: string;
  description?: string;
}

export interface StockTransactionDto {
  id: string;
  itemId: string;
  transactionType: 'IN' | 'OUT';
  quantity: number;
  performedBy: string;
  timestamp: Date;
  notes?: string;
}

export interface StockTransactionCreateDto {
  itemId: string;
  transactionType: 'IN' | 'OUT';
  quantity: number;
  performedBy: string;
  notes?: string;
}

export interface StockTransactionUpdateDto {
  id: string;
  transactionType?: 'IN' | 'OUT';
  quantity?: number;
  notes?: string;
}

// ============================================
// HR MANAGER MODULE
// ============================================

export interface EmployeeDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  departmentId: string;
  positionId: string;
  hireDate: Date;
  salary: number;
}

export interface EmployeeCreateDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  departmentId: string;
  positionId: string;
  hireDate: Date;
  salary: number;
}

export interface EmployeeUpdateDto {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  departmentId?: string;
  positionId?: string;
  hireDate?: Date;
  salary?: number;
}

export interface DepartmentDto {
  id: string;
  name: string;
  description?: string;
}

export interface DepartmentCreateDto {
  name: string;
  description?: string;
}

export interface DepartmentUpdateDto {
  id: string;
  name?: string;
  description?: string;
}

export interface PositionDto {
  id: string;
  title: string;
  description?: string;
}

export interface PositionCreateDto {
  title: string;
  description?: string;
}

export interface PositionUpdateDto {
  id: string;
  title?: string;
  description?: string;
}

// ============================================
// COURSE MANAGER MODULE
// ============================================

export interface CourseDto {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  startDate: Date;
  endDate: Date;
  capacity: number;
  enrolledCount: number;
}

export interface CourseCreateDto {
  title: string;
  description: string;
  instructorId: string;
  startDate: Date;
  endDate: Date;
  capacity: number;
}

export interface CourseUpdateDto {
  id: string;
  title?: string;
  description?: string;
  instructorId?: string;
  startDate?: Date;
  endDate?: Date;
  capacity?: number;
}

export interface LessonDto {
  id: string;
  courseId: string;
  title: string;
  content: string;
  order: number;
  createdAt: Date;
}

export interface LessonCreateDto {
  courseId: string;
  title: string;
  content: string;
  order: number;
}

export interface LessonUpdateDto {
  id: string;
  title?: string;
  content?: string;
  order?: number;
}

export interface EnrollmentDto {
  id: string;
  courseId: string;
  studentId: string;
  enrolledAt: Date;
  status: string; // "Active" | "Completed" | "Dropped"
}

export interface EnrollmentCreateDto {
  courseId: string;
  studentId: string;
}

export interface EnrollmentUpdateDto {
  id: string;
  status?: string;
}

// ============================================
// TASK MANAGER MODULE
// ============================================

export interface TaskDto {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  status: 'Pending' | 'InProgress' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  dueDate: Date;
  createdAt: Date;
  updatedAt?: Date;
}

export interface TaskCreateDto {
  title: string;
  description: string;
  assignedTo: string;
  status: 'Pending' | 'InProgress' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  dueDate: Date;
}

export interface TaskUpdateDto {
  id: string;
  title?: string;
  description?: string;
  assignedTo?: string;
  status?: 'Pending' | 'InProgress' | 'Completed';
  priority?: 'Low' | 'Medium' | 'High';
  dueDate?: Date;
}

// ============================================
// MODULE MANAGER
// ============================================

export interface ModuleDto {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
}

export interface ModuleCreateDto {
  name: string;
  description: string;
  isActive: boolean;
}

export interface ModuleUpdateDto {
  id: string;
  name?: string;
  description?: string;
  isActive?: boolean;
}
