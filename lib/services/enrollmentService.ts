/**
 * Velithra API - Enrollment Service
 * Backend API Endpoint: /api/Enrollment
 */

import apiClient from '../api/client';
import type { GenericResponse } from '../types';

export interface EnrollmentDto {
  id: string;
  employeeId: string;
  courseId: string;
  enrolledAt: string;
  completedAt?: string;
  isCompleted: boolean;
}

export const enrollmentService = {
  /**
   * POST /api/Enrollment/enroll - Enroll employee to course
   */
  async enroll(employeeId: string, courseId: string): Promise<string> {
    try {
      const response = await apiClient.post<GenericResponse<string>>(
        '/enrollment/enroll',
        null,
        { params: { employeeId, courseId } }
      );
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to enroll employee');
    }
  },

  /**
   * POST /api/Enrollment/complete/{enrollmentId} - Complete course
   */
  async complete(enrollmentId: string): Promise<string> {
    try {
      const response = await apiClient.post<GenericResponse<string>>(`/enrollment/complete/${enrollmentId}`);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to complete course');
    }
  },

  /**
   * GET /api/Enrollment/course/{courseId} - Get enrollments by course
   */
  async getByCourse(courseId: string): Promise<EnrollmentDto[]> {
    try {
      const response = await apiClient.get<GenericResponse<EnrollmentDto[]>>(`/enrollment/course/${courseId}`);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data || [];
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch course enrollments');
    }
  },

  /**
   * GET /api/Enrollment/employee/{employeeId} - Get enrollments by employee
   */
  async getByEmployee(employeeId: string): Promise<EnrollmentDto[]> {
    try {
      const response = await apiClient.get<GenericResponse<EnrollmentDto[]>>(`/enrollment/employee/${employeeId}`);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data || [];
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch employee enrollments');
    }
  }
};
