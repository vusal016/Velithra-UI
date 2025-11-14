import api from '../api/api';

export const userService = {
  async getAll() {
    const res = await api.get('/appuser');
    return res.data;
  },
  async getPaged(pageNumber = 1, pageSize = 10) {
    const res = await api.get(`/appuser/paged?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    return res.data;
  },
  async getById(id: string) {
    const res = await api.get(`/appuser/${id}`);
    return res.data;
  },
  async create(data: any) {
    const res = await api.post('/appuser', data);
    return res.data;
  },
  async update(data: any) {
    const res = await api.put('/appuser', data);
    return res.data;
  },
  async delete(id: string) {
    const res = await api.delete(`/appuser/${id}`);
    return res.data;
  }
};
