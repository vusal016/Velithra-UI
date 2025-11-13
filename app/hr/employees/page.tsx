"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { Plus, Search, Edit, Trash2, Mail, Loader2 } from "lucide-react"
import { hrService } from "@/lib/services/hrService"
import type { EmployeeDto } from "@/lib/types/module.types"
import { toast } from "sonner"

export default function EmployeesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [employees, setEmployees] = useState<EmployeeDto[]>([])
  const [displayEmployees, setDisplayEmployees] = useState<EmployeeDto[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadEmployees()
  }, [])

  const loadEmployees = async () => {
    try {
      setIsLoading(true)
      const data = await hrService.getAllEmployees()
      setEmployees(data)
      setDisplayEmployees(data)
    } catch (error: any) {
      toast.error("Failed to load employees", {
        description: error.message || "Please try again later",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    const filtered = employees.filter(
      (e) =>
        e.firstName.toLowerCase().includes(term.toLowerCase()) ||
        e.lastName.toLowerCase().includes(term.toLowerCase()) ||
        e.email.toLowerCase().includes(term.toLowerCase()) ||
        e.departmentName.toLowerCase().includes(term.toLowerCase()),
    )
    setDisplayEmployees(filtered)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this employee?")) return

    try {
      await hrService.deleteEmployee(id)
      toast.success("Employee deleted successfully")
      loadEmployees()
    } catch (error: any) {
      toast.error("Failed to delete employee", {
        description: error.message || "Please try again",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-[#00d9ff] mx-auto mb-4" />
            <p className="text-white">Loading employees...</p>
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
            <h1 className="text-3xl font-bold text-white">Employee Directory</h1>
            <p className="text-gray-300 mt-1">Manage company workforce</p>
          </div>
          <Button className="gap-2 bg-primary hover:bg-primary-dark text-background">
            <Plus size={18} />
            Add Employee
          </Button>
        </div>

        {/* Search Bar */}
        <GlassCard>
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
              <Input
                placeholder="Search employees..."
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
            { label: "Total Employees", value: employees.length },
            { label: "Active", value: employees.filter((e) => e.status === "Active").length },
            { label: "On Leave", value: employees.filter((e) => e.status === "OnLeave").length },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}>
              <GlassCard>
                <div className="p-4">
                  <p className="text-xs text-gray-300 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Employees List */}
        <div className="space-y-4">
          {displayEmployees.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-300">No employees found</p>
            </div>
          ) : (
            displayEmployees.map((employee, i) => (
              <motion.div
                key={employee.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <GlassCard>
                  <div className="p-6 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-lg bg-primary/30 flex items-center justify-center text-primary font-bold">
                            {employee.firstName.charAt(0)}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">
                            {employee.firstName} {employee.lastName}
                          </h3>
                          <p className="text-sm text-gray-300">{employee.positionTitle}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail size={14} className="text-[#00d9ff]" />
                          <span className="text-gray-300">{employee.email}</span>
                        </div>
                        <div className="text-sm">
                          <p className="text-xs text-gray-400 uppercase">Department</p>
                          <p className="text-white font-medium">{employee.departmentName}</p>
                        </div>
                        <div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              employee.status === "Active"
                                ? "bg-primary/20 text-primary"
                                : employee.status === "OnLeave"
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {employee.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Edit size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-red-400"
                        onClick={() => handleDelete(employee.id)}
                      >
                        <Trash2 size={16} />
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
