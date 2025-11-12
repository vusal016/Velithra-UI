"use client"

import { useState } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface Employee {
  id: string
  name: string
  email: string
  department: string
  position: string
  status: "active" | "on-leave" | "terminated"
  salary: number
}

const employees: Employee[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice@velithra.local",
    department: "Engineering",
    position: "Senior Developer",
    status: "active",
    salary: 95000,
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob@velithra.local",
    department: "HR",
    position: "HR Manager",
    status: "active",
    salary: 75000,
  },
  {
    id: "3",
    name: "Carol Davis",
    email: "carol@velithra.local",
    department: "Sales",
    position: "Sales Lead",
    status: "on-leave",
    salary: 80000,
  },
]

const statusColors: Record<string, string> = {
  active: "bg-green-500/20 text-green-400",
  "on-leave": "bg-yellow-500/20 text-yellow-400",
  terminated: "bg-red-500/20 text-red-400",
}

export default function HRManagerPage() {
  const [employeeList] = useState<Employee[]>(employees)

  return (
    <div className="space-y-8 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">HR Manager</h1>
        <Button className="gap-2 bg-[#00d9ff] hover:bg-[#0099cc] text-[#0a1628] shadow-lg shadow-[#00d9ff]/30">
          <Plus size={18} /> Add Employee
        </Button>
      </div>

      <GlassCard>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-white/10">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-[#6b8ca8]">Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-[#6b8ca8]">Department</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-[#6b8ca8]">Position</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-[#6b8ca8]">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-[#6b8ca8]">Salary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {employeeList.map((emp) => (
                <tr key={emp.id} className="hover:bg-white/5">
                  <td className="px-6 py-3 text-sm text-foreground">{emp.name}</td>
                  <td className="px-6 py-3 text-sm text-[#6b8ca8]">{emp.department}</td>
                  <td className="px-6 py-3 text-sm text-[#6b8ca8]">{emp.position}</td>
                  <td className="px-6 py-3 text-sm">
                    <span className={`px-2 py-1 rounded text-xs ${statusColors[emp.status]}`}>{emp.status}</span>
                  </td>
                  <td className="px-6 py-3 text-sm text-[#00d9ff] font-medium">${emp.salary.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  )
}
