import api from '../api/api';

export const dashboardService = {
  async getAdmin() {
    const res = await api.get('/dashboard/admin');
    return res.data;
  },
  async getManager() {
    const res = await api.get('/dashboard/manager');
    return res.data;
  },
  async getUser() {
    const res = await api.get('/dashboard/user');
    return res.data;
  },
  async getStatistics() {
    const res = await api.get('/dashboard/statistics');
    return res.data;
  }
};
