"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Loader2 } from "lucide-react"
import { employeeService, departmentService, positionService } from "@/lib/services/hrService"
import { DepartmentDto, PositionDto, EmployeeCreateDto } from "@/lib/types/module.types"
import { toast } from "sonner"

export default function AddEmployeePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [departments, setDepartments] = useState<DepartmentDto[]>([])
  const [positions, setPositions] = useState<PositionDto[]>([])
  const [filteredPositions, setFilteredPositions] = useState<PositionDto[]>([])

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    email: "",
    phoneNumber: "",
    address: "",
    departmentId: "",
    positionId: "",
    hireDate: "",
  })

  // Fetch departments and positions on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingData(true)
        const [depts, pos] = await Promise.all([
          departmentService.getAll(),
          positionService.getAll(),
        ])
        setDepartments(depts)
        setPositions(pos)
      } catch (error: any) {
        toast.error("Failed to load form data", {
          description: error.message || "Please try again later",
        })
      } finally {
        setIsLoadingData(false)
      }
    }

    fetchData()
  }, [])

  // Filter positions when department changes
  useEffect(() => {
    if (formData.departmentId) {
      const filtered = positions.filter((pos) => pos.departmentId === formData.departmentId)
      setFilteredPositions(filtered)
      
      // Reset position if it doesn't belong to selected department
      if (formData.positionId) {
        const isValidPosition = filtered.some((pos) => pos.id === formData.positionId)
        if (!isValidPosition) {
          setFormData((prev) => ({ ...prev, positionId: "" }))
        }
      }
    } else {
      setFilteredPositions([])
      setFormData((prev) => ({ ...prev, positionId: "" }))
    }
  }, [formData.departmentId, positions, formData.positionId])

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.firstName.trim()) {
      toast.error("First name is required")
      return
    }
    if (!formData.lastName.trim()) {
      toast.error("Last name is required")
      return
    }
    if (!formData.email.trim()) {
      toast.error("Email is required")
      return
    }
    if (!formData.phoneNumber.trim()) {
      toast.error("Phone number is required")
      return
    }
    if (!formData.address.trim()) {
      toast.error("Address is required")
      return
    }
    if (!formData.departmentId) {
      toast.error("Department is required")
      return
    }
    if (!formData.positionId) {
      toast.error("Position is required")
      return
    }
    if (!formData.dateOfBirth) {
      toast.error("Date of birth is required")
      return
    }
    if (!formData.hireDate) {
      toast.error("Hire date is required")
      return
    }

    try {
      setIsLoading(true)

      const employeeData: EmployeeCreateDto = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        dateOfBirth: new Date(formData.dateOfBirth).toISOString(),
        email: formData.email.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        address: formData.address.trim(),
        positionId: formData.positionId,
        departmentId: formData.departmentId,
        hireDate: new Date(formData.hireDate).toISOString(),
      }

      await employeeService.create(employeeData)

      toast.success("Employee added successfully", {
        description: `${formData.firstName} ${formData.lastName} has been added to the system`,
      })

      router.push("/dashboard/hr")
    } catch (error: any) {
      toast.error("Failed to add employee", {
        description: error.message || "Please try again later",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingData) {
    return (
      <div className="space-y-8 p-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#00d9ff]" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 p-8">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/dashboard/hr")}
          className="gap-2"
        >
          <ArrowLeft size={16} />
          Back
        </Button>
        <h1 className="text-3xl font-bold text-foreground">Add New Employee</h1>
      </div>

      <GlassCard>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                placeholder="Enter first name"
                className="bg-white/5 border-white/10"
                required
              />
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                placeholder="Enter last name"
                className="bg-white/5 border-white/10"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="employee@velithra.com"
                className="bg-white/5 border-white/10"
                required
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number *</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                placeholder="+994501234567"
                className="bg-white/5 border-white/10"
                required
              />
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth *</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                className="bg-white/5 border-white/10"
                required
              />
            </div>

            {/* Hire Date */}
            <div className="space-y-2">
              <Label htmlFor="hireDate">Hire Date *</Label>
              <Input
                id="hireDate"
                type="date"
                value={formData.hireDate}
                onChange={(e) => handleInputChange("hireDate", e.target.value)}
                className="bg-white/5 border-white/10"
                required
              />
            </div>

            {/* Department */}
            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Select
                value={formData.departmentId}
                onValueChange={(value) => handleInputChange("departmentId", value)}
              >
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Position */}
            <div className="space-y-2">
              <Label htmlFor="position">Position *</Label>
              <Select
                value={formData.positionId}
                onValueChange={(value) => handleInputChange("positionId", value)}
                disabled={!formData.departmentId || filteredPositions.length === 0}
              >
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  {filteredPositions.map((pos) => (
                    <SelectItem key={pos.id} value={pos.id}>
                      {pos.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formData.departmentId && filteredPositions.length === 0 && (
                <p className="text-xs text-yellow-400">No positions available for this department</p>
              )}
            </div>

            {/* Address */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Enter address"
                className="bg-white/5 border-white/10"
                required
              />
            </div>
          </div>

          <div className="flex gap-4 justify-end pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push("/dashboard/hr")}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="gap-2 bg-[#00d9ff] hover:bg-[#0099cc] text-[#0a1628] shadow-lg shadow-[#00d9ff]/30"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Employee"
              )}
            </Button>
          </div>
        </form>
      </GlassCard>
    </div>
  )
}
