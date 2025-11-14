/**
 * Velithra API - Module Services
 * Services for Task, Course, Chat, and Inventory modules
 */

import apiClient from '@/lib/api/client';
import type {
  GenericResponse,
  PagedResult,
  TaskDto,
  TaskCreateDto,
  TaskAssignDto,
  TaskUpdateDto,
  CourseDto,
  CourseCreateDto,
  CourseUpdateDto,
  LessonDto,
  LessonCreateDto,
  LessonUpdateDto,
  EnrollmentDto,
  ChatRoomDto,
  ChatRoomCreateDto,
  ChatRoomUpdateDto,
  ChatMessageDto,
  ChatMessageCreateDto,
  CategoryDto,
  CategoryCreateDto,
  CategoryUpdateDto,
  ItemDto,
  ItemCreateDto,
  ItemUpdateDto,
  StockTransactionDto,
  StockTransactionCreateDto,
} from '@/lib/types';

// ============================================
// TASK SERVICE
// ============================================

export class TaskService {
  private endpoint = '/task';

  /**
   * GET /api/task - Get all tasks
   */
  async getAll(): Promise<TaskDto[]> {
    try {
      const response = await apiClient.get<GenericResponse<TaskDto[]>>(this.endpoint);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data || [];
    } catch (error: any) {
      throw this.handleError(error, 'Failed to fetch tasks');
    }
  }

  /**
   * GET /api/task/paged - Get tasks with pagination
   */
  async getPaged(pageNumber: number = 1, pageSize: number = 10): Promise<PagedResult<TaskDto>> {
    try {
      const response = await apiClient.get<GenericResponse<PagedResult<TaskDto>>>(
        `${this.endpoint}/paged`,
        {
          params: { pageNumber, pageSize }
        }
      );
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to fetch paginated tasks');
    }
  }

  /**
   * GET /api/task/{id} - Get task by ID
   */
  async getById(id: string): Promise<TaskDto> {
    try {
      const response = await apiClient.get<GenericResponse<TaskDto>>(`${this.endpoint}/${id}`);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to fetch task');
    }
  }

  /**
   * POST /api/task/create - Create task
   */
  async create(data: TaskCreateDto): Promise<string> {
    try {
      const response = await apiClient.post<GenericResponse<string>>(`${this.endpoint}/create`, data);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to create task');
    }
  }

  /**
   * POST /api/task/assign - Assign task to user
   */
  async assign(data: TaskAssignDto): Promise<string> {
    try {
      const response = await apiClient.post<GenericResponse<string>>(`${this.endpoint}/assign`, data);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to assign task');
    }
  }

  /**
   * PUT /api/task - Update task
   */
  async update(data: TaskUpdateDto): Promise<string> {
    try {
      const response = await apiClient.put<GenericResponse<string>>(this.endpoint, data);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to update task');
    }
  }

  /**
   * DELETE /api/task/{id} - Delete task
   */
  async delete(id: string): Promise<boolean> {
    try {
      const response = await apiClient.delete<GenericResponse<boolean>>(`${this.endpoint}/${id}`);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to delete task');
    }
  }

  private handleError(error: any, defaultMessage: string): Error {
    if (error.response?.data) {
      const errorResponse = error.response.data as GenericResponse<any>;
      const errorMessage = errorResponse.errors?.join(', ') || errorResponse.message || defaultMessage;
      return new Error(errorMessage);
    }
    return error;
  }
}

// ============================================
// COURSE SERVICE
// ============================================

export class CourseService {
  private endpoint = '/course';

  /**
   * GET /api/course - Get all courses
   */
  async getAll(): Promise<CourseDto[]> {
    try {
      const response = await apiClient.get<GenericResponse<CourseDto[]>>(this.endpoint);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data || [];
    } catch (error: any) {
      throw this.handleError(error, 'Failed to fetch courses');
    }
  }

  /**
   * GET /api/course/paged - Get courses with pagination
   */
  async getPaged(pageNumber: number = 1, pageSize: number = 10): Promise<PagedResult<CourseDto>> {
    try {
      const response = await apiClient.get<GenericResponse<PagedResult<CourseDto>>>(
        `${this.endpoint}/paged`,
        {
          params: { pageNumber, pageSize }
        }
      );
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to fetch paginated courses');
    }
  }

  /**
   * GET /api/course/{id} - Get course by ID
   */
  async getById(id: string): Promise<CourseDto> {
    try {
      const response = await apiClient.get<GenericResponse<CourseDto>>(`${this.endpoint}/${id}`);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to fetch course');
    }
  }

  /**
   * POST /api/course - Create course
   */
  async create(data: CourseCreateDto): Promise<string> {
    try {
      const response = await apiClient.post<GenericResponse<string>>(this.endpoint, data);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to create course');
    }
  }

  /**
   * PUT /api/course/{id} - Update course
   */
  async update(id: string, data: CourseUpdateDto): Promise<string> {
    try {
      const response = await apiClient.put<GenericResponse<string>>(`${this.endpoint}/${id}`, data);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to update course');
    }
  }

  /**
   * DELETE /api/course/{id} - Delete course
   */
  async delete(id: string): Promise<boolean> {
    try {
      const response = await apiClient.delete<GenericResponse<boolean>>(`${this.endpoint}/${id}`);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to delete course');
    }
  }

  private handleError(error: any, defaultMessage: string): Error {
    if (error.response?.data) {
      const errorResponse = error.response.data as GenericResponse<any>;
      const errorMessage = errorResponse.errors?.join(', ') || errorResponse.message || defaultMessage;
      return new Error(errorMessage);
    }
    return error;
  }
}

// ============================================
// LESSON SERVICE
// ============================================

export class LessonService {
  private endpoint = '/lesson';

  /**
   * GET /api/lesson/course/{courseId} - Get lessons by course
   */
  async getByCourse(courseId: string): Promise<LessonDto[]> {
    try {
      const response = await apiClient.get<GenericResponse<LessonDto[]>>(`${this.endpoint}/course/${courseId}`);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data || [];
    } catch (error: any) {
      throw this.handleError(error, 'Failed to fetch lessons');
    }
  }

  /**
   * GET /api/lesson/{id} - Get lesson by ID
   */
  async getById(id: string): Promise<LessonDto> {
    try {
      const response = await apiClient.get<GenericResponse<LessonDto>>(`${this.endpoint}/${id}`);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to fetch lesson');
    }
  }

  /**
   * POST /api/lesson - Create lesson
   */
  async create(data: LessonCreateDto): Promise<string> {
    try {
      const response = await apiClient.post<GenericResponse<string>>(this.endpoint, data);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to create lesson');
    }
  }

  /**
   * PUT /api/lesson/{id} - Update lesson
   */
  async update(id: string, data: LessonUpdateDto): Promise<string> {
    try {
      const response = await apiClient.put<GenericResponse<string>>(`${this.endpoint}/${id}`, data);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to update lesson');
    }
  }

  /**
   * DELETE /api/lesson/{id} - Delete lesson
   */
  async delete(id: string): Promise<boolean> {
    try {
      const response = await apiClient.delete<GenericResponse<boolean>>(`${this.endpoint}/${id}`);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to delete lesson');
    }
  }

  private handleError(error: any, defaultMessage: string): Error {
    if (error.response?.data) {
      const errorResponse = error.response.data as GenericResponse<any>;
      const errorMessage = errorResponse.errors?.join(', ') || errorResponse.message || defaultMessage;
      return new Error(errorMessage);
    }
    return error;
  }
}

// ============================================
// ENROLLMENT SERVICE
// ============================================

export class EnrollmentService {
  private endpoint = '/enrollment';

  /**
   * POST /api/enrollment/enroll - Enroll in course
   */
  async enroll(employeeId: string, courseId: string): Promise<string> {
    try {
      const response = await apiClient.post<GenericResponse<string>>(
        `${this.endpoint}/enroll`,
        null,
        {
          params: { employeeId, courseId }
        }
      );
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to enroll in course');
    }
  }

  /**
   * POST /api/enrollment/complete/{id} - Mark enrollment as complete
   */
  async complete(id: string): Promise<string> {
    try {
      const response = await apiClient.post<GenericResponse<string>>(`${this.endpoint}/complete/${id}`);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to complete enrollment');
    }
  }

  /**
   * GET /api/enrollment/course/{courseId} - Get enrollments by course
   */
  async getByCourse(courseId: string): Promise<EnrollmentDto[]> {
    try {
      const response = await apiClient.get<GenericResponse<EnrollmentDto[]>>(
        `${this.endpoint}/course/${courseId}`
      );
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data || [];
    } catch (error: any) {
      throw this.handleError(error, 'Failed to fetch course enrollments');
    }
  }

  /**
   * GET /api/enrollment/employee/{employeeId} - Get enrollments by employee
   */
  async getByEmployee(employeeId: string): Promise<EnrollmentDto[]> {
    try {
      const response = await apiClient.get<GenericResponse<EnrollmentDto[]>>(
        `${this.endpoint}/employee/${employeeId}`
      );
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data || [];
    } catch (error: any) {
      throw this.handleError(error, 'Failed to fetch employee enrollments');
    }
  }

  private handleError(error: any, defaultMessage: string): Error {
    if (error.response?.data) {
      const errorResponse = error.response.data as GenericResponse<any>;
      const errorMessage = errorResponse.errors?.join(', ') || errorResponse.message || defaultMessage;
      return new Error(errorMessage);
    }
    return error;
  }
}

// ============================================
// CHAT SERVICE
// ============================================

export class ChatService {
  private endpoint = '/chat';

  /**
   * POST /api/chat/rooms - Create chat room
   */
  async createRoom(data: ChatRoomCreateDto): Promise<string> {
    try {
      const response = await apiClient.post<GenericResponse<string>>(`${this.endpoint}/rooms`, data);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to create chat room');
    }
  }

  /**
   * GET /api/chat/rooms/my-rooms - Get my chat rooms
   */
  async getMyRooms(): Promise<ChatRoomDto[]> {
    try {
      const response = await apiClient.get<GenericResponse<ChatRoomDto[]>>(`${this.endpoint}/rooms/my-rooms`);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data || [];
    } catch (error: any) {
      throw this.handleError(error, 'Failed to fetch chat rooms');
    }
  }

  /**
   * POST /api/chat/rooms/{roomId}/messages - Send message
   */
  async sendMessage(roomId: string, data: ChatMessageCreateDto): Promise<string> {
    try {
      const response = await apiClient.post<GenericResponse<string>>(
        `${this.endpoint}/rooms/${roomId}/messages`,
        data
      );
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to send message');
    }
  }

  /**
   * GET /api/chat/rooms/{roomId}/messages - Get messages
   */
  async getMessages(roomId: string): Promise<ChatMessageDto[]> {
    try {
      const response = await apiClient.get<GenericResponse<ChatMessageDto[]>>(
        `${this.endpoint}/rooms/${roomId}/messages`
      );
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data || [];
    } catch (error: any) {
      throw this.handleError(error, 'Failed to fetch messages');
    }
  }

  private handleError(error: any, defaultMessage: string): Error {
    if (error.response?.data) {
      const errorResponse = error.response.data as GenericResponse<any>;
      const errorMessage = errorResponse.errors?.join(', ') || errorResponse.message || defaultMessage;
      return new Error(errorMessage);
    }
    return error;
  }
}

// ============================================
// INVENTORY SERVICE
// ============================================

export class InventoryService {
  /**
   * GET /api/category - Get all categories
   */
  async getAllCategories(): Promise<CategoryDto[]> {
    try {
      const response = await apiClient.get<GenericResponse<CategoryDto[]>>('/category');
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data || [];
    } catch (error: any) {
      throw this.handleError(error, 'Failed to fetch categories');
    }
  }

  /**
   * GET /api/item - Get all items
   */
  async getAllItems(): Promise<ItemDto[]> {
    try {
      const response = await apiClient.get<GenericResponse<ItemDto[]>>('/item');
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data || [];
    } catch (error: any) {
      throw this.handleError(error, 'Failed to fetch items');
    }
  }

  /**
   * GET /api/stocktransaction - Get all stock transactions
   */
  async getAllStockTransactions(): Promise<StockTransactionDto[]> {
    try {
      const response = await apiClient.get<GenericResponse<StockTransactionDto[]>>('/stocktransaction');
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data || [];
    } catch (error: any) {
      throw this.handleError(error, 'Failed to fetch stock transactions');
    }
  }

  /**
   * POST /api/category - Create category
   */
  async createCategory(data: CategoryCreateDto): Promise<string> {
    try {
      const response = await apiClient.post<GenericResponse<string>>('/category', data);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to create category');
    }
  }

  /**
   * POST /api/item - Create item
   */
  async createItem(data: ItemCreateDto): Promise<string> {
    try {
      const response = await apiClient.post<GenericResponse<string>>('/item', data);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to create item');
    }
  }

  /**
   * POST /api/stocktransaction - Create stock transaction
   */
  async createStockTransaction(data: StockTransactionCreateDto): Promise<string> {
    try {
      const response = await apiClient.post<GenericResponse<string>>('/stocktransaction', data);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to create stock transaction');
    }
  }

  /**
   * PUT /api/item/{id} - Update item
   * Note: This endpoint may not be implemented in backend yet
   */
  async updateItem(id: string, data: any): Promise<string> {
    try {
      const response = await apiClient.put<GenericResponse<string>>(`/item/${id}`, data);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to update item');
    }
  }

  /**
   * DELETE /api/item/{id} - Delete item
   * Note: This endpoint may not be implemented in backend yet
   */
  async deleteItem(id: string): Promise<boolean> {
    try {
      const response = await apiClient.delete<GenericResponse<boolean>>(`/item/${id}`);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to delete item');
    }
  }

  /**
   * PUT /api/category/{id} - Update category
   * Note: This endpoint may not be implemented in backend yet
   */
  async updateCategory(id: string, data: any): Promise<string> {
    try {
      const response = await apiClient.put<GenericResponse<string>>(`/category/${id}`, data);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to update category');
    }
  }

  /**
   * DELETE /api/category/{id} - Delete category
   * Note: This endpoint may not be implemented in backend yet
   */
  async deleteCategory(id: string): Promise<boolean> {
    try {
      const response = await apiClient.delete<GenericResponse<boolean>>(`/category/${id}`);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to delete category');
    }
  }

  private handleError(error: any, defaultMessage: string): Error {
    if (error.response?.data) {
      const errorResponse = error.response.data as GenericResponse<any>;
      const errorMessage = errorResponse.errors?.join(', ') || errorResponse.message || defaultMessage;
      return new Error(errorMessage);
    }
    return error;
  }
}

// ============================================
// SERVICE INSTANCES
// ============================================

export const taskService = new TaskService();
export const courseService = new CourseService();
export const lessonService = new LessonService();
export const enrollmentService = new EnrollmentService();
export const chatService = new ChatService();
export const inventoryService = new InventoryService();
