/**
 * Velithra API - Item (Inventory) Service
 * Backend API Endpoint: /api/Item
 */

import apiClient from '../api/client';
import type { GenericResponse, PagedResult } from '../types';

export interface ItemDto {
  id: string;
  name: string;
  quantity: number;
  description?: string;
  categoryId: number;
}

export interface ItemCreateDto {
  name: string;
  quantity: number;
  description?: string;
  categoryId: number;
}

export interface ItemUpdateDto {
  id: string;
  name: string;
  quantity: number;
  description?: string;
  categoryId: number;
}

export const itemService = {
  /**
   * GET /api/Item - Get all items
   */
  async getAll(): Promise<ItemDto[]> {
    try {
      const response = await apiClient.get<GenericResponse<ItemDto[]>>('/item');
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data || [];
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch items');
    }
  },

  /**
   * GET /api/Item/paged - Get items with pagination
   */
  async getPaged(pageNumber: number = 1, pageSize: number = 10): Promise<PagedResult<ItemDto>> {
    try {
      const response = await apiClient.get<GenericResponse<PagedResult<ItemDto>>>(
        '/item/paged',
        { params: { pageNumber, pageSize } }
      );
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch items');
    }
  },

  /**
   * GET /api/Item/{id} - Get item by ID
   */
  async getById(id: string): Promise<ItemDto> {
    try {
      const response = await apiClient.get<GenericResponse<ItemDto>>(`/item/${id}`);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch item');
    }
  },

  /**
   * POST /api/Item - Create item
   */
  async create(data: ItemCreateDto): Promise<string> {
    try {
      const response = await apiClient.post<GenericResponse<string>>('/item', data);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to create item');
    }
  },

  /**
   * PUT /api/Item/{id} - Update item
   */
  async update(id: string, data: ItemUpdateDto): Promise<string> {
    try {
      const response = await apiClient.put<GenericResponse<string>>(`/item/${id}`, data);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to update item');
    }
  },

  /**
   * DELETE /api/Item/{id} - Delete item
   */
  async delete(id: string): Promise<boolean> {
    try {
      const response = await apiClient.delete<GenericResponse<boolean>>(`/item/${id}`);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to delete item');
    }
  }
};
