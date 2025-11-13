/**
 * Velithra API - HR Service
 * Handles employee management operations
 */

import apiClient from '@/lib/api/client';
import type { GenericResponse } from '@/lib/types';
import type { 
  EmployeeDto, 
  EmployeeCreateDto, 
  EmployeeUpdateDto,
  DepartmentDto,
  PositionDto 
} from '@/lib/types/module.types';

export class HRService {
  /**
   * Get all employees
   */
  async getAllEmployees(): Promise<EmployeeDto[]> {
    try {
      const response = await apiClient.get<GenericResponse<EmployeeDto[]>>('/Employee');
      
      const genericResponse = response.data;

      if (!genericResponse.success) {
        const errorMessage = genericResponse.errors?.join(', ') || genericResponse.message;
        throw new Error(errorMessage);
      }

      return genericResponse.data || [];
    } catch (error: any) {
      if (error.response?.data) {
        const errorResponse = error.response.data as GenericResponse<any>;
        const errorMessage = errorResponse.errors?.join(', ') || errorResponse.message || 'Failed to fetch employees';
        throw new Error(errorMessage);
      }
      throw error;
    }
  }

  /**
   * Get employee by ID
   */
  async getEmployeeById(id: string): Promise<EmployeeDto> {
    try {
      const response = await apiClient.get<GenericResponse<EmployeeDto>>(`/Employee/${id}`);
      
      const genericResponse = response.data;

      if (!genericResponse.success) {
        const errorMessage = genericResponse.errors?.join(', ') || genericResponse.message;
        throw new Error(errorMessage);
      }

      return genericResponse.data!;
    } catch (error: any) {
      if (error.response?.data) {
        const errorResponse = error.response.data as GenericResponse<any>;
        const errorMessage = errorResponse.errors?.join(', ') || errorResponse.message || 'Failed to fetch employee';
        throw new Error(errorMessage);
      }
      throw error;
    }
  }

  /**
   * Create new employee
   */
  async createEmployee(employee: EmployeeCreateDto): Promise<EmployeeDto> {
    try {
      const response = await apiClient.post<GenericResponse<EmployeeDto>>('/Employee', employee);
      
      const genericResponse = response.data;

      if (!genericResponse.success) {
        const errorMessage = genericResponse.errors?.join(', ') || genericResponse.message;
        throw new Error(errorMessage);
      }

      return genericResponse.data!;
    } catch (error: any) {
      if (error.response?.data) {
        const errorResponse = error.response.data as GenericResponse<any>;
        const errorMessage = errorResponse.errors?.join(', ') || errorResponse.message || 'Failed to create employee';
        throw new Error(errorMessage);
      }
      throw error;
    }
  }

  /**
   * Update employee
   */
  async updateEmployee(id: string, employee: EmployeeUpdateDto): Promise<EmployeeDto> {
    try {
      const response = await apiClient.put<GenericResponse<EmployeeDto>>(`/Employee/${id}`, employee);
      
      const genericResponse = response.data;

      if (!genericResponse.success) {
        const errorMessage = genericResponse.errors?.join(', ') || genericResponse.message;
        throw new Error(errorMessage);
      }

      return genericResponse.data!;
    } catch (error: any) {
      if (error.response?.data) {
        const errorResponse = error.response.data as GenericResponse<any>;
        const errorMessage = errorResponse.errors?.join(', ') || errorResponse.message || 'Failed to update employee';
        throw new Error(errorMessage);
      }
      throw error;
    }
  }

  /**
   * Delete employee
   */
  async deleteEmployee(id: string): Promise<void> {
    try {
      const response = await apiClient.delete<GenericResponse<void>>(`/Employee/${id}`);
      
      const genericResponse = response.data;

      if (!genericResponse.success) {
        const errorMessage = genericResponse.errors?.join(', ') || genericResponse.message;
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      if (error.response?.data) {
        const errorResponse = error.response.data as GenericResponse<any>;
        const errorMessage = errorResponse.errors?.join(', ') || errorResponse.message || 'Failed to delete employee';
        throw new Error(errorMessage);
      }
      throw error;
    }
  }

  /**
   * Get all departments
   */
  async getAllDepartments(): Promise<DepartmentDto[]> {
    try {
      const response = await apiClient.get<GenericResponse<DepartmentDto[]>>('/Department');
      
      const genericResponse = response.data;

      if (!genericResponse.success) {
        const errorMessage = genericResponse.errors?.join(', ') || genericResponse.message;
        throw new Error(errorMessage);
      }

      return genericResponse.data || [];
    } catch (error: any) {
      if (error.response?.data) {
        const errorResponse = error.response.data as GenericResponse<any>;
        const errorMessage = errorResponse.errors?.join(', ') || errorResponse.message || 'Failed to fetch departments';
        throw new Error(errorMessage);
      }
      throw error;
    }
  }

  /**
   * Get all positions
   */
  async getAllPositions(): Promise<PositionDto[]> {
    try {
      const response = await apiClient.get<GenericResponse<PositionDto[]>>('/Position');
      
      const genericResponse = response.data;

      if (!genericResponse.success) {
        const errorMessage = genericResponse.errors?.join(', ') || genericResponse.message;
        throw new Error(errorMessage);
      }

      return genericResponse.data || [];
    } catch (error: any) {
      if (error.response?.data) {
        const errorResponse = error.response.data as GenericResponse<any>;
        const errorMessage = errorResponse.errors?.join(', ') || errorResponse.message || 'Failed to fetch positions';
        throw new Error(errorMessage);
      }
      throw error;
    }
  }
}

// Export singleton instance
export const hrService = new HRService();
export default hrService;
