/**
 * Velithra API - Task Service
 * Backend API Endpoint: /api/Task
 */

import apiClient from '../api/client';
import type { GenericResponse, PagedResult } from '../types';

export interface TaskDto {
  id: string;
  title: string;
  description: string;
  state: TaskState;
  priority: TaskPriority;
  dueDate: string;
  assignedUserId?: string;
  assignedUserName?: string;
  createdAt: string;
  updatedAt?: string;
}

export type TaskState = 'ToDo' | 'InProgress' | 'Completed' | 'Cancelled';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface TaskCreateDto {
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: string;
}

export interface TaskUpdateDto {
  id: string;
  title: string;
  description: string;
  state: TaskState;
  priority: TaskPriority;
  dueDate: string;
}

export interface TaskAssignDto {
  taskId: string;
  userId: string;
}

export const taskService = {
  /**
   * GET /api/Task - Get all tasks
   */
  async getAll(): Promise<TaskDto[]> {
    try {
      const response = await apiClient.get<GenericResponse<TaskDto[]>>('/task');
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data || [];
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch tasks');
    }
  },

  /**
   * GET /api/Task/paged - Get tasks with pagination
   */
  async getPaged(pageNumber: number = 1, pageSize: number = 10): Promise<PagedResult<TaskDto>> {
    try {
      const response = await apiClient.get<GenericResponse<PagedResult<TaskDto>>>(
        '/task/paged',
        { params: { pageNumber, pageSize } }
      );
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch paginated tasks');
    }
  },

  /**
   * GET /api/Task/{id} - Get task by ID
   */
  async getById(id: string): Promise<TaskDto> {
    try {
      const response = await apiClient.get<GenericResponse<TaskDto>>(`/task/${id}`);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch task');
    }
  },

  /**
   * POST /api/Task/create - Create task
   */
  async create(data: TaskCreateDto): Promise<string> {
    try {
      const response = await apiClient.post<GenericResponse<string>>('/task/create', data);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to create task');
    }
  },

  /**
   * POST /api/Task/assign - Assign task to user
   */
  async assign(data: TaskAssignDto): Promise<string> {
    try {
      const response = await apiClient.post<GenericResponse<string>>('/task/assign', data);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to assign task');
    }
  },

  /**
   * PUT /api/Task - Update task
   */
  async update(data: TaskUpdateDto): Promise<string> {
    try {
      const response = await apiClient.put<GenericResponse<string>>('/task', data);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to update task');
    }
  },

  /**
   * DELETE /api/Task/{id} - Delete task
   */
  async delete(id: string): Promise<boolean> {
    try {
      const response = await apiClient.delete<GenericResponse<boolean>>(`/task/${id}`);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to delete task');
    }
  }
};
