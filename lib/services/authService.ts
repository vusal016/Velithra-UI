/**
 * Velithra API - Authentication Service
 * Handles login, register, logout, and token management
 */

import apiClient from '@/lib/api/client';
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  GenericResponse,
  User,
} from '@/lib/types';

const TOKEN_KEY = 'velithra_token';
const USER_KEY = 'velithra_user';

export class AuthService {
  /**
   * Login user
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<GenericResponse<AuthResponse>>(
      '/auth/login',
      credentials
    );

    const authData = response.data.data;
    
    if (authData) {
      // Store token and user data
      this.setToken(authData.token);
      this.setUser({
        userName: authData.userName,
        email: authData.email,
        roles: authData.roles,
      });
    }

    return authData!;
  }

  /**
   * Register new user
   */
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<GenericResponse<AuthResponse>>(
      '/auth/register',
      userData
    );

    const authData = response.data.data;

    if (authData) {
      // Store token and user data
      this.setToken(authData.token);
      this.setUser({
        userName: authData.userName,
        email: authData.email,
        roles: authData.roles,
      });
    }

    return authData!;
  }

  /**
   * Logout user
   */
  logout(): void {
    this.clearAuth();
    
    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: string): boolean {
    const user = this.getUser();
    return user?.roles?.includes(role) || false;
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: string[]): boolean {
    const user = this.getUser();
    return roles.some((role) => user?.roles?.includes(role));
  }

  /**
   * Get current user
   */
  getUser(): User | null {
    if (typeof window === 'undefined') return null;
    
    const userJson = localStorage.getItem(USER_KEY);
    if (!userJson) return null;

    try {
      return JSON.parse(userJson) as User;
    } catch {
      return null;
    }
  }

  /**
   * Get current token
   */
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  }

  /**
   * Set token
   */
  private setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token);
    }
  }

  /**
   * Set user data
   */
  private setUser(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  }

  /**
   * Clear authentication data
   */
  private clearAuth(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
