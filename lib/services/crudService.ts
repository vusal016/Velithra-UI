/**
 * Velithra API - Generic CRUD Service
 * Reusable service class for all CRUD operations
 */

import apiClient from '@/lib/api/client';
import type { GenericResponse, PagedResult } from '@/lib/types';

export class CrudService<TDto, TCreate, TUpdate> {
  constructor(private endpoint: string) {}

  /**
   * Get all items
   */
  async getAll(): Promise<TDto[]> {
    const response = await apiClient.get<GenericResponse<TDto[]>>(
      `/${this.endpoint}`
    );
    return response.data.data || [];
  }

  /**
   * Get item by ID
   */
  async getById(id: string): Promise<TDto> {
    const response = await apiClient.get<GenericResponse<TDto>>(
      `/${this.endpoint}/${id}`
    );
    return response.data.data!;
  }

  /**
   * Get paged items
   */
  async getPaged(
    pageNumber: number,
    pageSize: number
  ): Promise<PagedResult<TDto>> {
    const response = await apiClient.get<GenericResponse<PagedResult<TDto>>>(
      `/${this.endpoint}/paged`,
      {
        params: { pageNumber, pageSize },
      }
    );
    return response.data.data!;
  }

  /**
   * Create new item
   */
  async create(data: TCreate): Promise<void> {
    await apiClient.post(`/${this.endpoint}`, data);
  }

  /**
   * Update existing item
   */
  async update(id: string, data: TUpdate): Promise<void> {
    await apiClient.put(`/${this.endpoint}/${id}`, data);
  }

  /**
   * Delete item
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/${this.endpoint}/${id}`);
  }
}

export default CrudService;
