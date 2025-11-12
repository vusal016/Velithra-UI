"use client"

import { useState } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Plus, BookOpen } from "lucide-react"

interface Course {
  id: string
  title: string
  description: string
  difficulty: "beginner" | "intermediate" | "advanced"
  enrolled: number
  completed: number
  duration: string
}

const courses: Course[] = [
  {
    id: "1",
    title: "React Fundamentals",
    description: "Learn React from basics",
    difficulty: "beginner",
    enrolled: 245,
    completed: 180,
    duration: "4 weeks",
  },
  {
    id: "2",
    title: "Advanced TypeScript",
    description: "Master TypeScript patterns",
    difficulty: "advanced",
    enrolled: 89,
    completed: 67,
    duration: "6 weeks",
  },
  {
    id: "3",
    title: "Next.js & Performance",
    description: "Build scalable Next.js apps",
    difficulty: "intermediate",
    enrolled: 156,
    completed: 120,
    duration: "5 weeks",
  },
]

const difficultyColors: Record<string, string> = {
  beginner: "bg-green-500/20 text-green-400",
  intermediate: "bg-blue-500/20 text-blue-400",
  advanced: "bg-red-500/20 text-red-400",
}

export default function CourseManagerPage() {
  const [courseList] = useState<Course[]>(courses)

  return (
    <div className="space-y-8 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Learning Hub</h1>
        <Button className="gap-2 bg-[#00d9ff] hover:bg-[#0099cc] text-[#0a1628] shadow-lg shadow-[#00d9ff]/30">
          <Plus size={18} /> Add Course
        </Button>
      </div>

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
                  <span className="text-[#6b8ca8]">Enrolled</span>
                  <span className="text-[#00d9ff] font-medium">{course.enrolled}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6b8ca8]">Completed</span>
                  <span className="text-[#00d9ff] font-medium">{course.completed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6b8ca8]">Duration</span>
                  <span className="text-foreground">{course.duration}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10">
                <span className={`px-2 py-1 rounded text-xs ${difficultyColors[course.difficulty]}`}>
                  {course.difficulty}
                </span>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
