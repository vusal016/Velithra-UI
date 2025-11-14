import api from '../api/api';

export const roleService = {
  async getAll() {
    const res = await api.get('/role');
    return res.data;
  },
  async getById(id: string) {
    const res = await api.get(`/role/${id}`);
    return res.data;
  },
  async create(data: any) {
    const res = await api.post('/role', data);
    return res.data;
  },
  async update(id: string, data: any) {
    const res = await api.put(`/role/${id}`, data);
    return res.data;
  },
  async delete(id: string) {
    const res = await api.delete(`/role/${id}`);
    return res.data;
  }
};
