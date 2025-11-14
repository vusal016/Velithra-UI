/**
 * Velithra API - Course Service
 * Backend API Endpoint: /api/Course
 */

import apiClient from '../api/client';
import type { GenericResponse, PagedResult } from '../types';

export interface CourseDto {
  id: string;
  title: string;
  description: string;
  durationInHours: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CourseCreateDto {
  title: string;
  description: string;
  durationInHours: number;
}

export interface CourseUpdateDto {
  id: string;
  title: string;
  description: string;
  durationInHours: number;
}

export const courseService = {
  /**
   * GET /api/Course - Get all courses
   */
  async getAll(): Promise<CourseDto[]> {
    try {
      const response = await apiClient.get<GenericResponse<CourseDto[]>>('/course');
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data || [];
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch courses');
    }
  },

  /**
   * GET /api/Course/paged - Get courses with pagination
   */
  async getPaged(pageNumber: number = 1, pageSize: number = 10): Promise<PagedResult<CourseDto>> {
    try {
      const response = await apiClient.get<GenericResponse<PagedResult<CourseDto>>>(
        '/course/paged',
        { params: { pageNumber, pageSize } }
      );
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch courses');
    }
  },

  /**
   * GET /api/Course/{id} - Get course by ID
   */
  async getById(id: string): Promise<CourseDto> {
    try {
      const response = await apiClient.get<GenericResponse<CourseDto>>(`/course/${id}`);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch course');
    }
  },

  /**
   * POST /api/Course - Create course
   */
  async create(data: CourseCreateDto): Promise<string> {
    try {
      const response = await apiClient.post<GenericResponse<string>>('/course', data);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to create course');
    }
  },

  /**
   * PUT /api/Course/{id} - Update course
   */
  async update(id: string, data: CourseUpdateDto): Promise<string> {
    try {
      const response = await apiClient.put<GenericResponse<string>>(`/course/${id}`, data);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to update course');
    }
  },

  /**
   * DELETE /api/Course/{id} - Delete course
   */
  async delete(id: string): Promise<boolean> {
    try {
      const response = await apiClient.delete<GenericResponse<boolean>>(`/course/${id}`);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to delete course');
    }
  }
};
