/**
 * Velithra - Task Create Page
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { taskService, userService } from '@/lib/services/api';
import type { TaskState } from '@/lib/types';
import { toast } from 'sonner';

export default function TaskCreatePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [users, setUsers] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedUserId: '',
    deadline: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await userService.getAll();
      const data = response.data.data || response.data || [];
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Task title is required');
      return;
    }

    if (!formData.assignedUserId) {
      toast.error('Please assign the task to a user');
      return;
    }

    try {
      setSaving(true);
      const response = await taskService.create({
        title: formData.title,
        description: formData.description || '',
        deadline: new Date(formData.deadline).toISOString(),
        assignedUserId: formData.assignedUserId,
      });
      toast.success('Task created successfully');
      router.push('/dashboard/task');
    } catch (error: any) {
      console.error('Failed to create task:', error);
      toast.error('Failed to create task', {
        description: error.response?.data?.message || error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#0a1628] via-[#0f1f35] to-[#0a1628]">
      <div className="flex-1 ml-16 overflow-y-auto">
        <div className="p-8 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push('/dashboard/task')}>
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Create New Task</h1>
              <p className="text-muted-foreground">Add a new task to the system</p>
            </div>
          </div>

          <div className="max-w-3xl">
            <form onSubmit={handleSubmit}>
              <GlassCard className="p-6">
                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <Label htmlFor="title" className="text-base">
                      Task Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter task title"
                      className="mt-2"
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      A clear, concise title for the task
                    </p>
                  </div>

                  {/* Description */}
                  <div>
                    <Label htmlFor="description" className="text-base">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter task description"
                      className="mt-2"
                      rows={6}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Detailed description of what needs to be done
                    </p>
                  </div>

                  {/* Deadline & Assigned User */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="deadline" className="text-base">
                        Deadline <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="deadline"
                        type="date"
                        value={formData.deadline}
                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                        className="mt-2"
                        required
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        When this task should be completed
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="assignedUserId" className="text-base">
                        Assign To <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.assignedUserId}
                        onValueChange={(value) => setFormData({ ...formData, assignedUserId: value })}
                        required
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select a user" />
                        </SelectTrigger>
                        <SelectContent>
                          {users.length === 0 ? (
                            <SelectItem value="no-users" disabled>
                              No users available
                            </SelectItem>
                          ) : (
                            users.map((user) => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.fullName || user.userName || user.email}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-1">
                        Who will be responsible for this task
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t border-white/10">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push('/dashboard/task')}
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={saving}>
                      {saving ? (
                        <>
                          <Loader2 className="animate-spin mr-2" size={16} />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Save size={16} className="mr-2" />
                          Create Task
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
