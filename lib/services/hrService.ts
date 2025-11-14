/**
 * Velithra API - HR Management Services
 * Services for Employees, Departments, and Positions
 */

import apiClient from '@/lib/api/client';
import type {
  GenericResponse,
  PagedResult,
  EmployeeDto,
  EmployeeCreateDto,
  EmployeeUpdateDto,
  DepartmentDto,
  DepartmentCreateDto,
  DepartmentUpdateDto,
  PositionDto,
  PositionCreateDto,
  PositionUpdateDto,
} from '@/lib/types';

// ============================================
// EMPLOYEE SERVICE
// ============================================

export class EmployeeService {
  private endpoint = '/employee';

  /**
   * GET /api/employee - Get all employees
   */
  async getAll(): Promise<EmployeeDto[]> {
    try {
      const response = await apiClient.get<EmployeeDto[]>(this.endpoint);
      return response.data || [];
    } catch (error: any) {
      throw this.handleError(error, 'Failed to fetch employees');
    }
  }

  /**
   * GET /api/employee/paged - Get employees with pagination
   */
  async getPaged(pageNumber: number = 1, pageSize: number = 10, search: string = '', status: string = ''): Promise<PagedResult<EmployeeDto>> {
    try {
      const response = await apiClient.get<PagedResult<EmployeeDto>>(
        `${this.endpoint}/paged`,
        {
          params: { pageNumber, pageSize, search, status }
        }
      );
      console.log('Employee Service - Raw Response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Employee Service - Error:', error);
      throw this.handleError(error, 'Failed to fetch paginated employees');
    }
  }

  /**
   * GET /api/employee/{id} - Get employee by ID
   */
  async getById(id: string): Promise<EmployeeDto> {
    try {
      const response = await apiClient.get<EmployeeDto>(`${this.endpoint}/${id}`);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to fetch employee');
    }
  }

  /**
   * POST /api/employee - Create employee (Admin/Manager only)
   */
  async create(data: EmployeeCreateDto): Promise<string> {
    try {
      const response = await apiClient.post<string>(this.endpoint, data);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to create employee');
    }
  }

  /**
   * PUT /api/employee - Update employee
   */
  async update(data: EmployeeUpdateDto): Promise<string> {
    try {
      const response = await apiClient.put<string>(this.endpoint, data);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to update employee');
    }
  }

  /**
   * DELETE /api/employee/{id} - Delete employee
   */
  async delete(id: string): Promise<boolean> {
    try {
      const response = await apiClient.delete<boolean>(`${this.endpoint}/${id}`);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to delete employee');
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
// DEPARTMENT SERVICE
// ============================================

export class DepartmentService {
  private endpoint = '/department';

  /**
   * GET /api/department - Get all departments
   */
  async getAll(): Promise<DepartmentDto[]> {
    try {
      const response = await apiClient.get<DepartmentDto[]>(this.endpoint);
      return response.data || [];
    } catch (error: any) {
      throw this.handleError(error, 'Failed to fetch departments');
    }
  }

  /**
   * GET /api/department/paged - Get departments with pagination
   */
  async getPaged(pageNumber: number = 1, pageSize: number = 10): Promise<PagedResult<DepartmentDto>> {
    try {
      const response = await apiClient.get<PagedResult<DepartmentDto>>(
        `${this.endpoint}/paged`,
        {
          params: { pageNumber, pageSize }
        }
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to fetch paginated departments');
    }
  }

  /**
   * GET /api/department/{id} - Get department by ID
   */
  async getById(id: string): Promise<DepartmentDto> {
    try {
      const response = await apiClient.get<DepartmentDto>(`${this.endpoint}/${id}`);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to fetch department');
    }
  }

  /**
   * POST /api/department - Create department
   */
  async create(data: DepartmentCreateDto): Promise<string> {
    try {
      const response = await apiClient.post<string>(this.endpoint, data);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to create department');
    }
  }

  /**
   * PUT /api/department - Update department
   */
  async update(data: DepartmentUpdateDto): Promise<string> {
    try {
      const response = await apiClient.put<string>(this.endpoint, data);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to update department');
    }
  }

  /**
   * DELETE /api/department/{id} - Delete department
   */
  async delete(id: string): Promise<boolean> {
    try {
      const response = await apiClient.delete<boolean>(`${this.endpoint}/${id}`);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to delete department');
    }
  }

  /**
   * GET /api/department/{departmentId}/positions - Get positions by department
   */
  async getPositionsByDepartment(departmentId: string): Promise<PositionDto[]> {
    try {
      const response = await apiClient.get<PositionDto[]>(
        `${this.endpoint}/${departmentId}/positions`
      );
      return response.data || [];
    } catch (error: any) {
      throw this.handleError(error, 'Failed to fetch department positions');
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
// POSITION SERVICE
// ============================================

export class PositionService {
  private endpoint = '/position';

  /**
   * GET /api/position - Get all positions
   */
  async getAll(): Promise<PositionDto[]> {
    try {
      const response = await apiClient.get<PositionDto[]>(this.endpoint);
      return response.data || [];
    } catch (error: any) {
      throw this.handleError(error, 'Failed to fetch positions');
    }
  }

  /**
   * GET /api/position/paged - Get positions with pagination
   */
  async getPaged(pageNumber: number = 1, pageSize: number = 10): Promise<PagedResult<PositionDto>> {
    try {
      const response = await apiClient.get<PagedResult<PositionDto>>(
        `${this.endpoint}/paged`,
        {
          params: { pageNumber, pageSize }
        }
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to fetch paginated positions');
    }
  }

  /**
   * GET /api/position/{id} - Get position by ID
   */
  async getById(id: string): Promise<PositionDto> {
    try {
      const response = await apiClient.get<PositionDto>(`${this.endpoint}/${id}`);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to fetch position');
    }
  }

  /**
   * POST /api/position - Create position
   */
  async create(data: PositionCreateDto): Promise<string> {
    try {
      const response = await apiClient.post<string>(this.endpoint, data);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to create position');
    }
  }

  /**
   * PUT /api/position - Update position
   */
  async update(data: PositionUpdateDto): Promise<string> {
    try {
      const response = await apiClient.put<string>(this.endpoint, data);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to update position');
    }
  }

  /**
   * DELETE /api/position/{id} - Delete position
   */
  async delete(id: string): Promise<boolean> {
    try {
      const response = await apiClient.delete<boolean>(`${this.endpoint}/${id}`);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to delete position');
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

export const employeeService = new EmployeeService();
export const departmentService = new DepartmentService();
export const positionService = new PositionService();
