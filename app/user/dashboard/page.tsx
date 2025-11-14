"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  CheckSquare, 
  BookOpen, 
  Bell, 
  TrendingUp,
  Clock,
  Loader2 
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { authService } from "@/lib/services/authService";
import { dashboardService } from "@/lib/services/coreServices";
import { taskService, type TaskDto, type TaskState } from "@/lib/services/taskService";
import { toast } from "sonner";
import type { UserDashboardData } from "@/lib/types/core.types";

export default function UserDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<UserDashboardData | null>(null);
  const [tasks, setTasks] = useState<TaskDto[]>([]);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    // Check authentication
    if (!authService.isAuthenticated()) {
      router.push("/login");
      return;
    }

    // Check role - only allow User role
    if (!(authService.hasRole('User') && !authService.hasRole('Admin') && !authService.hasRole('Manager'))) {
      toast.error("Access denied - User role required");
      router.push(authService.getRoleRedirectPath());
      return;
    }

    loadDashboard();
  }, [router]);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      // Get user info
      const user = authService.getUser();
      setUserName(user?.userName || "User");

      // Get dashboard data
      const dashboardData = await dashboardService.getUserDashboard();
      if (dashboardData) {
        setDashboardData(dashboardData);
      }

      // Get user's tasks
      await loadUserTasks();

    } catch (error: any) {
      console.error("Failed to load dashboard:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const loadUserTasks = async () => {
    try {
      const userId = authService.getUserId();
      if (!userId) return;

      const tasks = await taskService.getAll();
      if (tasks) {
        // Filter tasks assigned to current user
        const userTasks = tasks.filter(
          (task: TaskDto) => task.assignedUserId === userId
        );
        setTasks(userTasks);
      }
    } catch (error) {
      console.error("Failed to load tasks:", error);
    }
  };

  const getTasksByState = (state: TaskState) => {
    return tasks.filter((task) => task.state === state).length;
  };

  const getOverdueTasks = () => {
    const now = new Date();
    return tasks.filter(
      (task) =>
        task.state !== "Completed" &&
        task.state !== "Cancelled" &&
        new Date(task.dueDate) < now
    ).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#00d9ff] mx-auto mb-4" />
          <p className="text-white">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Tasks",
      value: tasks.length,
      icon: CheckSquare,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "In Progress",
      value: getTasksByState("InProgress"),
      icon: TrendingUp,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "Completed",
      value: getTasksByState("Completed"),
      icon: CheckSquare,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Overdue",
      value: getOverdueTasks(),
      icon: Clock,
      color: "text-red-400",
      bgColor: "bg-red-500/10",
    },
    {
      title: "Notifications",
      value: dashboardData?.notifications || 0,
      icon: Bell,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Courses",
      value: "N/A",
      icon: BookOpen,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {userName}!
          </h1>
          <p className="text-gray-400">
            Here's an overview of your work and activities
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <GlassCard className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Recent Tasks Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Recent Tasks</h2>
              <Button
                onClick={() => router.push("/user/tasks")}
                className="bg-primary hover:bg-primary-dark"
              >
                View All
              </Button>
            </div>

            {tasks.length === 0 ? (
              <div className="text-center py-12">
                <CheckSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No tasks assigned yet</p>
                <p className="text-sm text-gray-500 mt-2">
                  New tasks will appear here when assigned to you
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="text-white font-medium mb-1">
                        {task.title}
                      </h3>
                      <p className="text-sm text-gray-400 line-clamp-1">
                        {task.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge
                      variant={
                        task.state === "Completed"
                          ? "default"
                          : task.state === "InProgress"
                          ? "secondary"
                          : "outline"
                      }
                      className="ml-4"
                    >
                      {task.state}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <GlassCard className="p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={() => router.push("/user/tasks")}
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2 border-white/20 hover:bg-white/10"
              >
                <CheckSquare className="w-8 h-8 text-blue-400" />
                <span className="text-white">Manage Tasks</span>
              </Button>
              <Button
                onClick={() => router.push("/user/courses")}
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2 border-white/20 hover:bg-white/10"
              >
                <BookOpen className="w-8 h-8 text-green-400" />
                <span className="text-white">Browse Courses</span>
              </Button>
              <Button
                onClick={() => router.push("/user/notifications")}
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2 border-white/20 hover:bg-white/10"
              >
                <Bell className="w-8 h-8 text-purple-400" />
                <span className="text-white">Notifications</span>
              </Button>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
