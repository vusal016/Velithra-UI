/**
 * Velithra - Employee Dashboard Component
 * Personal tasks, courses, notifications
 */

'use client';

import { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import {
  CheckSquare,
  BookOpen,
  Bell,
  Clock,
  Award,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import { useAuthStore, useNotificationStore } from '@/lib/store';
import apiClient from '@/lib/api/client';
import type { GenericResponse } from '@/lib/types';
import { motion } from 'framer-motion';

interface EmployeeMetrics {
  myTasks: number;
  completedTasks: number;
  myCourses: number;
  completedCourses: number;
  courseProgress: number;
  unreadNotifications: number;
  upcomingDeadlines: number;
  achievementPoints: number;
}

interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
}

interface Course {
  id: string;
  title: string;
  progress: number;
  instructor: string;
  nextLesson: string;
}

export function EmployeeDashboard() {
  const [metrics, setMetrics] = useState<EmployeeMetrics | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuthStore();
  const { unreadCount } = useNotificationStore();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch employee metrics
      const response = await apiClient.get<GenericResponse<EmployeeMetrics>>('/dashboard/employee/metrics');

      if (response.data.success && response.data.data) {
        setMetrics(response.data.data);
      } else {
        // Set default values if backend doesn't return data
        setMetrics({
          myTasks: 0,
          completedTasks: 0,
          myCourses: 0,
          completedCourses: 0,
          courseProgress: 0,
          unreadNotifications: unreadCount,
          upcomingDeadlines: 0,
          achievementPoints: 0,
        });
      }

      // Load tasks and courses
      loadMyTasks();
      loadMyCourses();
    } catch (error) {
      console.error('Failed to load dashboard:', error);
      
      // Set empty metrics on error
      setMetrics({
        myTasks: 0,
        completedTasks: 0,
        myCourses: 0,
        completedCourses: 0,
        courseProgress: 0,
        unreadNotifications: 0,
        upcomingDeadlines: 0,
        achievementPoints: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMyTasks = async () => {
    try {
      const response = await apiClient.get<GenericResponse<Task[]>>('/dashboard/employee/tasks');

      if (response.data.success && response.data.data) {
        setTasks(response.data.data);
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error('Failed to load tasks:', error);
      setTasks([]);
    }
  };

  const loadMyCourses = async () => {
    try {
      const response = await apiClient.get<GenericResponse<Course[]>>('/dashboard/employee/courses');

      if (response.data.success && response.data.data) {
        setCourses(response.data.data);
      } else {
        setCourses([]);
      }
    } catch (error) {
      console.error('Failed to load courses:', error);
      setCourses([]);
    }
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">
          {getGreeting()}, {user?.userName || 'User'}! 👋
        </h1>
        <p className="text-muted-foreground">
          You have <span className="font-semibold text-foreground">{metrics?.myTasks || 0}</span> tasks and <span className="font-semibold text-foreground">{metrics?.upcomingDeadlines || 0}</span> deadlines coming up
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="My Tasks"
          value={metrics?.myTasks || 0}
          subtitle={`${metrics?.completedTasks} completed`}
          icon={CheckSquare}
          color="blue"
          href="/dashboard/task"
        />
        <MetricCard
          title="My Courses"
          value={metrics?.myCourses || 0}
          subtitle={`${metrics?.completedCourses} completed`}
          icon={BookOpen}
          color="purple"
          href="/dashboard/course"
        />
        <MetricCard
          title="Notifications"
          value={metrics?.unreadNotifications || 0}
          subtitle="Unread messages"
          icon={Bell}
          color="orange"
          href="/dashboard/notifications"
        />
        <MetricCard
          title="Achievement"
          value={metrics?.achievementPoints || 0}
          subtitle="Points earned"
          icon={Award}
          color="green"
          href="/dashboard"
        />
      </div>

      {/* Tasks & Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Tasks */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">My Tasks</h3>
            <Button variant="ghost" size="sm" asChild>
              <a href="/dashboard/task">View All</a>
            </Button>
          </div>
          
          <div className="space-y-3">
            {tasks.slice(0, 4).map((task, idx) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={task.status === 'completed'}
                  className="mt-1 rounded border-gray-300"
                  readOnly
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{task.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant={
                        task.priority === 'high'
                          ? 'destructive'
                          : task.priority === 'medium'
                          ? 'default'
                          : 'secondary'
                      }
                      className="text-xs"
                    >
                      {task.priority}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock size={12} />
                      {formatDate(task.dueDate)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        {/* My Courses */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">My Courses</h3>
            <Button variant="ghost" size="sm" asChild>
              <a href="/dashboard/course">View All</a>
            </Button>
          </div>
          
          <div className="space-y-4">
            {courses.map((course, idx) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-4 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-foreground">{course.title}</p>
                    <p className="text-xs text-muted-foreground">by {course.instructor}</p>
                  </div>
                  <Badge variant="outline">{course.progress}%</Badge>
                </div>
                <Progress value={course.progress} className="h-2 mb-2" />
                <p className="text-xs text-muted-foreground">Next: {course.nextLesson}</p>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Quick Actions */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickActionButton icon={CheckSquare} label="My Tasks" href="/dashboard/task" />
          <QuickActionButton icon={BookOpen} label="My Courses" href="/dashboard/course" />
          <QuickActionButton icon={Bell} label="Notifications" href="/dashboard/notifications" />
          <QuickActionButton icon={Calendar} label="Schedule" href="/dashboard" />
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
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: any;
  color: string;
  href: string;
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
      <div className="grid grid-cols-2 gap-6">
        <Skeleton className="h-96" />
        <Skeleton className="h-96" />
      </div>
    </div>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}
