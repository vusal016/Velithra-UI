/**
 * Velithra - Auth Context Provider
 * Global authentication context for the application
 */

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '@/lib/services/authService';
import type { User, LoginRequest, RegisterRequest } from '@/lib/types';
import { toast } from 'sonner';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
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

  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);

      setUser({
        userName: response.userName,
        email: response.email,
        roles: response.roles,
      });
      setIsAuthenticated(true);

      toast.success('Login successful!', {
        description: `Welcome back, ${response.userName}!`,
      });
    } catch (error: any) {
      toast.error('Login failed', {
        description: error.response?.data?.message || 'Invalid credentials',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (userData: RegisterRequest) => {
    try {
      setIsLoading(true);
      const response = await authService.register(userData);

      setUser({
        userName: response.userName,
        email: response.email,
        roles: response.roles,
      });
      setIsAuthenticated(true);

      toast.success('Registration successful!', {
        description: `Welcome, ${response.userName}!`,
      });
    } catch (error: any) {
      toast.error('Registration failed', {
        description: error.response?.data?.message || 'Please try again',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);

    toast.info('Logged out', {
      description: 'You have been successfully logged out',
    });
  }, []);

  const hasRole = useCallback(
    (role: string): boolean => {
      return authService.hasRole(role);
    },
    [user]
  );

  const hasAnyRole = useCallback(
    (roles: string[]): boolean => {
      return authService.hasAnyRole(roles);
    },
    [user]
  );

  const value: AuthContextValue = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    hasRole,
    hasAnyRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;
