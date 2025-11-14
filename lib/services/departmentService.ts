import api from '../api/api';

export const departmentService = {
  async getAll() {
    const res = await api.get('/department');
    return res.data;
  },
  async getPaged(pageNumber = 1, pageSize = 10) {
    const res = await api.get(`/department/paged?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    return res.data;
  },
  async getById(id: string) {
    const res = await api.get(`/department/${id}`);
    return res.data;
  },
  async create(data: any) {
    const res = await api.post('/department', data);
    return res.data;
  },
  async update(id: string, data: any) {
    const res = await api.put(`/department/${id}`, data);
    return res.data;
  },
  async delete(id: string) {
    const res = await api.delete(`/department/${id}`);
    return res.data;
  },
  async getPositionsByDepartment(departmentId: string) {
    const res = await api.get(`/department/${departmentId}/positions`);
    return res.data;
  }
};
