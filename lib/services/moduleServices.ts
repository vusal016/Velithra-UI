/**
 * Velithra API - Module Services
 * Service instances for all module entities (Chat, Inventory, HR, Course, Task)
 */

import { CrudService } from './crudService';
import apiClient from '@/lib/api/client';
import type { GenericResponse } from '@/lib/types';
import type {
  // Chat Module
  ChatRoomDto,
  ChatRoomCreateDto,
  ChatRoomUpdateDto,
  ChatMessageDto,
  ChatMessageCreateDto,
  ChatParticipantDto,
  ChatParticipantCreateDto,
  // Inventory Module
  ItemDto,
  ItemCreateDto,
  ItemUpdateDto,
  CategoryDto,
  CategoryCreateDto,
  CategoryUpdateDto,
  StockTransactionDto,
  StockTransactionCreateDto,
  StockTransactionUpdateDto,
  // HR Module
  EmployeeDto,
  EmployeeCreateDto,
  EmployeeUpdateDto,
  DepartmentDto,
  DepartmentCreateDto,
  DepartmentUpdateDto,
  PositionDto,
  PositionCreateDto,
  PositionUpdateDto,
  // Course Module
  CourseDto,
  CourseCreateDto,
  CourseUpdateDto,
  LessonDto,
  LessonCreateDto,
  LessonUpdateDto,
  EnrollmentDto,
  EnrollmentCreateDto,
  EnrollmentUpdateDto,
  // Task Module
  TaskDto,
  TaskCreateDto,
  TaskUpdateDto,
  // Module Manager
  ModuleDto,
  ModuleCreateDto,
  ModuleUpdateDto,
} from '@/lib/types';

// ============================================
// CHAT MANAGER MODULE
// ============================================

export const chatRoomService = new CrudService<
  ChatRoomDto,
  ChatRoomCreateDto,
  ChatRoomUpdateDto
>('chat');

export const chatServiceExtended = {
  ...chatRoomService,

  /**
   * Send message to chat room
   */
  async sendMessage(
    roomId: string,
    data: ChatMessageCreateDto
  ): Promise<void> {
    await apiClient.post(`/chat/${roomId}/message`, data);
  },

  /**
   * Get messages from chat room
   */
  async getRoomMessages(roomId: string): Promise<ChatMessageDto[]> {
    const response = await apiClient.get<GenericResponse<ChatMessageDto[]>>(
      `/chat/${roomId}/messages`
    );
    return response.data.data || [];
  },
};

// ============================================
// INVENTORY MANAGER MODULE
// ============================================

export const itemService = new CrudService<
  ItemDto,
  ItemCreateDto,
  ItemUpdateDto
>('item');

export const categoryService = new CrudService<
  CategoryDto,
  CategoryCreateDto,
  CategoryUpdateDto
>('category');

export const stockTransactionService = new CrudService<
  StockTransactionDto,
  StockTransactionCreateDto,
  StockTransactionUpdateDto
>('stocktransaction');

// ============================================
// HR MANAGER MODULE
// ============================================

export const employeeService = new CrudService<
  EmployeeDto,
  EmployeeCreateDto,
  EmployeeUpdateDto
>('employee');

export const departmentService = new CrudService<
  DepartmentDto,
  DepartmentCreateDto,
  DepartmentUpdateDto
>('department');

export const positionService = new CrudService<
  PositionDto,
  PositionCreateDto,
  PositionUpdateDto
>('position');

// ============================================
// COURSE MANAGER MODULE
// ============================================

export const courseService = new CrudService<
  CourseDto,
  CourseCreateDto,
  CourseUpdateDto
>('course');

export const lessonService = new CrudService<
  LessonDto,
  LessonCreateDto,
  LessonUpdateDto
>('lesson');

export const enrollmentService = new CrudService<
  EnrollmentDto,
  EnrollmentCreateDto,
  EnrollmentUpdateDto
>('enrollment');

// ============================================
// TASK MANAGER MODULE
// ============================================

export const taskService = new CrudService<
  TaskDto,
  TaskCreateDto,
  TaskUpdateDto
>('task');

// ============================================
// MODULE MANAGER
// ============================================

export const moduleService = new CrudService<
  ModuleDto,
  ModuleCreateDto,
  ModuleUpdateDto
>('module');
