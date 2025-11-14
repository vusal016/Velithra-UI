"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { motion } from "framer-motion"
import { Plus, Edit, Trash2, CheckCircle2, Clock, AlertCircle, Loader2 } from "lucide-react"
import { taskService } from "@/lib/services/moduleServices"
import { userManagementService } from "@/lib/services/coreServices"
import { toast } from "@/hooks/use-toast"
import type { TaskDto, TaskCreateDto, TaskUpdateDto } from "@/lib/types"
import type { AppUserDto } from "@/lib/types/core.types"

const statusIcons = {
  Completed: <CheckCircle2 size={18} className="text-primary" />,
  InProgress: <Clock size={18} className="text-yellow-400" />,
  Pending: <AlertCircle size={18} className="text-red-400" />,
};
const priorityColors = {
  High: "bg-red-500/20 text-red-400",
  Medium: "bg-yellow-500/20 text-yellow-400",
  Low: "bg-primary/20 text-primary"
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<TaskDto[]>([]);
  const [displayTasks, setDisplayTasks] = useState<TaskDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskDto | null>(null);
  const [formData, setFormData] = useState<TaskCreateDto>({
    title: "",
    description: "",
    dueDate: "",
    assignedToUserId: ""
  });
  const [users, setUsers] = useState<AppUserDto[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<TaskDto | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadTasks();
    loadUsers();
  }, []);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const data = await taskService.getAll();
      setTasks(data);
      setDisplayTasks(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load tasks",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await userManagementService.getAll();
      setUsers(data);
    } catch {}
  };

  const handleCreate = () => {
    setIsEditMode(false);
    setSelectedTask(null);
    setFormData({
      title: "",
      description: "",
      dueDate: "",
      assignedToUserId: ""
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (task: TaskDto) => {
    setIsEditMode(true);
    setSelectedTask(task);
    setFormData({
      title: task.title,
      description: task.description || "",
      dueDate: task.dueDate?.split('T')[0] || "",
      assignedToUserId: task.assignedUserId || ""
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (isEditMode && selectedTask) {
        await taskService.update({
          id: selectedTask.id,
          ...formData
        } as TaskUpdateDto);
        toast({
          title: "Success",
          description: "Task updated successfully"
        });
      } else {
        await taskService.create(formData);
        toast({
          title: "Success",
          description: "Task created successfully"
        });
      }
      setIsDialogOpen(false);
      loadTasks();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save task",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await taskService.delete(deleteTarget.id);
      toast({
        title: "Success",
        description: "Task deleted successfully"
      });
      setShowDeleteModal(false);
      setDeleteTarget(null);
      loadTasks();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete task",
        variant: "destructive"
      });
    } finally {
      setDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Task Manager</h1>
            <p className="text-muted mt-1">Manage project tasks and assignments</p>
          </div>
          <Button onClick={handleCreate} className="gap-2 bg-primary hover:bg-primary-dark text-background">
            <Plus size={18} />
            New Task
          </Button>
        </div>

        {/* Task Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              label: "Total Tasks",
              value: tasks.length,
              icon: <AlertCircle className="text-primary" />,
            },
            {
              label: "Created",
              value: tasks.length,
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
              <GlassCard>
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="mt-1"><AlertCircle size={18} className="text-primary" /></div>
                      <div>
                        <h3 className="font-semibold text-foreground">{task.title}</h3>
                        <p className="text-sm text-muted mt-1">{task.description}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0"
                        onClick={() => handleEdit(task)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0 text-red-400"
                        onClick={() => { setDeleteTarget(task); setShowDeleteModal(true); }}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-xs text-muted">Created</p>
                        <p className="text-sm font-medium text-foreground">{new Date(task.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted">Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A"}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Create/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-background border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">
                {isEditMode ? "Edit Task" : "Create Task"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-foreground">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter task title"
                  className="bg-white/5 border-white/10 text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-foreground">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter task description"
                  className="bg-white/5 border-white/10 text-foreground"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate" className="text-foreground">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="bg-white/5 border-white/10 text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assignedToUserId" className="text-foreground">Assign To</Label>
                <Select
                  value={formData.assignedToUserId}
                  onValueChange={val => setFormData(f => ({ ...f, assignedToUserId: val }))}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-foreground">
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map(user => (
                      <SelectItem key={user.id} value={user.id} className="text-foreground">
                        {user.userName} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-primary hover:bg-primary-dark text-background">
                {isEditMode ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <Dialog open={showDeleteModal} onOpenChange={open => { setShowDeleteModal(open); if (!open) setDeleteTarget(null); }}>
          <DialogContent className="bg-background border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Confirm Deletion</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-muted">
                Are you sure you want to delete <strong>{deleteTarget?.title}</strong>?
              </p>
              <p className="text-muted text-sm mt-2">This action cannot be undone.</p>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setShowDeleteModal(false)} disabled={deleting}>
                Cancel
              </Button>
              <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-700" disabled={deleting}>
                {deleting ? <Loader2 className="animate-spin w-4 h-4" /> : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
