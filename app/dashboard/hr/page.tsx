"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Plus, Loader2 } from "lucide-react"
import { hrService } from "@/lib/services/hrService"
import { EmployeeDto } from "@/lib/types/module.types"
import { toast } from "sonner"

const statusColors: Record<string, string> = {
  Active: "bg-green-500/20 text-green-400",
  OnLeave: "bg-yellow-500/20 text-yellow-400",
  Terminated: "bg-red-500/20 text-red-400",
}

const statusLabels: Record<string, string> = {
  Active: "Active",
  OnLeave: "On Leave",
  Terminated: "Terminated",
}

export default function HRManagerPage() {
  const router = useRouter()
  const [employeeList, setEmployeeList] = useState<EmployeeDto[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setIsLoading(true)
        const employees = await hrService.getAllEmployees()
        setEmployeeList(employees)
      } catch (error: any) {
        toast.error("Failed to fetch employees", {
          description: error.message || "Please try again later",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchEmployees()
  }, [])

  return (
    <div className="space-y-8 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">HR Manager</h1>
        <Button 
          onClick={() => router.push("/dashboard/hr/add")}
          className="gap-2 bg-[#00d9ff] hover:bg-[#0099cc] text-[#0a1628] shadow-lg shadow-[#00d9ff]/30"
        >
          <Plus size={18} /> Add Employee
        </Button>
      </div>

      <GlassCard>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#00d9ff]" />
          </div>
        ) : employeeList.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#6b8ca8]">No employees found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-white/10">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-[#6b8ca8]">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-[#6b8ca8]">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-[#6b8ca8]">Phone</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-[#6b8ca8]">Department</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-[#6b8ca8]">Position</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-[#6b8ca8]">Address</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-[#6b8ca8]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {employeeList.map((emp) => (
                  <tr key={emp.id} className="hover:bg-white/5">
                    <td className="px-6 py-3 text-sm text-foreground font-medium">
                      {emp.firstName} {emp.lastName}
                    </td>
                    <td className="px-6 py-3 text-sm text-[#6b8ca8]">{emp.email}</td>
                    <td className="px-6 py-3 text-sm text-[#6b8ca8]">{emp.phoneNumber}</td>
                    <td className="px-6 py-3 text-sm text-[#6b8ca8]">{emp.departmentName}</td>
                    <td className="px-6 py-3 text-sm text-[#6b8ca8]">{emp.positionTitle}</td>
                    <td className="px-6 py-3 text-sm text-[#6b8ca8]">{emp.address}</td>
                    <td className="px-6 py-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${statusColors[emp.status]}`}>
                        {statusLabels[emp.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  )
}
