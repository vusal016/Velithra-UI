"use client"

import { useState } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { Plus, Search, Edit, Trash2, Mail } from "lucide-react"

interface Employee {
  id: string
  name: string
  email: string
  department: string
  position: string
  salary: string
  startDate: string
  status: "active" | "on-leave" | "inactive"
}

const employees: Employee[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@velithra.local",
    department: "Engineering",
    position: "Senior Developer",
    salary: "$120,000",
    startDate: "2021-03-15",
    status: "active",
  },
  {
    id: "2",
    name: "Marcus Chen",
    email: "marcus.chen@velithra.local",
    department: "HR",
    position: "HR Manager",
    salary: "$95,000",
    startDate: "2020-07-01",
    status: "active",
  },
  {
    id: "3",
    name: "Emma Davis",
    email: "emma.davis@velithra.local",
    department: "Sales",
    position: "Sales Lead",
    salary: "$85,000",
    startDate: "2022-01-10",
    status: "on-leave",
  },
  {
    id: "4",
    name: "Alex Rivera",
    email: "alex.rivera@velithra.local",
    department: "Engineering",
    position: "QA Engineer",
    salary: "$75,000",
    startDate: "2022-06-20",
    status: "active",
  },
]

export default function EmployeesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [displayEmployees, setDisplayEmployees] = useState(employees)

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    setDisplayEmployees(
      employees.filter(
        (e) =>
          e.name.toLowerCase().includes(term.toLowerCase()) ||
          e.email.toLowerCase().includes(term.toLowerCase()) ||
          e.department.toLowerCase().includes(term.toLowerCase()),
      ),
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Employee Directory</h1>
            <p className="text-muted mt-1">Manage company workforce</p>
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
            { label: "Active", value: employees.filter((e) => e.status === "active").length },
            { label: "On Leave", value: employees.filter((e) => e.status === "on-leave").length },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}>
              <GlassCard>
                <div className="p-4">
                  <p className="text-xs text-muted uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-bold text-primary mt-2">{stat.value}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Employees List */}
        <div className="space-y-4">
          {displayEmployees.map((employee, i) => (
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
                          {employee.name.charAt(0)}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{employee.name}</h3>
                        <p className="text-sm text-muted">{employee.position}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail size={14} className="text-primary" />
                        <span className="text-muted">{employee.email}</span>
                      </div>
                      <div className="text-sm">
                        <p className="text-xs text-muted uppercase">Department</p>
                        <p className="text-foreground font-medium">{employee.department}</p>
                      </div>
                      <div className="text-sm">
                        <p className="text-xs text-muted uppercase">Salary</p>
                        <p className="text-foreground font-medium">{employee.salary}</p>
                      </div>
                      <div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            employee.status === "active"
                              ? "bg-primary/20 text-primary"
                              : employee.status === "on-leave"
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
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-400">
                      <Trash2 size={16} />
                    </Button>
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
