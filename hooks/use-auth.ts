/**
 * Velithra - useAuth Hook
 * Custom React hook for authentication management
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { authService } from '@/lib/services/authService';
import type { LoginRequest, RegisterRequest, User } from '@/lib/types';
import { toast } from 'sonner';

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<any>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = () => {
      const currentUser = authService.getUser();
      const isAuth = authService.isAuthenticated();

      setUser(currentUser);
      setIsAuthenticated(isAuth);
      setIsLoading(false);
    };

    initAuth();
  }, []);

  /**
   * Login handler
   */
  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);

      // Create complete User object
      const userObj: User = {
        id: response.userName, // Use userName as ID since backend doesn't return userId
        userName: response.userName,
        email: response.email,
        fullName: response.userName, // Use userName as fallback
        roles: response.roles || [],
      };
      
      setUser(userObj);
      setIsAuthenticated(true);
      
      // Save to localStorage for persistence
      localStorage.setItem('user', JSON.stringify(userObj));

      toast.success('Login successful!', {
        description: `Welcome back, ${response.userName}!`,
      });

      return response;
    } catch (error: any) {
      const errorMessage = error.message || 'Invalid credentials';
      toast.error('Login failed', {
        description: errorMessage,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Register handler
   */
  const register = useCallback(async (userData: RegisterRequest) => {
    try {
      setIsLoading(true);
      const response = await authService.register(userData);

      // Create complete User object
      const userObj: User = {
        id: response.userName, // Use userName as ID since backend doesn't return userId
        userName: response.userName,
        email: response.email,
        fullName: userData.fullName || response.userName,
        roles: response.roles || [],
      };
      
      setUser(userObj);
      setIsAuthenticated(true);
      
      // Save to localStorage for persistence
      localStorage.setItem('user', JSON.stringify(userObj));

      toast.success('Registration successful!', {
        description: `Welcome, ${response.userName}!`,
      });
    } catch (error: any) {
      const errorMessage = error.message || 'Please try again';
      toast.error('Registration failed', {
        description: errorMessage,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Logout handler
   */
  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    
    toast.info('Logged out', {
      description: 'You have been successfully logged out',
    });
  }, []);

  /**
   * Check if user has specific role
   */
  const hasRole = useCallback(
    (role: string): boolean => {
      return authService.hasRole(role);
    },
    [user]
  );

  /**
   * Check if user has any of specified roles
   */
  const hasAnyRole = useCallback(
    (roles: string[]): boolean => {
      return authService.hasAnyRole(roles);
    },
    [user]
  );

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    hasRole,
    hasAnyRole,
  };
};

export default useAuth;
