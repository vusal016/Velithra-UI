"use client"

import { useState } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Plus, Edit, Trash2, Users, Clock } from "lucide-react"

interface Course {
  id: string
  title: string
  instructor: string
  description: string
  students: number
  duration: string
  level: "beginner" | "intermediate" | "advanced"
  status: "active" | "archived"
}

const courses: Course[] = [
  {
    id: "1",
    title: "Introduction to React",
    instructor: "Sarah Johnson",
    description: "Learn the basics of React and component architecture",
    students: 45,
    duration: "4 weeks",
    level: "beginner",
    status: "active",
  },
  {
    id: "2",
    title: "Advanced TypeScript",
    instructor: "Marcus Chen",
    description: "Master advanced TypeScript patterns and best practices",
    students: 28,
    duration: "6 weeks",
    level: "advanced",
    status: "active",
  },
  {
    id: "3",
    title: "Node.js Fundamentals",
    instructor: "Alex Rivera",
    description: "Build server-side applications with Node.js",
    students: 35,
    duration: "5 weeks",
    level: "intermediate",
    status: "active",
  },
]

export default function CoursesPage() {
  const [displayCourses] = useState(courses)

  const levelColors = {
    beginner: "bg-green-500/20 text-green-400",
    intermediate: "bg-yellow-500/20 text-yellow-400",
    advanced: "bg-red-500/20 text-red-400",
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
          <Button className="gap-2 bg-primary hover:bg-primary-dark text-background">
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
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">{course.title}</h3>
                    <p className="text-sm text-muted mt-2">{course.instructor}</p>
                  </div>

                  <p className="text-sm text-muted text-pretty">{course.description}</p>

                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Users size={14} className="text-primary" />
                        <span className="text-muted">{course.students} students</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-primary" />
                        <span className="text-muted">{course.duration}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${levelColors[course.level]}`}>
                        {course.level}
                      </span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Edit size={16} />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-400">
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
      </div>
    </div>
  )
}
