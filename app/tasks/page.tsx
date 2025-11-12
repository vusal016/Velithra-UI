"use client"

import { useState } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Plus, Edit, Trash2, CheckCircle2, Clock, AlertCircle } from "lucide-react"

interface Task {
  id: string
  title: string
  description: string
  assignee: string
  priority: "high" | "medium" | "low"
  status: "completed" | "in-progress" | "pending"
  dueDate: string
}

const tasks: Task[] = [
  {
    id: "1",
    title: "Implement API authentication",
    description: "Add JWT authentication to API endpoints",
    assignee: "Sarah Johnson",
    priority: "high",
    status: "in-progress",
    dueDate: "2024-11-15",
  },
  {
    id: "2",
    title: "Design dashboard mockups",
    description: "Create UI designs for new dashboard",
    assignee: "Marcus Chen",
    priority: "high",
    status: "completed",
    dueDate: "2024-11-09",
  },
  {
    id: "3",
    title: "Setup database backups",
    description: "Configure automated daily backups",
    assignee: "Alex Rivera",
    priority: "medium",
    status: "pending",
    dueDate: "2024-11-12",
  },
  {
    id: "4",
    title: "Update documentation",
    description: "Update API documentation with new endpoints",
    assignee: "Emma Davis",
    priority: "low",
    status: "pending",
    dueDate: "2024-11-20",
  },
]

const statusIcons = {
  completed: <CheckCircle2 size={18} className="text-primary" />,
  "in-progress": <Clock size={18} className="text-yellow-400" />,
  pending: <AlertCircle size={18} className="text-red-400" />,
}

export default function TasksPage() {
  const [displayTasks] = useState(tasks)

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Task Manager</h1>
            <p className="text-muted mt-1">Manage project tasks and assignments</p>
          </div>
          <Button className="gap-2 bg-primary hover:bg-primary-dark text-background">
            <Plus size={18} />
            New Task
          </Button>
        </div>

        {/* Task Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              label: "Total Tasks",
              value: tasks.length,
              icon: <AlertCircle className="text-primary" />,
            },
            {
              label: "In Progress",
              value: tasks.filter((t) => t.status === "in-progress").length,
              icon: <Clock className="text-yellow-400" />,
            },
            {
              label: "Completed",
              value: tasks.filter((t) => t.status === "completed").length,
              icon: <CheckCircle2 className="text-primary" />,
            },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}>
              <GlassCard>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted uppercase">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                  </div>
                  {stat.icon}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {displayTasks.map((task, i) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <GlassCard active={task.status === "completed"}>
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="mt-1">{statusIcons[task.status]}</div>
                      <div>
                        <h3 className="font-semibold text-foreground">{task.title}</h3>
                        <p className="text-sm text-muted mt-1">{task.description}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Edit size={16} />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-400">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-xs text-muted">Assignee</p>
                        <p className="text-sm font-medium text-foreground">{task.assignee}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted">Priority</p>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            task.priority === "high"
                              ? "bg-red-500/20 text-red-400"
                              : task.priority === "medium"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-primary/20 text-primary"
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted">Due: {task.dueDate}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
