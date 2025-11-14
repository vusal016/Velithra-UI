/**
 * Velithra - Manager Dashboard Component
 * Team overview, task management, department metrics
 */

'use client';

import { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  CheckSquare,
  BookOpen,
  Package,
  TrendingUp,
  Clock,
  AlertTriangle,
  Award,
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import apiClient from '@/lib/api/client';
import type { GenericResponse } from '@/lib/types';
import { motion } from 'framer-motion';

interface ManagerMetrics {
  myTeamCount: number;
  activeTasks: number;
  completedTasks: number;
  pendingEnrollments: number;
  lowStockItems: number;
  departmentPerformance: number;
  monthlyGoal: number;
  monthlyProgress: number;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  tasksCompleted: number;
  tasksActive: number;
  performance: number;
  avatar?: string;
}

export function ManagerDashboard() {
  const [metrics, setMetrics] = useState<ManagerMetrics | null>(null);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch manager metrics
      const response = await apiClient.get<GenericResponse<ManagerMetrics>>('/dashboard/manager/metrics');

      if (response.data.success && response.data.data) {
        setMetrics(response.data.data);
      } else {
        // Set default empty values
        setMetrics({
          myTeamCount: 0,
          activeTasks: 0,
          completedTasks: 0,
          pendingEnrollments: 0,
          lowStockItems: 0,
          departmentPerformance: 0,
          monthlyGoal: 100,
          monthlyProgress: 0,
        });
      }

      // Load team members
      loadTeamMembers();
    } catch (error) {
      console.error('Failed to load dashboard:', error);
      
      // Set empty metrics on error
      setMetrics({
        myTeamCount: 0,
        activeTasks: 0,
        completedTasks: 0,
        pendingEnrollments: 0,
        lowStockItems: 0,
        departmentPerformance: 0,
        monthlyGoal: 100,
        monthlyProgress: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const loadTeamMembers = async () => {
    try {
      const response = await apiClient.get<GenericResponse<TeamMember[]>>('/dashboard/manager/team');

      if (response.data.success && response.data.data) {
        setTeam(response.data.data);
      } else {
        setTeam([]);
      }
    } catch (error) {
      console.error('Failed to load team:', error);
      setTeam([]);
    }
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  const completionRate = metrics ? (metrics.monthlyProgress / metrics.monthlyGoal) * 100 : 0;

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Welcome back, {user?.userName}!
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your team today
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="My Team"
          value={metrics?.myTeamCount || 0}
          subtitle="Active members"
          icon={Users}
          color="blue"
          href="/dashboard/hr/employees"
        />
        <MetricCard
          title="Active Tasks"
          value={metrics?.activeTasks || 0}
          subtitle={`${metrics?.completedTasks} completed`}
          icon={CheckSquare}
          color="green"
          href="/dashboard/task"
        />
        <MetricCard
          title="Enrollments"
          value={metrics?.pendingEnrollments || 0}
          subtitle="Pending approval"
          icon={BookOpen}
          color="purple"
          href="/dashboard/course"
        />
        <MetricCard
          title="Low Stock"
          value={metrics?.lowStockItems || 0}
          subtitle="Items need attention"
          icon={Package}
          color="orange"
          href="/dashboard/inventory"
          alert={metrics?.lowStockItems! > 0}
        />
      </div>

      {/* Performance & Team */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Performance */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Department Performance</h3>
            <Badge variant="outline">{metrics?.departmentPerformance}%</Badge>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Monthly Goal</span>
                <span className="font-medium">
                  {metrics?.monthlyProgress}/{metrics?.monthlyGoal}
                </span>
              </div>
              <Progress value={completionRate} className="h-3" />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-2xl font-bold text-foreground">{metrics?.activeTasks}</p>
                <p className="text-xs text-muted-foreground">Active Tasks</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-500">{metrics?.completedTasks}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Team Members */}
        <GlassCard className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Team Performance</h3>
            <Button variant="ghost" size="sm" asChild>
              <a href="/dashboard/hr/employees">View All</a>
            </Button>
          </div>
          
          <div className="space-y-3">
            {team.map((member, idx) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold">
                  {member.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.role}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <Badge variant={member.performance >= 90 ? 'default' : 'secondary'}>
                      {member.performance}%
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {member.tasksActive} active • {member.tasksCompleted} done
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Quick Links */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickActionButton icon={Users} label="Manage Team" href="/dashboard/hr/employees" />
          <QuickActionButton icon={CheckSquare} label="Task Manager" href="/dashboard/task" />
          <QuickActionButton icon={BookOpen} label="LMS" href="/dashboard/course" />
          <QuickActionButton icon={Package} label="Inventory" href="/dashboard/inventory" />
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
  href,
  alert = false,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: any;
  color: string;
  href: string;
  alert?: boolean;
}) {
  const colorClasses = {
    blue: 'bg-blue-500/20 text-blue-500',
    green: 'bg-green-500/20 text-green-500',
    purple: 'bg-purple-500/20 text-purple-500',
    orange: 'bg-orange-500/20 text-orange-500',
  }[color];

  return (
    <GlassCard className="p-6 hover:border-primary/50 transition-colors cursor-pointer">
      <a href={href}>
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-lg ${colorClasses}`}>
            <Icon size={24} />
          </div>
          {alert && (
            <Badge variant="destructive" className="gap-1">
              <AlertTriangle size={12} />
              Alert
            </Badge>
          )}
        </div>
        <h3 className="text-3xl font-bold text-foreground mb-1">{value}</h3>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      </a>
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
