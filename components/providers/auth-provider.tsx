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
    // On mount, try to get user from localStorage (if needed) or set as unauthenticated
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const parsed = JSON.parse(userStr);
        setUser(parsed);
        setIsAuthenticated(!!localStorage.getItem('token'));
      } catch {
        setUser(null);
        setIsAuthenticated(false);
      }
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);
      
      // Create proper User object with all required fields
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
        description: `Welcome back, ${response.userName || response.email || 'User'}!`,
      });
    } catch (error: any) {
      toast.error('Login failed', {
        description: error.message || 'Invalid credentials',
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
      
      // Create proper User object with all required fields
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
        description: `Welcome, ${response.userName || response.email || 'User'}!`,
      });
    } catch (error: any) {
      toast.error('Registration failed', {
        description: error.message || 'Please try again',
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
      return user?.roles?.includes(role) || false;
    },
    [user]
  );

  const hasAnyRole = useCallback(
    (roles: string[]): boolean => {
      if (!user?.roles) return false;
      return roles.some((role) => user.roles.includes(role));
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
