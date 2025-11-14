"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { motion } from "framer-motion"
import { Plus, Edit, Trash2, Users, Clock, Loader2, BookOpen } from "lucide-react"
import { courseService } from "@/lib/services/moduleServices"
import { toast } from "@/hooks/use-toast"
import type { CourseDto, CourseCreateDto } from "@/lib/types"

export default function CoursesPage() {
  const [courses, setCourses] = useState<CourseDto[]>([])
  const [displayCourses, setDisplayCourses] = useState<CourseDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<CourseDto | null>(null)
  const [formData, setFormData] = useState<CourseCreateDto>({
    title: "",
    description: ""
  })

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    try {
      setIsLoading(true)
      const data = await courseService.getAll()
      setCourses(data)
      setDisplayCourses(data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load courses",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = () => {
    setIsEditMode(false)
    setSelectedCourse(null)
    setFormData({ title: "", description: "" })
    setIsDialogOpen(true)
  }

  const handleEdit = (course: CourseDto) => {
    setIsEditMode(true)
    setSelectedCourse(course)
    setFormData({
      title: course.title,
      description: course.description
    })
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    try {
      if (isEditMode && selectedCourse) {
        await courseService.update(selectedCourse.id, {
          id: selectedCourse.id,
          ...formData
        })
        toast({
          title: "Success",
          description: "Course updated successfully"
        })
      } else {
        await courseService.create(formData)
        toast({
          title: "Success",
          description: "Course created successfully"
        })
      }
      setIsDialogOpen(false)
      loadCourses()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save course",
        variant: "destructive"
      })
    }
  }

  const handleDelete = async (courseId: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return
    
    try {
      await courseService.delete(courseId)
      toast({
        title: "Success",
        description: "Course deleted successfully"
      })
      loadCourses()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete course",
        variant: "destructive"
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    )
  }

  const levelColors = {
    Beginner: "bg-green-500/20 text-green-400",
    Intermediate: "bg-yellow-500/20 text-yellow-400",
    Advanced: "bg-red-500/20 text-red-400",
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Learning Hub</h1>
            <p className="text-muted mt-1">Manage courses and training programs</p>
          </div>
          <Button onClick={handleCreate} className="gap-2 bg-primary hover:bg-primary-dark text-background">
            <Plus size={18} />
            New Course
          </Button>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayCourses.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard>
                <div className="p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="text-primary" size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground text-lg">{course.title}</h3>
                      <p className="text-sm text-muted mt-1">{course.description}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-primary" />
                        <span className="text-muted">{new Date(course.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
                        Active
                      </span>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleEdit(course)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0 text-red-400"
                          onClick={() => handleDelete(course.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
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
                {isEditMode ? "Edit Course" : "Create Course"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-foreground">Course Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter course title"
                  className="bg-white/5 border-white/10 text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-foreground">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter course description"
                  className="bg-white/5 border-white/10 text-foreground"
                  rows={4}
                />
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
      </div>
    </div>
  )
}
