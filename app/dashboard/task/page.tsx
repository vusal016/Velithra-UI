"use client"

import { useState } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface Task {
  id: string
  title: string
  status: "pending" | "in-progress" | "completed"
  assignee: string
  deadline: string
  priority: "low" | "medium" | "high"
}

const tasks: Task[] = [
  {
    id: "1",
    title: "Design dashboard mockups",
    status: "in-progress",
    assignee: "John Doe",
    deadline: "2025-11-15",
    priority: "high",
  },
  {
    id: "2",
    title: "API integration",
    status: "pending",
    assignee: "Jane Smith",
    deadline: "2025-11-20",
    priority: "high",
  },
  {
    id: "3",
    title: "Testing phase",
    status: "pending",
    assignee: "Bob Johnson",
    deadline: "2025-11-25",
    priority: "medium",
  },
]

export default function TaskManagerPage() {
  const [taskList] = useState<Task[]>(tasks)

  const statusGroups = {
    pending: taskList.filter((t) => t.status === "pending"),
    "in-progress": taskList.filter((t) => t.status === "in-progress"),
    completed: taskList.filter((t) => t.status === "completed"),
  }

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500/20 text-yellow-400",
    "in-progress": "bg-blue-500/20 text-blue-400",
    completed: "bg-green-500/20 text-green-400",
  }

  return (
    <div className="space-y-8 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Task Manager</h1>
        <Button className="gap-2 bg-[#00d9ff] hover:bg-[#0099cc] text-[#0a1628] shadow-lg shadow-[#00d9ff]/30">
          <Plus size={18} /> Add Task
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(statusGroups).map(([status, items]) => (
          <GlassCard key={status}>
            <div className="p-6 space-y-4">
              <h2 className="text-lg font-semibold text-foreground capitalize">{status.replace("-", " ")}</h2>
              <div className="space-y-3">
                {items.length === 0 ? (
                  <p className="text-sm text-[#6b8ca8]">No tasks</p>
                ) : (
                  items.map((task) => (
                    <div key={task.id} className="p-3 bg-white/5 rounded-lg border border-white/10 space-y-2">
                      <p className="font-medium text-foreground text-sm">{task.title}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className={`px-2 py-1 rounded ${statusColors[task.status]}`}>
                          {task.priority.toUpperCase()}
                        </span>
                        <span className="text-[#6b8ca8]">{task.deadline}</span>
                      </div>
                      <p className="text-xs text-[#6b8ca8]">{task.assignee}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
