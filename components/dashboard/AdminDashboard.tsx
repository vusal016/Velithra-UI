/**
 * Velithra - Admin Dashboard Component
 * Real-time metrics, module management, system overview
 */

'use client';

import { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Users,
  Shield,
  Bell,
  Activity,
  Database,
  Settings,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  RefreshCw,
} from 'lucide-react';
import { useDashboardHub } from '@/lib/hooks/useSignalR';
import { useNotificationStore } from '@/lib/store';
import apiClient from '@/lib/api/client';
import type { GenericResponse } from '@/lib/types';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface DashboardMetrics {
  totalUsers: number;
  activeUsers: number;
  totalRoles: number;
  totalModules: number;
  activeModules: number;
  totalNotifications: number;
  unreadNotifications: number;
  totalAuditLogs: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
  lastUpdated: string;
}

interface RecentActivity {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  type: 'info' | 'warning' | 'error';
}

export function AdminDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { unreadCount } = useNotificationStore();

  // Connect to Dashboard Hub for real-time updates
  const { isConnected, metrics: hubMetrics } = useDashboardHub({
    onMetricsUpdate: (data) => {
      setMetrics((prev) => ({
        ...prev!,
        activeUsers: data.users,
        totalRoles: data.roles,
        totalAuditLogs: data.logs,
        unreadNotifications: data.unreadNotifications,
        lastUpdated: new Date().toISOString(),
      }));
    },
    enabled: true,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch dashboard metrics from backend
      const response = await apiClient.get<GenericResponse<DashboardMetrics>>('/dashboard/admin/metrics');

      if (response.data.success && response.data.data) {
        setMetrics(response.data.data);
      } else {
        // Set default empty values
        setMetrics({
          totalUsers: 0,
          activeUsers: 0,
          totalRoles: 0,
          totalModules: 0,
          activeModules: 0,
          totalNotifications: 0,
          unreadNotifications: unreadCount,
          totalAuditLogs: 0,
          systemHealth: 'healthy',
          lastUpdated: new Date().toISOString(),
        });
      }

      // Load recent activities
      loadRecentActivities();
    } catch (error) {
      console.error('Failed to load dashboard:', error);
      
      // Set empty metrics on error
      setMetrics({
        totalUsers: 0,
        activeUsers: 0,
        totalRoles: 0,
        totalModules: 0,
        activeModules: 0,
        totalNotifications: 0,
        unreadNotifications: 0,
        totalAuditLogs: 0,
        systemHealth: 'warning',
        lastUpdated: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  const loadRecentActivities = async () => {
    try {
      const response = await apiClient.get<GenericResponse<RecentActivity[]>>('/dashboard/recent-activities', {
        params: { limit: 5 },
      });

      if (response.data.success && response.data.data) {
        setActivities(response.data.data);
      } else {
        setActivities([]);
      }
    } catch (error) {
      console.error('Failed to load activities:', error);
      setActivities([]);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
    toast.success('Dashboard refreshed');
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  const healthColor =
    metrics?.systemHealth === 'healthy'
      ? 'text-green-500'
      : metrics?.systemHealth === 'warning'
      ? 'text-yellow-500'
      : 'text-red-500';

  const healthIcon =
    metrics?.systemHealth === 'healthy' ? CheckCircle : AlertCircle;

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-6 p-8 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">{getGreeting()}! 👋</h1>
          <p className="text-muted-foreground">
            <span className="font-semibold text-foreground">{metrics?.activeUsers || 0}</span> active users • <span className="font-semibold text-foreground">{metrics?.totalModules || 0}</span> modules • <span className="font-semibold text-foreground">{metrics?.unreadNotifications || 0}</span> notifications
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isConnected && (
            <Badge variant="outline" className="gap-2 border-green-500/50 text-green-500">
              <Activity size={14} className="animate-pulse" />
              Live
            </Badge>
          )}
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
            className="gap-2"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Users"
          value={metrics?.totalUsers || 0}
          subtitle={`${metrics?.activeUsers || 0} active`}
          icon={Users}
          color="blue"
          trend="+12%"
        />
        <MetricCard
          title="Roles & Permissions"
          value={metrics?.totalRoles || 0}
          subtitle="Active roles"
          icon={Shield}
          color="purple"
        />
        <MetricCard
          title="Modules"
          value={`${metrics?.activeModules}/${metrics?.totalModules}`}
          subtitle="Active modules"
          icon={Database}
          color="cyan"
        />
        <MetricCard
          title="Notifications"
          value={metrics?.unreadNotifications || 0}
          subtitle={`${metrics?.totalNotifications} total`}
          icon={Bell}
          color="orange"
          trend={metrics?.unreadNotifications! > 0 ? 'New' : undefined}
        />
      </div>

      {/* System Health & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Health */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">System Health</h3>
            {React.createElement(healthIcon, { size: 24, className: healthColor })}
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">CPU Usage</span>
                <span className="font-medium">42%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: '42%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Memory</span>
                <span className="font-medium">68%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500" style={{ width: '68%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Database</span>
                <span className="font-medium">85%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500" style={{ width: '85%' }} />
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Recent Activities */}
        <GlassCard className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Recent Activities</h3>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {activities.map((activity, idx) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div
                  className={`p-2 rounded-lg ${
                    activity.type === 'error'
                      ? 'bg-red-500/20 text-red-500'
                      : activity.type === 'warning'
                      ? 'bg-yellow-500/20 text-yellow-500'
                      : 'bg-blue-500/20 text-blue-500'
                  }`}
                >
                  <Activity size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{activity.action}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    by {activity.user} • {formatTimestamp(activity.timestamp)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Quick Actions */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickActionButton icon={Users} label="Manage Users" href="/dashboard/users/create" />
          <QuickActionButton icon={Shield} label="Manage Roles" href="/dashboard/roles" />
          <QuickActionButton icon={Settings} label="Module Settings" href="/dashboard/modules" />
          <QuickActionButton icon={Activity} label="Audit Logs" href="/dashboard/audit-logs" />
        </div>
      </GlassCard>
    </div>
  );
}

// Helper Components
function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  trend,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: any;
  color: string;
  trend?: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-500/20 text-blue-500',
    purple: 'bg-purple-500/20 text-purple-500',
    cyan: 'bg-cyan-500/20 text-cyan-500',
    orange: 'bg-orange-500/20 text-orange-500',
  }[color];

  return (
    <GlassCard className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses}`}>
          <Icon size={24} />
        </div>
        {trend && (
          <Badge variant="outline" className="gap-1">
            <TrendingUp size={12} />
            {trend}
          </Badge>
        )}
      </div>
      <h3 className="text-3xl font-bold text-foreground mb-1">{value}</h3>
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
    </GlassCard>
  );
}

function QuickActionButton({ icon: Icon, label, href }: { icon: any; label: string; href: string }) {
  return (
    <Button variant="outline" className="h-auto flex-col gap-2 p-4" asChild>
      <a href={href}>
        <Icon size={24} />
        <span className="text-sm">{label}</span>
      </a>
    </Button>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-8">
      <Skeleton className="h-20 w-full" />
      <div className="grid grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-6">
        <Skeleton className="h-64" />
        <Skeleton className="h-64 col-span-2" />
      </div>
    </div>
  );
}

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
  return `${Math.floor(minutes / 1440)}d ago`;
}

// Add React import for createElement
import React from 'react';
