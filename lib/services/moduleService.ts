import apiClient from '@/lib/api/client';
import type { ModuleDto } from '@/lib/types/module.types';

export class ModuleService {
  private endpoint = '/module';

  async getAll(search = '', pageNumber = 1, pageSize = 10): Promise<{ items: ModuleDto[]; totalCount: number; pageNumber: number; pageSize: number; totalPages: number }> {
    const response = await apiClient.get(`/module/paged`, {
      params: { search, pageNumber, pageSize },
    });
    if (!response.data.success) throw new Error(response.data.message);
    return response.data.data;
  }

  async createModule(data: { name: string; description: string }): Promise<string> {
    const response = await apiClient.post(`/module`, data);
    if (!response.data.success) throw new Error(response.data.message);
    return response.data.data;
  }

  async updateModule(id: string, data: { name: string; description: string; isActive: boolean }): Promise<string> {
    const response = await apiClient.put(`/module/${id}`, data);
    if (!response.data.success) throw new Error(response.data.message);
    return response.data.data;
  }

  async deleteModule(id: string): Promise<boolean> {
    const response = await apiClient.delete(`/module/${id}`);
    if (!response.data.success) throw new Error(response.data.message);
    return response.data.data;
  }

  async activate(id: string): Promise<boolean> {
    const response = await apiClient.post(`/module/${id}/activate`);
    if (!response.data.success) throw new Error(response.data.message);
    return response.data.data;
  }

  /**
   * Get only active modules (for dynamic sidebar)
   */
  async getActive(): Promise<ModuleDto[]> {
    try {
      const response = await apiClient.get<{ items: ModuleDto[] }>(`${this.endpoint}/paged`, {
        params: { pageNumber: 1, pageSize: 100 }, // Get all active
      });
      
      if (!response.data) return [];
      
      // Filter only active modules
      const allModules = response.data.items || [];
      return allModules.filter((m) => m.isActive);
    } catch (error: any) {
      console.error('[Module Service] Get active modules failed:', error);
      return [];
    }
  }
}

export const moduleService = new ModuleService();
