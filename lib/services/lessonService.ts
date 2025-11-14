/**
 * Velithra API - Lesson Service
 * Backend API Endpoint: /api/Lesson
 */

import apiClient from '../api/client';
import type { GenericResponse, PagedResult } from '../types';

export interface LessonDto {
  id: string;
  title: string;
  content: string;
  courseId: string;
  courseTitle: string;
  createdAt: string;
  updatedAt?: string;
}

export interface LessonCreateDto {
  title: string;
  content: string;
  courseId: string;
}

export interface LessonUpdateDto {
  id: string;
  title: string;
  content: string;
}

export const lessonService = {
  /**
   * GET /api/Lesson/course/{courseId} - Get lessons by course
   */
  async getByCourse(courseId: string): Promise<LessonDto[]> {
    try {
      const response = await apiClient.get<GenericResponse<LessonDto[]>>(`/lesson/course/${courseId}`);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data || [];
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch lessons');
    }
  },

  /**
   * GET /api/Lesson/course/{courseId}/paged - Get paged lessons by course
   */
  async getPagedByCourse(courseId: string, pageNumber: number = 1, pageSize: number = 10): Promise<PagedResult<LessonDto>> {
    try {
      const response = await apiClient.get<GenericResponse<PagedResult<LessonDto>>>(
        `/lesson/course/${courseId}/paged`,
        { params: { pageNumber, pageSize } }
      );
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch lessons');
    }
  },

  /**
   * GET /api/Lesson/{id} - Get lesson by ID
   */
  async getById(id: string): Promise<LessonDto> {
    try {
      const response = await apiClient.get<GenericResponse<LessonDto>>(`/lesson/${id}`);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch lesson');
    }
  },

  /**
   * POST /api/Lesson - Create lesson
   */
  async create(data: LessonCreateDto): Promise<string> {
    try {
      const response = await apiClient.post<GenericResponse<string>>('/lesson', data);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to create lesson');
    }
  },

  /**
   * PUT /api/Lesson/{id} - Update lesson
   */
  async update(id: string, data: LessonUpdateDto): Promise<string> {
    try {
      const response = await apiClient.put<GenericResponse<string>>(`/lesson/${id}`, data);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to update lesson');
    }
  },

  /**
   * DELETE /api/Lesson/{id} - Delete lesson
   */
  async delete(id: string): Promise<boolean> {
    try {
      const response = await apiClient.delete<GenericResponse<boolean>>(`/lesson/${id}`);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to delete lesson');
    }
  }
};
