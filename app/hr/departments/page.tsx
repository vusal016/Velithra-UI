"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { Plus, Search, Edit, Trash2, Building2, Users, Loader2 } from "lucide-react"
import { hrService } from "@/lib/services/hrService"
import type { DepartmentDto } from "@/lib/types/module.types"
import { toast } from "sonner"

export default function DepartmentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [departments, setDepartments] = useState<DepartmentDto[]>([])
  const [displayDepartments, setDisplayDepartments] = useState<DepartmentDto[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDepartments()
  }, [])

  const loadDepartments = async () => {
    try {
      setIsLoading(true)
      const data = await hrService.getAllDepartments()
      setDepartments(data)
      setDisplayDepartments(data)
    } catch (error: any) {
      toast.error("Failed to load departments", {
        description: error.message || "Please try again later",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    const filtered = departments.filter(
      (d) => d.name.toLowerCase().includes(term.toLowerCase()),
    )
    setDisplayDepartments(filtered)
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-[#00d9ff] mx-auto mb-4" />
            <p className="text-white">Loading departments...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Departments</h1>
            <p className="text-gray-300 mt-1">Manage organizational departments</p>
          </div>
          <Button className="gap-2 bg-primary hover:bg-primary-dark text-background">
            <Plus size={18} />
            Add Department
          </Button>
        </div>

        {/* Search Bar */}
        <GlassCard>
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
              <Input
                placeholder="Search departments..."
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
            { label: "Total Departments", value: departments.length, icon: Building2 },
            { label: "Total Departments", value: departments.length, icon: Users },
            { label: "Active Departments", value: departments.length, icon: Building2 },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}>
              <GlassCard>
                <div className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <stat.icon size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-300 uppercase tracking-wider">{stat.label}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Departments List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayDepartments.length === 0 ? (
            <div className="col-span-2 text-center py-12">
              <p className="text-gray-300">No departments found</p>
            </div>
          ) : (
            displayDepartments.map((department, i) => (
              <motion.div
                key={department.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <GlassCard>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                          <Building2 size={24} className="text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{department.name}</h3>
                          <p className="text-sm text-gray-300">{department.description || 'No description'}</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
                        Active
                      </span>
                    </div>

                    <div className="flex gap-2 pt-4 border-t border-white/10">
                      <Button size="sm" variant="ghost" className="flex-1 gap-2">
                        <Edit size={16} />
                        Edit
                      </Button>
                      <Button size="sm" variant="ghost" className="flex-1 gap-2 text-red-400">
                        <Trash2 size={16} />
                        Delete
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
