"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Plus, Search, Edit, Trash2, BookOpen, Loader2, Clock } from "lucide-react";
import { courseService } from "@/lib/services/api";
import type { CourseDto } from "@/lib/types";
import { toast } from "sonner";

export default function AdminCoursesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [courses, setCourses] = useState<CourseDto[]>([]);
  const [displayCourses, setDisplayCourses] = useState<CourseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CourseDto | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    durationInHours: 1,
  });

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setIsLoading(true);
      const response = await courseService.getAll();
      const data = response.data.data || response.data || [];
      setCourses(Array.isArray(data) ? data : []);
      setDisplayCourses(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('Failed to load courses:', error);
      toast.error("Failed to load courses", {
        description: error.response?.data?.message || error.message || "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setDisplayCourses(
      courses.filter(
        (c) =>
          c.title.toLowerCase().includes(term.toLowerCase()) ||
          (c.description && c.description.toLowerCase().includes(term.toLowerCase()))
      )
    );
  };

  const handleCreate = () => {
    setIsEditMode(false);
    setSelectedCourse(null);
    setFormData({
      title: "",
      description: "",
      durationInHours: 1,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (course: CourseDto) => {
    setIsEditMode(true);
    setSelectedCourse(course);
    setFormData({
      title: course.title,
      description: course.description || '',
      durationInHours: (course as any).durationInHours || 1,
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (isEditMode && selectedCourse) {
        const updateData: any = {
          title: formData.title,
          description: formData.description,
          durationInHours: formData.durationInHours,
        };
        await courseService.update(selectedCourse.id, updateData);
        toast.success("Course updated successfully");
      } else {
        const createData: any = {
          title: formData.title,
          description: formData.description,
          durationInHours: formData.durationInHours,
        };
        await courseService.create(createData);
        toast.success("Course created successfully");
      }
      setIsDialogOpen(false);
      loadCourses();
    } catch (error: any) {
      console.error('Failed to save course:', error);
      toast.error("Failed to save course", {
        description: error.response?.data?.message || error.message || "Please try again",
      });
    }
  };

  const handleDelete = async (courseId: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;

    try {
      await courseService.delete(courseId);
      toast.success("Course deleted successfully");
      loadCourses();
    } catch (error: any) {
      console.error('Failed to delete course:', error);
      toast.error("Failed to delete course", {
        description: error.response?.data?.message || error.message || "Please try again",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-foreground">Loading courses...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Course Management</h1>
            <p className="text-muted mt-1">Manage training courses and learning materials</p>
          </div>
          <Button onClick={() => router.push("/dashboard/courses/create")} className="gap-2 bg-primary hover:bg-primary-dark text-background">
            <Plus size={18} />
            Add Course
          </Button>
        </div>

        {/* Search Bar */}
        <GlassCard>
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 bg-white/5 border-white/10"
              />
            </div>
          </div>
        </GlassCard>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              label: "Total Courses",
              value: courses.length,
              color: "text-primary",
              icon: BookOpen,
            },
            {
              label: "Total Hours",
              value: courses.reduce((sum, c) => sum + ((c as any).durationInHours || 0), 0),
              color: "text-blue-400",
              icon: Clock,
            },
            {
              label: "Active Courses",
              value: courses.length,
              color: "text-green-400",
              icon: BookOpen,
            },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}>
              <GlassCard>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted uppercase">{stat.label}</p>
                    <p className={`text-2xl font-bold ${stat.color} mt-2`}>{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color} opacity-50`} />
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayCourses.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <GlassCard className="h-full flex flex-col">
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-2">{course.title}</h3>
                      <p className="text-sm text-muted line-clamp-3">{course.description}</p>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted">
                        <Clock size={16} />
                        <span>{(course as any).durationInHours || 0}h</span>
                      </div>
                      <div className="text-xs text-muted">
                        {new Date(course.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="flex-1 hover:bg-primary/10 hover:text-primary"
                        onClick={() => router.push(`/dashboard/course/${course.id}`)}
                      >
                        <Edit size={14} className="mr-2" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="flex-1 hover:bg-red-500/10 hover:text-red-400"
                        onClick={() => handleDelete(course.id)}
                      >
                        <Trash2 size={14} className="mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {displayCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-muted mx-auto mb-4 opacity-50" />
            <p className="text-muted text-lg">No courses found</p>
            <p className="text-sm text-muted mt-2">Create your first course to get started</p>
          </div>
        )}

        {/* Create/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-background border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">{isEditMode ? "Edit Course" : "Add Course"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-foreground">
                  Course Title *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter course title"
                  className="bg-white/5 border-white/10 text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-foreground">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter course description"
                  className="bg-white/5 border-white/10 text-foreground"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration" className="text-foreground">
                  Duration (hours) *
                </Label>
                <Input
                  id="duration"
                  type="number"
                  min="0"
                  value={formData.durationInHours}
                  onChange={(e) => setFormData({ ...formData, durationInHours: Number(e.target.value) })}
                  placeholder="0"
                  className="bg-white/5 border-white/10 text-foreground"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-primary hover:bg-primary-dark text-background"
                disabled={!formData.title || !formData.description || formData.durationInHours < 1}
              >
                {isEditMode ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
