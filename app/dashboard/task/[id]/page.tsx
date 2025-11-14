/**
 * Velithra - Task Detail & Edit Page
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Save, Loader2, MessageSquare, Send, User, Calendar, AlertCircle } from 'lucide-react';
import { taskService, userService } from '@/lib/services/api';
import type { TaskDto, TaskUpdateDto, TaskCommentDto, TaskState } from '@/lib/types';
import { toast } from 'sonner';

const taskStateColors: Record<TaskState, string> = {
  Pending: 'bg-yellow-500/20 text-yellow-500',
  InProgress: 'bg-blue-500/20 text-blue-500',
  Completed: 'bg-green-500/20 text-green-500',
  OnHold: 'bg-orange-500/20 text-orange-500',
  Cancelled: 'bg-red-500/20 text-red-500',
};

export default function TaskDetailPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [task, setTask] = useState<TaskDto | null>(null);
  const [comments, setComments] = useState<TaskCommentDto[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [sendingComment, setSendingComment] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    state: 'Pending' as TaskState,
  });

  useEffect(() => {
    if (taskId) {
      loadTask();
      loadComments();
      loadUsers();
    }
  }, [taskId]);

  const loadTask = async () => {
    try {
      setLoading(true);
      const response = await taskService.getById(taskId);
      const data = response.data.data || response.data;
      setTask(data);
      setFormData({
        title: data.title,
        description: data.description || '',
        deadline: data.deadline.split('T')[0],
        state: data.state,
      });
    } catch (error: any) {
      console.error('Failed to load task:', error);
      toast.error('Failed to load task details');
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const response = await taskService.getComments(taskId);
      const data = response.data.data || response.data || [];
      setComments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load comments:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await userService.getAll();
      const data = response.data.data || response.data || [];
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error('Task title is required');
      return;
    }

    try {
      setSaving(true);
      await taskService.update(taskId, {
        title: formData.title,
        description: formData.description,
        deadline: new Date(formData.deadline).toISOString(),
        state: formData.state,
      });
      toast.success('Task updated successfully');
      loadTask();
    } catch (error: any) {
      console.error('Failed to update task:', error);
      toast.error('Failed to update task', {
        description: error.response?.data?.message || error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      setSendingComment(true);
      await taskService.addComment({
        taskId,
        content: newComment,
      });
      setNewComment('');
      toast.success('Comment added');
      loadComments();
    } catch (error) {
      console.error('Failed to add comment:', error);
      toast.error('Failed to add comment');
    } finally {
      setSendingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-[#00d9ff]" size={48} />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="p-8">
        <GlassCard className="p-12 text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Task Not Found</h2>
          <p className="text-muted-foreground mb-6">The task you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/dashboard/task')}>
            <ArrowLeft size={16} className="mr-2" />
            Back to Tasks
          </Button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#0a1628] via-[#0f1f35] to-[#0a1628]">
      <div className="flex-1 ml-16 overflow-y-auto">
        <div className="p-8 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => router.push('/dashboard/task')}>
                <ArrowLeft size={20} />
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Task Details</h1>
                <p className="text-muted-foreground">View and edit task information</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge className={taskStateColors[task.state]}>
                {task.state}
              </Badge>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={16} />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} className="mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              <GlassCard className="p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Task Information</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Task title"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Task description"
                      rows={6}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="deadline">Deadline</Label>
                      <Input
                        id="deadline"
                        type="date"
                        value={formData.deadline}
                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="state">Status</Label>
                      <Select
                        value={formData.state}
                        onValueChange={(value) => setFormData({ ...formData, state: value as TaskState })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="InProgress">In Progress</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="OnHold">On Hold</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Comments Section */}
              <GlassCard className="p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <MessageSquare size={20} />
                  Comments ({comments.length})
                </h2>

                <div className="space-y-4 mb-4">
                  {comments.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No comments yet</p>
                  ) : (
                    comments.map((comment) => (
                      <div key={comment.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-full bg-[#00d9ff]/20">
                            <User size={16} className="text-[#00d9ff]" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-foreground">{comment.authorName || 'Unknown'}</span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(comment.createdAt).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-muted-foreground">{comment.content}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <Separator className="my-4" />

                <div className="flex gap-2">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    rows={2}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.ctrlKey) {
                        handleAddComment();
                      }
                    }}
                  />
                  <Button onClick={handleAddComment} disabled={sendingComment || !newComment.trim()}>
                    {sendingComment ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <Send size={16} />
                    )}
                  </Button>
                </div>
              </GlassCard>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <GlassCard className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Task Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-muted-foreground" />
                    <span className="text-muted-foreground">Created:</span>
                    <span className="font-medium text-foreground">
                      {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {task.updatedAt && (
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-muted-foreground" />
                      <span className="text-muted-foreground">Updated:</span>
                      <span className="font-medium text-foreground">
                        {new Date(task.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-muted-foreground" />
                    <span className="text-muted-foreground">Assigned to:</span>
                    <span className="font-medium text-foreground">
                      {task.assignedUserName || 'Unassigned'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare size={16} className="text-muted-foreground" />
                    <span className="text-muted-foreground">Comments:</span>
                    <span className="font-medium text-foreground">{task.commentCount}</span>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
