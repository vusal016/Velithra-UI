"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Save,
  Loader2,
  BookOpen,
  Clock,
  Users,
  FileText,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import { courseService, lessonService, enrollmentService } from "@/lib/services/api";
import { toast } from "sonner";
import type { CourseDto, LessonDto, EnrollmentDto } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function CourseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;

  const [course, setCourse] = useState<CourseDto | null>(null);
  const [lessons, setLessons] = useState<LessonDto[]>([]);
  const [enrollments, setEnrollments] = useState<EnrollmentDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Lesson dialogs
  const [showLessonDialog, setShowLessonDialog] = useState(false);
  const [editingLesson, setEditingLesson] = useState<LessonDto | null>(null);
  const [lessonForm, setLessonForm] = useState({ title: "", content: "" });
  const [isSubmittingLesson, setIsSubmittingLesson] = useState(false);
  const [deletingLessonId, setDeletingLessonId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    durationInHours: 1,
  });

  useEffect(() => {
    loadCourseData();
  }, [courseId]);

  const loadCourseData = async () => {
    try {
      setIsLoading(true);
      const [courseRes, lessonsRes, enrollmentsRes] = await Promise.all([
        courseService.getById(courseId),
        lessonService.getByCourse(courseId),
        enrollmentService.getByCourse(courseId),
      ]);

      const courseData = courseRes.data.data || courseRes.data;
      const lessonsData = lessonsRes.data.data || lessonsRes.data || [];
      const enrollmentsData = enrollmentsRes.data.data || enrollmentsRes.data || [];

      setCourse(courseData);
      setLessons(Array.isArray(lessonsData) ? lessonsData : []);
      setEnrollments(Array.isArray(enrollmentsData) ? enrollmentsData : []);

      setFormData({
        title: courseData.title,
        description: courseData.description || "",
        durationInHours: (courseData as any).durationInHours || 1,
      });
    } catch (error: any) {
      console.error("Failed to load course data:", error);
      toast.error("Failed to load course data");
      router.push("/dashboard/courses");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!course) return;

    try {
      setIsSaving(true);
      const updateData: any = {
        title: formData.title,
        description: formData.description,
        durationInHours: formData.durationInHours,
      };
      await courseService.update(courseId, updateData);
      toast.success("Course updated successfully");
      setIsEditing(false);
      loadCourseData();
    } catch (error: any) {
      console.error("Failed to update course:", error);
      toast.error(error.response?.data?.message || "Failed to update course");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateLesson = () => {
    setEditingLesson(null);
    setLessonForm({ title: "", content: "" });
    setShowLessonDialog(true);
  };

  const handleEditLesson = (lesson: LessonDto) => {
    setEditingLesson(lesson);
    setLessonForm({ title: lesson.title, content: lesson.content });
    setShowLessonDialog(true);
  };

  const handleSaveLesson = async () => {
    if (!lessonForm.title || !lessonForm.content) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setIsSubmittingLesson(true);
      if (editingLesson) {
        await lessonService.update(editingLesson.id, lessonForm);
        toast.success("Lesson updated successfully");
      } else {
        await lessonService.create({
          ...lessonForm,
          courseId: courseId,
        });
        toast.success("Lesson created successfully");
      }
      setShowLessonDialog(false);
      loadCourseData();
    } catch (error: any) {
      console.error("Failed to save lesson:", error);
      toast.error(error.response?.data?.message || "Failed to save lesson");
    } finally {
      setIsSubmittingLesson(false);
    }
  };

  const handleDeleteLesson = async () => {
    if (!deletingLessonId) return;

    try {
      await lessonService.delete(deletingLessonId);
      toast.success("Lesson deleted successfully");
      setDeletingLessonId(null);
      loadCourseData();
    } catch (error: any) {
      console.error("Failed to delete lesson:", error);
      toast.error(error.response?.data?.message || "Failed to delete lesson");
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-[#00d9ff] mx-auto mb-4" />
            <p className="text-white">Loading course...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!course) return null;

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/dashboard/courses")}
              className="gap-2"
            >
              <ArrowLeft size={18} />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">{course.title}</h1>
              <p className="text-gray-300 mt-1">Course Details & Management</p>
            </div>
          </div>
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              className="gap-2 bg-[#00d9ff] hover:bg-[#0099cc] text-[#0a1628]"
            >
              <Edit size={18} />
              Edit Course
            </Button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              label: "Duration",
              value: `${(course as any).durationInHours || 0}h`,
              icon: Clock,
              color: "text-blue-400",
            },
            {
              label: "Lessons",
              value: lessons.length,
              icon: FileText,
              color: "text-green-400",
            },
            {
              label: "Enrolled",
              value: enrollments.length,
              icon: Users,
              color: "text-purple-400",
            },
            {
              label: "Status",
              value: "Active",
              icon: BookOpen,
              color: "text-[#00d9ff]",
            },
          ].map((stat, i) => (
            <GlassCard key={i}>
              <div className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                  <stat.icon size={20} className={stat.color} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase">{stat.label}</p>
                  <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="details" className="space-y-6">
          <TabsList className="bg-white/5 border border-white/10">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="lessons">Lessons ({lessons.length})</TabsTrigger>
            <TabsTrigger value="enrollments">Enrollments ({enrollments.length})</TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details">
            <GlassCard>
              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-white">
                    Course Title
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    disabled={!isEditing}
                    className="bg-white/5 border-white/10 text-white disabled:opacity-50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    disabled={!isEditing}
                    rows={5}
                    className="bg-white/5 border-white/10 text-white disabled:opacity-50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-white">
                    Duration (hours)
                  </Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    value={formData.durationInHours}
                    onChange={(e) =>
                      setFormData({ ...formData, durationInHours: Number(e.target.value) })
                    }
                    disabled={!isEditing}
                    className="bg-white/5 border-white/10 text-white disabled:opacity-50"
                  />
                </div>

                {isEditing && (
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex-1 bg-[#00d9ff] hover:bg-[#0099cc] text-[#0a1628] gap-2"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="animate-spin" size={18} />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={18} />
                          Save Changes
                        </>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          title: course.title,
                          description: course.description || "",
                          durationInHours: (course as any).durationInHours || 1,
                        });
                      }}
                      disabled={isSaving}
                      className="text-white"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </GlassCard>
          </TabsContent>

          {/* Lessons Tab */}
          <TabsContent value="lessons">
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button
                  onClick={handleCreateLesson}
                  className="gap-2 bg-[#00d9ff] hover:bg-[#0099cc] text-[#0a1628]"
                >
                  <Plus size={18} />
                  Add Lesson
                </Button>
              </div>

              {lessons.length === 0 ? (
                <GlassCard>
                  <div className="p-12 text-center">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-50" />
                    <p className="text-gray-300 text-lg">No lessons yet</p>
                    <p className="text-gray-400 text-sm mt-2">
                      Create your first lesson to start building this course
                    </p>
                  </div>
                </GlassCard>
              ) : (
                <div className="space-y-3">
                  {lessons.map((lesson, index) => (
                    <GlassCard key={lesson.id}>
                      <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-8 h-8 rounded-full bg-[#00d9ff]/20 flex items-center justify-center">
                            <span className="text-[#00d9ff] font-semibold text-sm">
                              {index + 1}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-white font-semibold">{lesson.title}</h4>
                            <p className="text-gray-400 text-sm line-clamp-1">
                              {lesson.content}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditLesson(lesson)}
                            className="text-white"
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setDeletingLessonId(lesson.id)}
                            className="text-red-400"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Enrollments Tab */}
          <TabsContent value="enrollments">
            {enrollments.length === 0 ? (
              <GlassCard>
                <div className="p-12 text-center">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-50" />
                  <p className="text-gray-300 text-lg">No enrollments yet</p>
                  <p className="text-gray-400 text-sm mt-2">
                    Students will appear here once they enroll
                  </p>
                </div>
              </GlassCard>
            ) : (
              <GlassCard>
                <div className="p-6">
                  <div className="space-y-3">
                    {enrollments.map((enrollment) => (
                      <div
                        key={enrollment.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-white/5"
                      >
                        <div>
                          <p className="text-white font-medium">
                            {enrollment.employeeName || enrollment.userId || "Unknown User"}
                          </p>
                          <p className="text-gray-400 text-sm">
                            Enrolled: {new Date(enrollment.enrolledAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              enrollment.status === "Completed"
                                ? "bg-green-500/20 text-green-400"
                                : enrollment.status === "Active"
                                ? "bg-blue-500/20 text-blue-400"
                                : "bg-gray-500/20 text-gray-400"
                            }`}
                          >
                            {enrollment.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </GlassCard>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Lesson Dialog */}
      <Dialog open={showLessonDialog} onOpenChange={setShowLessonDialog}>
        <DialogContent className="bg-[#1a2332] border-white/10 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingLesson ? "Edit Lesson" : "Create Lesson"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="lesson-title" className="text-white">
                Lesson Title *
              </Label>
              <Input
                id="lesson-title"
                value={lessonForm.title}
                onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
                placeholder="Enter lesson title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lesson-content" className="text-white">
                Content *
              </Label>
              <Textarea
                id="lesson-content"
                value={lessonForm.content}
                onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
                placeholder="Enter lesson content"
                rows={8}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setShowLessonDialog(false)}
              disabled={isSubmittingLesson}
              className="text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveLesson}
              disabled={isSubmittingLesson}
              className="bg-[#00d9ff] hover:bg-[#0099cc] text-[#0a1628]"
            >
              {isSubmittingLesson ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} />
                  Saving...
                </>
              ) : editingLesson ? (
                "Update"
              ) : (
                "Create"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Lesson Dialog */}
      <AlertDialog
        open={!!deletingLessonId}
        onOpenChange={() => setDeletingLessonId(null)}
      >
        <AlertDialogContent className="bg-[#1a2332] border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Lesson</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              Are you sure you want to delete this lesson? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 text-white hover:bg-white/10 border-white/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteLesson}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
