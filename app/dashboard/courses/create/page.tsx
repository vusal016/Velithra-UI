"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Loader2, BookOpen } from "lucide-react";
import { courseService } from "@/lib/services/api";
import { toast } from "sonner";

export default function CreateCoursePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    durationInHours: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || formData.durationInHours < 1) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setIsSubmitting(true);
      const courseData: any = {
        title: formData.title,
        description: formData.description,
        durationInHours: formData.durationInHours,
      };
      await courseService.create(courseData);
      toast.success("Course created successfully!");
      router.push("/dashboard/courses");
    } catch (error: any) {
      console.error("Failed to create course:", error);
      toast.error(
        error.response?.data?.message || error.message || "Failed to create course"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
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
            <h1 className="text-3xl font-bold text-white">Create New Course</h1>
            <p className="text-gray-300 mt-1">Add a new training course</p>
          </div>
        </div>

        {/* Form */}
        <GlassCard>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-[#00d9ff]/20 flex items-center justify-center">
                <BookOpen size={40} className="text-[#00d9ff]" />
              </div>
            </div>

            {/* Course Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white">
                Course Title <span className="text-red-400">*</span>
              </Label>
              <Input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Advanced React Development"
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-white">
                Description <span className="text-red-400">*</span>
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter a detailed description of the course..."
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                rows={5}
                required
              />
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-white">
                Duration (hours) <span className="text-red-400">*</span>
              </Label>
              <Input
                id="duration"
                type="number"
                min="1"
                value={formData.durationInHours}
                onChange={(e) =>
                  setFormData({ ...formData, durationInHours: Number(e.target.value) })
                }
                placeholder="0"
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                required
              />
              <p className="text-gray-400 text-sm">
                Estimated time to complete the entire course
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-[#00d9ff] hover:bg-[#0099cc] text-[#0a1628] font-semibold gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Create Course
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push("/dashboard/courses")}
                disabled={isSubmitting}
                className="text-white"
              >
                Cancel
              </Button>
            </div>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}
