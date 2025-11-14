"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Plus, BookOpen, Edit, Trash2, Loader2 } from "lucide-react"
import { courseService } from "@/lib/services/moduleServices"
import { CourseDto } from "@/lib/types/module.types"
import { toast } from "sonner"

const difficultyColors: Record<string, string> = {
  Beginner: "bg-green-500/20 text-green-400",
  Intermediate: "bg-blue-500/20 text-blue-400",
  Advanced: "bg-red-500/20 text-red-400",
}

export default function CourseManagerPage() {
  const router = useRouter()
  const [courseList, setCourseList] = useState<CourseDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    try {
      setIsLoading(true)
      const data = await courseService.getAll()
      setCourseList(data)
    } catch (error: any) {
      toast.error("Failed to load courses", {
        description: error.message || "Please try again later"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (courseId: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return

    try {
      setDeletingId(courseId)
      await courseService.delete(courseId)
      toast.success("Course deleted successfully")
      loadCourses()
    } catch (error: any) {
      toast.error("Failed to delete course", {
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

  return (
    <div className="space-y-8 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Learning Hub</h1>
        <Button 
          onClick={() => router.push("/dashboard/course/create")}
          className="gap-2 bg-[#00d9ff] hover:bg-[#0099cc] text-[#0a1628] shadow-lg shadow-[#00d9ff]/30"
        >
          <Plus size={18} /> Add Course
        </Button>
      </div>

      {courseList.length === 0 ? (
        <GlassCard>
          <div className="p-12 text-center">
            <BookOpen className="mx-auto mb-4 text-[#6b8ca8]" size={64} />
            <h3 className="text-xl font-semibold text-foreground mb-2">No courses found</h3>
            <p className="text-[#6b8ca8] mb-6">Create your first course to get started</p>
            <Button 
              onClick={() => router.push("/dashboard/course/create")}
              className="bg-[#00d9ff] hover:bg-[#0099cc] text-[#0a1628]"
            >
              <Plus size={18} className="mr-2" />
              Create Course
            </Button>
          </div>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courseList.map((course) => (
            <GlassCard key={course.id}>
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{course.title}</h3>
                    <p className="text-xs text-[#6b8ca8] mt-1">{course.description}</p>
                  </div>
                  <div style={{ color: "#00d9ff" }}>
                    <BookOpen size={20} />
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#6b8ca8]">Created</span>
                    <span className="text-foreground">{new Date(course.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-white/10">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="flex-1"
                    onClick={() => router.push(`/dashboard/course/${course.id}`)}
                  >
                    <Edit size={16} className="mr-2" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="flex-1 text-red-400 hover:text-red-300"
                    onClick={() => handleDelete(course.id)}
                    disabled={deletingId === course.id}
                  >
                    {deletingId === course.id ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <>
                        <Trash2 size={16} className="mr-2" />
                        Delete
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  )
}
