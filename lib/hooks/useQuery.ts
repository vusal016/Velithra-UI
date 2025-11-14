/**
 * Velithra - React Query Hooks
 * Custom hooks for data fetching with TanStack Query
 */

import { useQuery, useMutation, useQueryClient, type UseQueryOptions, type UseMutationOptions } from '@tanstack/react-query';
import { notificationService } from '@/lib/services/coreServices';
import apiClient from '@/lib/api/client';
import type { GenericResponse, NotificationDto, PagedResult } from '@/lib/types';
import { toast } from 'sonner';

// ============================================
// QUERY KEYS
// ============================================

export const queryKeys = {
  // Notifications
  notifications: {
    all: ['notifications'] as const,
    list: () => [...queryKeys.notifications.all, 'list'] as const,
    byUser: (userId: string) => [...queryKeys.notifications.all, 'user', userId] as const,
    unreadCount: () => [...queryKeys.notifications.all, 'unreadCount'] as const,
  },
  // Modules
  modules: {
    all: ['modules'] as const,
    list: () => [...queryKeys.modules.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.modules.all, id] as const,
  },
  // Employees
  employees: {
    all: ['employees'] as const,
    list: () => [...queryKeys.employees.all, 'list'] as const,
    paged: (page: number, pageSize: number) => 
      [...queryKeys.employees.all, 'paged', page, pageSize] as const,
    detail: (id: string) => [...queryKeys.employees.all, id] as const,
  },
  // Courses
  courses: {
    all: ['courses'] as const,
    list: () => [...queryKeys.courses.all, 'list'] as const,
    paged: (page: number, pageSize: number) => 
      [...queryKeys.courses.all, 'paged', page, pageSize] as const,
    detail: (id: string) => [...queryKeys.courses.all, id] as const,
  },
  // Dashboard
  dashboard: {
    all: ['dashboard'] as const,
    metrics: () => [...queryKeys.dashboard.all, 'metrics'] as const,
  },
  // Audit Logs
  auditLogs: {
    all: ['auditLogs'] as const,
    paged: (page: number, pageSize: number) => 
      [...queryKeys.auditLogs.all, 'paged', page, pageSize] as const,
  },
};

// ============================================
// NOTIFICATION HOOKS
// ============================================

export function useNotifications(options?: UseQueryOptions<NotificationDto[], Error>) {
  return useQuery({
    queryKey: queryKeys.notifications.list(),
    queryFn: () => notificationService.getAll(),
    ...options,
  });
}

export function useNotificationsByUser(userId: string, options?: UseQueryOptions<NotificationDto[], Error>) {
  return useQuery({
    queryKey: queryKeys.notifications.byUser(userId),
    queryFn: () => notificationService.getByUser(userId),
    enabled: !!userId,
    ...options,
  });
}

export function useUnreadNotificationCount(options?: UseQueryOptions<number, Error>) {
  return useQuery({
    queryKey: queryKeys.notifications.unreadCount(),
    queryFn: async () => {
      const notifications = await notificationService.getAll();
      return notifications.filter(n => !n.isRead).length;
    },
    // Refetch every 30 seconds
    refetchInterval: 30000,
    ...options,
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      // Invalidate all notification queries
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
      toast.success('Notification marked as read');
    },
    onError: () => {
      toast.error('Failed to mark notification as read');
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
      toast.success('Notification deleted');
    },
    onError: () => {
      toast.error('Failed to delete notification');
    },
  });
}

// ============================================
// GENERIC PAGED DATA HOOK
// ============================================

interface PagedQueryOptions<T> {
  endpoint: string;
  pageNumber?: number;
  pageSize?: number;
  enabled?: boolean;
}

export function usePagedData<T>(
  queryKey: readonly unknown[],
  { endpoint, pageNumber = 1, pageSize = 10, enabled = true }: PagedQueryOptions<T>
) {
  return useQuery<PagedResult<T>, Error>({
    queryKey: [...queryKey, pageNumber, pageSize],
    queryFn: async () => {
      const response = await apiClient.get<GenericResponse<PagedResult<T>>>(
        `${endpoint}/paged`,
        {
          params: { pageNumber, pageSize },
        }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch data');
      }
      
      return response.data.data!;
    },
    enabled,
    keepPreviousData: true, // Keep previous page data while fetching new page
  });
}

// ============================================
// GENERIC MUTATION HOOKS
// ============================================

interface CreateMutationOptions<TData, TVariables> {
  endpoint: string;
  invalidateKeys: readonly unknown[][];
  successMessage?: string;
  errorMessage?: string;
}

export function useCreateMutation<TData = any, TVariables = any>({
  endpoint,
  invalidateKeys,
  successMessage = 'Created successfully',
  errorMessage = 'Failed to create',
}: CreateMutationOptions<TData, TVariables>) {
  const queryClient = useQueryClient();

  return useMutation<TData, Error, TVariables>({
    mutationFn: async (data: TVariables) => {
      const response = await apiClient.post<GenericResponse<TData>>(endpoint, data);
      
      if (!response.data.success) {
        throw new Error(response.data.message || errorMessage);
      }
      
      return response.data.data!;
    },
    onSuccess: () => {
      invalidateKeys.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });
      toast.success(successMessage);
    },
    onError: (error: Error) => {
      toast.error(error.message || errorMessage);
    },
  });
}

interface UpdateMutationOptions<TData, TVariables> {
  endpoint: string;
  invalidateKeys: readonly unknown[][];
  successMessage?: string;
  errorMessage?: string;
}

export function useUpdateMutation<TData = any, TVariables = any>({
  endpoint,
  invalidateKeys,
  successMessage = 'Updated successfully',
  errorMessage = 'Failed to update',
}: UpdateMutationOptions<TData, TVariables>) {
  const queryClient = useQueryClient();

  return useMutation<TData, Error, TVariables>({
    mutationFn: async (data: TVariables) => {
      const response = await apiClient.put<GenericResponse<TData>>(endpoint, data);
      
      if (!response.data.success) {
        throw new Error(response.data.message || errorMessage);
      }
      
      return response.data.data!;
    },
    onSuccess: () => {
      invalidateKeys.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });
      toast.success(successMessage);
    },
    onError: (error: Error) => {
      toast.error(error.message || errorMessage);
    },
  });
}

interface DeleteMutationOptions {
  endpoint: string;
  invalidateKeys: readonly unknown[][];
  successMessage?: string;
  errorMessage?: string;
}

export function useDeleteMutation({
  endpoint,
  invalidateKeys,
  successMessage = 'Deleted successfully',
  errorMessage = 'Failed to delete',
}: DeleteMutationOptions) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete<GenericResponse<boolean>>(`${endpoint}/${id}`);
      
      if (!response.data.success) {
        throw new Error(response.data.message || errorMessage);
      }
    },
    onSuccess: () => {
      invalidateKeys.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });
      toast.success(successMessage);
    },
    onError: (error: Error) => {
      toast.error(error.message || errorMessage);
    },
  });
}
