import { userService } from "@/lib/services/userService";
"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"
import { Plus, Search, Edit, Trash2, Shield, Loader2 } from "lucide-react"
import { authService } from "@/lib/services/authService"
import { getAllRoles } from "@/lib/config/permissions"
import { toast } from "@/hooks/use-toast"
import type { AppUserDto, AppUserCreateDto, AppUserUpdateDto, RegisterRequest } from "@/lib/types"

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [users, setUsers] = useState<AppUserDto[]>([])
  const [displayUsers, setDisplayUsers] = useState<AppUserDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [selectedUser, setSelectedUser] = useState<AppUserDto | null>(null)
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    fullName: "",
    password: "",
    confirmPassword: ""
  })

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setIsLoading(true)
      const { userManagementService } = await import('@/lib/services/coreServices')
      const data = await userManagementService.getAll()
      setUsers(data)
      setDisplayUsers(data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load users",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    const filtered = users.filter(
      (u) => 
        u.email?.toLowerCase().includes(term.toLowerCase()) || 
        u.userName?.toLowerCase().includes(term.toLowerCase())
    )
    setDisplayUsers(filtered)
  }

  const handleCreate = () => {
    setIsEditMode(false)
    setSelectedUser(null)
    setFormData({
      userName: "",
      email: "",
      fullName: "",
      password: "",
      confirmPassword: ""
    })
    setIsDialogOpen(true)
  }

  const handleEdit = (user: AppUserDto) => {
    setIsEditMode(true)
    setSelectedUser(user)
    setFormData({
      userName: user.userName,
      email: user.email,
      fullName: user.fullName || "",
      password: "",
      confirmPassword: ""
    })
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    try {
      if (isEditMode && selectedUser) {
        const { userManagementService } = await import('@/lib/services/coreServices')
        await userManagementService.update({
          id: selectedUser.id,
          userName: formData.userName,
          email: formData.email
        })
        
        toast({
          title: "Success",
          description: "User updated successfully"
        })
      } else {
        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
          toast({
            title: "Error",
            description: "Passwords do not match",
            variant: "destructive"
          })
          return
        }

        const { userManagementService } = await import('@/lib/services/coreServices')
        await userManagementService.create({
          email: formData.email,
          userName: formData.userName,
          fullName: formData.fullName,
          password: formData.password,
          roleId: "" // Default role ID - should be populated from a role selector
        })
        
        toast({
          title: "Success",
          description: "User created successfully"
        })
      }
      setIsDialogOpen(false)
      loadUsers()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save user",
        variant: "destructive"
      })
    }
  }

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return
    
    try {
      setIsDeleting(true)
      // Kullanıcı silme işlemi için yeni servis:
      await userService.delete(userId)
      toast({
        title: "Success",
        description: "User deleted successfully"
      })
      loadUsers()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive"
      })
    } finally {
      setIsDeleting(false)
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
            <h1 className="text-3xl font-bold text-foreground">User Management</h1>
            <p className="text-muted mt-1">Manage system users and permissions</p>
          </div>
          <Button onClick={handleCreate} className="gap-2 bg-primary hover:bg-primary-dark text-background">
            <Plus size={18} />
            Add User
          </Button>
        </div>

        {/* Search Bar */}
        <GlassCard>
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 bg-white/5 border-white/10"
              />
            </div>
          </div>
        </GlassCard>

        {/* Users Table */}
        <GlassCard>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-white/10">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Email</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Role</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Status</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Join Date</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayUsers.map((user, i) => (
                  <motion.tr
                    key={user.userName}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition"
                  >
                    <td className="px-6 py-4 text-foreground">{user.email}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Shield size={14} className="text-primary" />
                        <span className="text-foreground">{user.fullName || user.userName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted text-xs">
                      {new Date().toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleEdit(user)}
                          disabled={isDeleting}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0 text-red-400"
                          onClick={() => handleDelete(user.userName)}
                          disabled={isDeleting}
                        >
                          {isDeleting ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        {/* Create/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-background border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">
                {isEditMode ? "Edit User" : "Create User"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="userName" className="text-foreground">Username</Label>
                <Input
                  id="userName"
                  value={formData.userName}
                  onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                  placeholder="Enter username"
                  className="bg-white/5 border-white/10 text-foreground"
                  disabled={isEditMode}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email"
                  className="bg-white/5 border-white/10 text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-foreground">Full Name</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Enter full name"
                  className="bg-white/5 border-white/10 text-foreground"
                />
              </div>
              {!isEditMode && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-foreground">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Enter password"
                      className="bg-white/5 border-white/10 text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="Confirm password"
                      className="bg-white/5 border-white/10 text-foreground"
                    />
                  </div>
                </>
              )}
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
