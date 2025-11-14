"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Loader2 } from "lucide-react"
import { taskService, userService } from "@/lib/services/api"
import type { TaskDto, TaskCreateDto, TaskState } from "@/lib/types"
import { toast } from "sonner"

export default function TaskManagerPage() {
  const router = useRouter()
  const [taskList, setTaskList] = useState<TaskDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [users, setUsers] = useState<any[]>([])
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedToUserId: "",
    dueDate: "",
    priority: "Medium",
    state: "Pending"
  })

  useEffect(() => {
    loadTasks()
    loadUsers()
  }, [])

  const loadTasks = async () => {
    try {
      setIsLoading(true)
      const response = await taskService.getAll()
      const data = response.data.data || response.data || []
      console.log("Tasks loaded:", data)
      setTaskList(Array.isArray(data) ? data : [])
    } catch (error: any) {
      console.error("Task load error:", error)
      toast.error("Failed to load tasks", {
        description: error.response?.data?.message || error.message || "Please try again later"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadUsers = async () => {
    try {
      const response = await userService.getAll()
      const data = response.data.data || response.data || []
      setUsers(Array.isArray(data) ? data : [])
    } catch (error: any) {
      console.error("Failed to load users:", error)
    }
  }

  const handleCreateOpen = () => {
    setFormData({
      title: "",
      description: "",
      assignedToUserId: "",
      dueDate: new Date().toISOString().split('T')[0],
      priority: "Medium",
      state: "Pending"
    })
    setCreateOpen(true)
  }

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      toast.error("Task title is required")
      return
    }

    try {
      setIsSubmitting(true)
      console.log("Creating task:", formData)
      
      await taskService.create({
        title: formData.title,
        description: formData.description || '',
        deadline: formData.dueDate ? new Date(formData.dueDate).toISOString() : new Date().toISOString(),
        assignedUserId: formData.assignedToUserId || ''
      })
      
      toast.success("Task created successfully!", {
        description: `Task "${formData.title}" has been created`
      })
      
      setCreateOpen(false)
      loadTasks()
    } catch (error: any) {
      console.error("Task creation error:", error)
      toast.error("Failed to create task", {
        description: error.message || "Please try again"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return

    try {
      setDeletingId(taskId)
      console.log("Deleting task:", taskId)
      await taskService.delete(taskId)
      toast.success("Task deleted successfully!", {
        description: "Task has been removed from the system"
      })
      loadTasks()
    } catch (error: any) {
      console.error("Task delete error:", error)
      toast.error("Failed to delete task", {
        description: error.message || "Please try again"
      })
    } finally {
      setDeletingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-[#00d9ff]" size={48} />
      </div>
    )
  }

  const statusGroups = {
    Pending: taskList.filter((t) => t.state === "Pending"),
    InProgress: taskList.filter((t) => t.state === "InProgress"),
    Completed: taskList.filter((t) => t.state === "Completed"),
  }

  const statusColors: Record<string, string> = {
    Pending: "bg-yellow-500/20 text-yellow-400",
    InProgress: "bg-blue-500/20 text-blue-400",
    Completed: "bg-green-500/20 text-green-400",
  }

  return (
    <div className="space-y-8 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Task Manager</h1>
        <Button 
          onClick={handleCreateOpen}
          className="gap-2 bg-[#00d9ff] hover:bg-[#0099cc] text-[#0a1628] shadow-lg shadow-[#00d9ff]/30"
        >
          <Plus size={18} /> Add Task
        </Button>
      </div>

      {taskList.length === 0 ? (
        <GlassCard>
          <div className="p-12 text-center">
            <h3 className="text-xl font-semibold text-foreground mb-2">No tasks found</h3>
            <p className="text-[#6b8ca8] mb-6">Create your first task to get started</p>
            <Button 
              onClick={handleCreateOpen}
              className="bg-[#00d9ff] hover:bg-[#0099cc] text-[#0a1628]"
            >
              <Plus size={18} className="mr-2" />
              Create Task
            </Button>
          </div>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(statusGroups).map(([status, items]) => (
            <GlassCard key={status}>
              <div className="p-6 space-y-4">
                <h2 className="text-lg font-semibold text-foreground">{status.replace(/([A-Z])/g, ' $1').trim()}</h2>
                <div className="space-y-3">
                  {items.length === 0 ? (
                    <p className="text-sm text-[#6b8ca8]">No tasks</p>
                  ) : (
                    items.map((task) => (
                      <div key={task.id} className="p-3 bg-white/5 rounded-lg border border-white/10 space-y-2">
                        <p className="font-medium text-foreground text-sm">{task.title}</p>
                        <p className="text-xs text-[#6b8ca8] line-clamp-2">{task.description}</p>
                        <div className="flex items-center justify-between text-xs">
                          <span className={`px-2 py-1 rounded ${statusColors[status as keyof typeof statusColors]}`}>
                            {status}
                          </span>
                          <span className="text-[#6b8ca8]">{new Date(task.deadline).toLocaleDateString()}</span>
                        </div>
                        <div className="flex gap-2 pt-2 border-t border-white/5">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="flex-1 h-7 text-xs"
                            onClick={() => router.push(`/dashboard/task/${task.id}`)}
                          >
                            <Edit size={14} className="mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="flex-1 h-7 text-xs text-red-400 hover:text-red-300"
                            onClick={() => handleDelete(task.id)}
                            disabled={deletingId === task.id}
                          >
                            {deletingId === task.id ? (
                              <Loader2 className="animate-spin" size={14} />
                            ) : (
                              <>
                                <Trash2 size={14} className="mr-1" />
                                Delete
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Create Task Modal */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="bg-[#1a2332] border-white/10 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white text-2xl">Create New Task</DialogTitle>
            <DialogDescription className="text-gray-400">
              Add a new task to your project
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white">
                Task Title <span className="text-red-400">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter task title"
                className="bg-white/5 border-white/10 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-white">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter task description"
                className="bg-white/5 border-white/10 text-white min-h-[100px]"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority" className="text-white">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2332] border-white/10">
                    <SelectItem value="Low" className="text-white">Low</SelectItem>
                    <SelectItem value="Medium" className="text-white">Medium</SelectItem>
                    <SelectItem value="High" className="text-white">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="state" className="text-white">Status</Label>
                <Select
                  value={formData.state}
                  onValueChange={(value) => setFormData({ ...formData, state: value })}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2332] border-white/10">
                    <SelectItem value="Pending" className="text-white">Pending</SelectItem>
                    <SelectItem value="InProgress" className="text-white">In Progress</SelectItem>
                    <SelectItem value="Completed" className="text-white">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dueDate" className="text-white">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="assignedTo" className="text-white">Assign To</Label>
                <Select
                  value={formData.assignedToUserId}
                  onValueChange={(value) => setFormData({ ...formData, assignedToUserId: value })}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2332] border-white/10">
                    <SelectItem value="unassigned" className="text-gray-400">Unassigned</SelectItem>
                    {users.map(user => (
                      <SelectItem key={user.id} value={user.id} className="text-white">
                        {user.userName || user.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setCreateOpen(false)}
                disabled={isSubmitting}
                className="text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#00d9ff] hover:bg-[#0099cc] text-[#0a1628]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={16} />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus size={16} className="mr-2" />
                    Create Task
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
