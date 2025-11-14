"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { motion } from "framer-motion"
import { Plus, Edit, Trash2, Shield, Loader2 } from "lucide-react"
import { roleManagementService } from "@/lib/services/coreServices"
import { toast } from "sonner"
import type { RoleDto, RoleCreateDto } from "@/lib/types"

export default function RolesPage() {
  const [roles, setRoles] = useState<RoleDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [selectedRole, setSelectedRole] = useState<RoleDto | null>(null)
  const [formData, setFormData] = useState<RoleCreateDto>({
    name: "",
    description: ""
  })

  useEffect(() => {
    loadRoles()
  }, [])

  const loadRoles = async () => {
    try {
      setIsLoading(true)
      const data = await roleManagementService.getAll()
      setRoles(data)
    } catch (error: any) {
      toast.error("Failed to load roles", {
        description: error.message || "Please try again later"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = () => {
    setIsEditMode(false)
    setSelectedRole(null)
    setFormData({ name: "", description: "" })
    setIsDialogOpen(true)
  }

  const handleEdit = (role: RoleDto) => {
    setIsEditMode(true)
    setSelectedRole(role)
    setFormData({
      name: role.name,
      description: role.description || ""
    })
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    try {
      if (!formData.name.trim()) {
        toast.error("Name is required")
        return
      }

      if (isEditMode && selectedRole) {
        await roleManagementService.update(selectedRole.id, {
          id: selectedRole.id,
          ...formData
        })
        toast.success("Role updated successfully")
      } else {
        await roleManagementService.create(formData)
        toast.success("Role created successfully")
      }
      setIsDialogOpen(false)
      loadRoles()
    } catch (error: any) {
      toast.error("Failed to save role", {
        description: error.message || "Please try again"
      })
    }
  }

  const handleDelete = async (roleId: string) => {
    if (!confirm("Are you sure you want to delete this role?")) return

    try {
      setIsDeleting(roleId)
      await roleManagementService.delete(roleId)
      toast.success("Role deleted successfully")
      loadRoles()
    } catch (error: any) {
      toast.error("Failed to delete role", {
        description: error.message || "Please try again"
      })
    } finally {
      setIsDeleting(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Role Management</h1>
            <p className="text-muted mt-1">Manage system roles and permissions</p>
          </div>
          <Button onClick={handleCreate} className="gap-2 bg-primary hover:bg-primary-dark text-background">
            <Plus size={18} />
            New Role
          </Button>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roles.map((role, i) => (
            <motion.div
              key={role.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard>
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <Shield className="text-primary" size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground">{role.name}</h3>
                        <p className="text-sm text-muted mt-1">{role.description}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 px-3"
                        onClick={() => handleEdit(role)}
                      >
                        <Edit size={16} className="mr-1" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 px-3 text-red-400 hover:text-red-300"
                        onClick={() => handleDelete(role.id)}
                        disabled={isDeleting === role.id}
                      >
                        {isDeleting === role.id ? (
                          <Loader2 className="animate-spin" size={16} />
                        ) : (
                          <>
                            <Trash2 size={16} className="mr-1" />
                            Delete
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <p className="text-xs text-muted">Role ID</p>
                    <p className="text-sm font-medium text-foreground font-mono">
                      {role.id.substring(0, 8)}...
                    </p>
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
              <DialogTitle className="text-foreground flex items-center gap-2">
                <Shield className="text-primary" size={24} />
                {isEditMode ? "Edit Role" : "Create Role"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">
                  Role Name <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter role name"
                  className="bg-white/5 border-white/10 text-foreground"
                  disabled={isEditMode}
                />
                {isEditMode && (
                  <p className="text-xs text-muted">Role name cannot be changed</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-foreground">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter role description"
                  className="bg-white/5 border-white/10 text-foreground"
                  rows={3}
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
