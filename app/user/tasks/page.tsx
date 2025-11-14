"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckSquare,
  Clock,
  Loader2,
  Filter,
  Calendar,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { authService } from "@/lib/services/authService";
import { taskService } from "@/lib/services/moduleServices";
import { toast } from "sonner";
import type { TaskDto, TaskState } from "@/lib/types/module.types";

export default function UserTasksPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<TaskDto[]>([]);
  const [filter, setFilter] = useState<TaskState | "all">("all");

  useEffect(() => {
    // Check authentication
    if (!authService.isAuthenticated()) {
      router.push("/login");
      return;
    }

    loadTasks();
  }, [router]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const userId = authService.getUserId();

      if (!userId) {
        toast.error("User ID not found");
        return;
      }

      const tasks = await taskService.getAll();

      if (tasks) {
        // Filter tasks assigned to current user
        const userTasks = tasks.filter(
          (task: TaskDto) => task.assignedUserId === userId
        );
        setTasks(userTasks);
      }
    } catch (error: any) {
      console.error("Failed to load tasks:", error);
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const updateTaskState = async (taskId: string, newState: TaskState) => {
    try {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      await taskService.update({
        id: taskId,
        title: task.title,
        description: task.description,
        state: newState,
        dueDate: task.dueDate,
      });

      toast.success(`Task marked as ${newState}`);
      await loadTasks();
    } catch (error: any) {
      console.error("Failed to update task:", error);
      toast.error("Failed to update task");
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    return task.state === filter;
  });

  const getTaskCount = (state: TaskState | "all") => {
    if (state === "all") return tasks.length;
    return tasks.filter((t) => t.state === state).length;
  };

  const getStateColor = (state: TaskState) => {
    switch (state) {
      case "Completed":
        return "bg-green-500/20 text-green-400 border-green-500/50";
      case "InProgress":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      case "Cancelled":
        return "bg-gray-500/20 text-gray-400 border-gray-500/50";
      case "Pending":
      default:
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#00d9ff] mx-auto mb-4" />
          <p className="text-white">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-white mb-2">My Tasks</h1>
          <p className="text-gray-400">Manage and track your assigned tasks</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <GlassCard className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-gray-400" />
              <h2 className="text-lg font-semibold text-white">Filter Tasks</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                onClick={() => setFilter("all")}
                className={
                  filter === "all"
                    ? "bg-primary"
                    : "border-white/20 hover:bg-white/10"
                }
              >
                All ({getTaskCount("all")})
              </Button>
              <Button
                variant={filter === "Pending" ? "default" : "outline"}
                onClick={() => setFilter("Pending")}
                className={
                  filter === "Pending"
                    ? "bg-yellow-500"
                    : "border-white/20 hover:bg-white/10"
                }
              >
                Pending ({getTaskCount("Pending")})
              </Button>
              <Button
                variant={filter === "InProgress" ? "default" : "outline"}
                onClick={() => setFilter("InProgress")}
                className={
                  filter === "InProgress"
                    ? "bg-blue-500"
                    : "border-white/20 hover:bg-white/10"
                }
              >
                In Progress ({getTaskCount("InProgress")})
              </Button>
              <Button
                variant={filter === "Completed" ? "default" : "outline"}
                onClick={() => setFilter("Completed")}
                className={
                  filter === "Completed"
                    ? "bg-green-500"
                    : "border-white/20 hover:bg-white/10"
                }
              >
                Completed ({getTaskCount("Completed")})
              </Button>
              <Button
                variant={filter === "Cancelled" ? "default" : "outline"}
                onClick={() => setFilter("Cancelled")}
                className={
                  filter === "Cancelled"
                    ? "bg-gray-500"
                    : "border-white/20 hover:bg-white/10"
                }
              >
                Cancelled ({getTaskCount("Cancelled")})
              </Button>
            </div>
          </GlassCard>
        </motion.div>

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <GlassCard className="p-12">
                <div className="text-center">
                  <CheckSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">No tasks found</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {filter === "all"
                      ? "You don't have any tasks assigned yet"
                      : `No tasks with status "${filter}"`}
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          ) : (
            filteredTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <GlassCard className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-white">
                          {task.title}
                        </h3>
                        <Badge
                          className={`${getStateColor(task.state)} border`}
                        >
                          {task.state}
                        </Badge>
                        {isOverdue(task.dueDate) &&
                          task.state !== "Completed" &&
                          task.state !== "Cancelled" && (
                            <Badge className="bg-red-500/20 text-red-400 border-red-500/50 border">
                              Overdue
                            </Badge>
                          )}
                      </div>
                      <p className="text-gray-300 mb-3">{task.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>
                            Created:{" "}
                            {new Date(task.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
                    {task.state === "Pending" && (
                      <Button
                        size="sm"
                        onClick={() => updateTaskState(task.id, "InProgress")}
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        Start Task
                      </Button>
                    )}
                    {task.state === "InProgress" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => updateTaskState(task.id, "Completed")}
                          className="bg-green-500 hover:bg-green-600"
                        >
                          Mark Complete
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateTaskState(task.id, "Pending")}
                          className="border-white/20 hover:bg-white/10"
                        >
                          Move to Pending
                        </Button>
                      </>
                    )}
                    {(task.state === "Pending" || task.state === "InProgress") && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateTaskState(task.id, "Cancelled")}
                        className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                      >
                        Cancel Task
                      </Button>
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
