"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, UserPlus, Loader2 } from "lucide-react"
import { appUserService, roleService } from "@/lib/services/coreServices"
import type { RoleDto } from "@/lib/types/core.types"
import { toast } from "sonner"

export default function CreateUserPage() {
  const router = useRouter()
  const [roles, setRoles] = useState<RoleDto[]>([])
  const [isLoadingRoles, setIsLoadingRoles] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    fullName: "",
    roleId: "",
  })

  useEffect(() => {
    loadRoles()
  }, [])

  const loadRoles = async () => {
    try {
      setIsLoadingRoles(true)
      const data = await roleService.getAll()
      setRoles(data)
    } catch (error: any) {
      toast.error("Failed to load roles", {
        description: error.message || "Please try again later",
      })
    } finally {
      setIsLoadingRoles(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.userName || !formData.email || !formData.password || !formData.fullName || !formData.roleId) {
      toast.error("Validation Error", {
        description: "Please fill in all required fields",
      })
      return
    }

    try {
      setIsSubmitting(true)
      await appUserService.create(formData)
      
      toast.success("User created successfully!", {
        description: `${formData.userName} has been added to the system`,
      })

      router.push("/admin/users")
    } catch (error: any) {
      toast.error("Failed to create user", {
        description: error.message || "Please try again",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (isLoadingRoles) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-[#00d9ff] mx-auto mb-4" />
            <p className="text-white">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft size={18} />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">Create User</h1>
            <p className="text-gray-300 mt-1">Add a new user to the system</p>
          </div>
        </div>

        {/* Form */}
        <GlassCard>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="userName" className="text-white">
                Username <span className="text-red-400">*</span>
              </Label>
              <Input
                id="userName"
                type="text"
                value={formData.userName}
                onChange={(e) => handleChange("userName", e.target.value)}
                placeholder="Enter username"
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email <span className="text-red-400">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="user@example.com"
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                required
              />
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-white">
                Full Name <span className="text-red-400">*</span>
              </Label>
              <Input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                placeholder="Enter full name"
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Password <span className="text-red-400">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder="Enter password"
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                required
              />
              <p className="text-xs text-gray-400">
                Password must be at least 8 characters long
              </p>
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label htmlFor="role" className="text-white">
                Role <span className="text-red-400">*</span>
              </Label>
              <Select
                value={formData.roleId}
                onValueChange={(value) => handleChange("roleId", value)}
              >
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      <div>
                        <div className="font-medium">{role.name}</div>
                        <div className="text-xs text-gray-400">{role.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-[#00d9ff] hover:bg-[#0099cc] text-[#0a1628] font-semibold gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Creating...
                  </>
                ) : (
                  <>
                    <UserPlus size={18} />
                    Create User
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.back()}
                disabled={isSubmitting}
                className="text-white"
              >
                Cancel
              </Button>
            </div>
          </form>
        </GlassCard>
      </div>
    </div>
  )
}
