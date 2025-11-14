import api from '../api/api';

export const categoryService = {
  async getAll() {
    const res = await api.get('/category');
    return res.data;
  },
  async create(data: any) {
    const res = await api.post('/category', data);
    return res.data;
  },
  async update(id: string, data: any) {
    const res = await api.put(`/category/${id}`, data);
    return res.data;
  },
  async delete(id: string) {
    const res = await api.delete(`/category/${id}`);
    return res.data;
  }
};
