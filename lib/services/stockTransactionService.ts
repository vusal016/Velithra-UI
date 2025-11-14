import api from '../api/api';
import apiClient from '../api/client';
import type { StockTransactionDto, StockTransactionCreateDto, PagedResult } from '@/lib/types';

export const stockTransactionService = {
  async getAll() {
    const res = await api.get('/stocktransaction');
    return res.data;
  },

  async getPaged(pageNumber: number, pageSize: number) {
    const response = await apiClient.get<PagedResult<StockTransactionDto>>('/stocktransaction/paged', {
      params: { pageNumber, pageSize },
    });
    return response.data;
  },

  async getById(id: string) {
    const response = await apiClient.get<StockTransactionDto>(`/stocktransaction/${id}`);
    return response.data;
  },

  async getByItem(itemId: string) {
    const response = await apiClient.get<StockTransactionDto[]>(`/stocktransaction/item/${itemId}`);
    return response.data;
  },

  async create(data: StockTransactionCreateDto) {
    const response = await apiClient.post<string>('/stocktransaction', data);
    return response.data;
  },

  async delete(id: string) {
    const response = await apiClient.delete<boolean>(`/stocktransaction/${id}`);
    return response.data;
  },
};
