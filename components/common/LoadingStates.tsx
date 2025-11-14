/**
 * Velithra - Loading Components
 * Reusable loading states and skeletons
 */

'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { GlassCard } from '@/components/ui/glass-card';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================
// FULL PAGE LOADER
// ============================================

interface FullPageLoaderProps {
  message?: string;
}

export function FullPageLoader({ message = 'Loading...' }: FullPageLoaderProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f1f35] to-[#0a1628] flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-[#00d9ff] mx-auto" />
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}

// ============================================
// SPINNER
// ============================================

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <Loader2
      className={cn('animate-spin text-[#00d9ff]', sizeClasses[size], className)}
    />
  );
}

// ============================================
// CARD SKELETON
// ============================================

export function CardSkeleton() {
  return (
    <GlassCard className="p-6">
      <div className="space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex gap-2 pt-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    </GlassCard>
  );
}

// ============================================
// TABLE SKELETON
// ============================================

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export function TableSkeleton({ rows = 5, columns = 4 }: TableSkeletonProps) {
  return (
    <GlassCard className="overflow-hidden">
      <div className="p-6 space-y-3">
        {/* Header */}
        <div className="flex gap-4">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} className="h-6 flex-1" />
          ))}
        </div>
        
        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex gap-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton key={colIndex} className="h-10 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

// ============================================
// DASHBOARD SKELETON
// ============================================

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <Skeleton className="h-20 w-full" />
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      
      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="h-64" />
        <Skeleton className="h-64 lg:col-span-2" />
      </div>
      
      {/* Actions */}
      <Skeleton className="h-24 w-full" />
    </div>
  );
}

// ============================================
// LIST SKELETON
// ============================================

interface ListSkeletonProps {
  items?: number;
}

export function ListSkeleton({ items = 5 }: ListSkeletonProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <GlassCard key={i} className="p-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        </GlassCard>
      ))}
    </div>
  );
}

// ============================================
// FORM SKELETON
// ============================================

export function FormSkeleton() {
  return (
    <GlassCard className="p-6">
      <div className="space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
        <div className="flex gap-3 pt-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    </GlassCard>
  );
}

// ============================================
// INLINE LOADER
// ============================================

interface InlineLoaderProps {
  message?: string;
  className?: string;
}

export function InlineLoader({ message, className }: InlineLoaderProps) {
  return (
    <div className={cn('flex items-center gap-2 text-muted-foreground', className)}>
      <Spinner size="sm" />
      {message && <span className="text-sm">{message}</span>}
    </div>
  );
}

// ============================================
// EMPTY STATE
// ============================================

interface EmptyStateProps {
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <GlassCard className="p-12">
      <div className="text-center space-y-4">
        {Icon && (
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-muted">
              <Icon size={48} className="text-muted-foreground" />
            </div>
          </div>
        )}
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
        {action && (
          <button
            onClick={action.onClick}
            className="text-primary hover:underline font-medium"
          >
            {action.label}
          </button>
        )}
      </div>
    </GlassCard>
  );
}
