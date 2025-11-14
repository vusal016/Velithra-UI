/**
 * Velithra API - Authentication Service
 * Backend API Endpoint: /api/Auth
 * Port: 5000
 */

import apiClient from '../api/client';

interface RegisterDto {
  email: string;
  userName: string;
  password: string;
  confirmPassword: string;
}

interface LoginDto {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  refreshToken?: string;
  expiration: string;
  userName: string;
  email: string;
  roles: string[];
}

interface UpdateUserDto {
  userId: string;
  fullName?: string;
  phoneNumber?: string;
}

export const authService = {
  /**
   * POST /api/Auth/register - User registration
   */
  async register(data: RegisterDto): Promise<AuthResponse> {
    try {
      const response = await apiClient.post('/auth/register', data);
      if (response.data.success) {
        this.saveAuthData(response.data.data);
        return response.data.data;
      }
      throw new Error(response.data.message || 'Registration failed');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Registration failed');
    }
  },

  /**
   * POST /api/Auth/login - User login
   */
  async login(data: LoginDto): Promise<AuthResponse> {
    try {
      const response = await apiClient.post('/auth/login', data);
      if (response.data.success) {
        this.saveAuthData(response.data.data);
        return response.data.data;
      }
      throw new Error(response.data.message || 'Login failed');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Login failed');
    }
  },

  /**
   * GET /api/Auth/{userId} - Get user details
   */
  async getUserDetails(userId: string): Promise<any> {
    try {
      const response = await apiClient.get(`/auth/${userId}`);
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to fetch user details');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch user details');
    }
  },

  /**
   * PUT /api/Auth/update - Update user
   */
  async updateUser(data: UpdateUserDto): Promise<AuthResponse> {
    try {
      const response = await apiClient.put('/auth/update', data);
      if (response.data.success) {
        this.saveAuthData(response.data.data);
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to update user');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to update user');
    }
  },

  /**
   * DELETE /api/Auth/{userId} - Delete user
   */
  async deleteUser(userId: string): Promise<boolean> {
    try {
      const response = await apiClient.delete(`/auth/${userId}`);
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to delete user');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to delete user');
    }
  },

  /**
   * Save authentication data to localStorage
   */
  saveAuthData(data: AuthResponse) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        userName: data.userName,
        email: data.email,
        roles: data.roles,
        expiration: data.expiration
      }));
    }
    // Token will be added automatically by apiClient interceptor
  },

  /**
   * Logout - Clear all auth data
   */
  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  },

  /**
   * Get JWT token from localStorage
   */
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  },

  /**
   * Get current user from localStorage
   */
  getUser(): any {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  /**
   * Check if user has specific role
   */
  hasRole(role: string): boolean {
    const user = this.getUser();
    return user?.roles?.includes(role) || false;
  },

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: string[]): boolean {
    const user = this.getUser();
    if (!user?.roles) return false;
    return roles.some((role) => user.roles.includes(role));
  },

  /**
   * Get current user ID
   */
  getUserId(): string | null {
    const user = this.getUser();
    return user?.id || user?.userId || null;
  },

  /**
   * Get role-specific redirect path
   */
  getRoleRedirectPath(): string {
    const user = this.getUser();
    if (!user || !user.roles) return "/login";
    if (user.roles.includes("Admin")) return "/dashboard";
    if (user.roles.includes("Manager")) return "/hr/employees";
    if (user.roles.includes("HR")) return "/hr/employees";
    if (user.roles.includes("User")) return "/user/dashboard";
    return "/";
  }
};
