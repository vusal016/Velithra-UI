import api from '../api/api';

export const employeeService = {
  async getAll() {
    const res = await api.get('/employee');
    return res.data;
  },
  async getPaged(pageNumber = 1, pageSize = 10) {
    const res = await api.get(`/employee/paged?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    return res.data;
  },
  async getById(id: string) {
    const res = await api.get(`/employee/${id}`);
    return res.data;
  },
  async create(data: any) {
    const res = await api.post('/employee', data);
    return res.data;
  },
  async update(data: any) {
    const res = await api.put('/employee', data);
    return res.data;
  },
  async delete(id: string) {
    const res = await api.delete(`/employee/${id}`);
    return res.data;
  }
};

// ...existing code...
