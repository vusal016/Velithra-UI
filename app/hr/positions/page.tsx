"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import { Plus, Search, Edit, Trash2, Briefcase, Loader2, X } from "lucide-react"
import { positionService, departmentService } from "@/lib/services/api"
import type { PositionDto, DepartmentDto } from "@/lib/types"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function PositionsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [positions, setPositions] = useState<PositionDto[]>([])
  const [displayPositions, setDisplayPositions] = useState<PositionDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Dialog states
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedPosition, setSelectedPosition] = useState<PositionDto | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    departmentId: "",
  })
  
  const [departments, setDepartments] = useState<DepartmentDto[]>([])

  useEffect(() => {
    loadPositions()
    loadDepartments()
  }, [])
  
  const loadDepartments = async () => {
    try {
      const response = await departmentService.getAll()
      const data = response.data.data || response.data || []
      setDepartments(Array.isArray(data) ? data : [])
    } catch (error: any) {
      console.error('Failed to load departments:', error)
    }
  }

  const loadPositions = async () => {
    try {
      setIsLoading(true)
      const response = await positionService.getAll()
      const data = response.data.data || response.data || []
      setPositions(Array.isArray(data) ? data : [])
      setDisplayPositions(Array.isArray(data) ? data : [])
    } catch (error: any) {
      console.error('Failed to load positions:', error)
      toast.error("Failed to load positions", {
        description: error.response?.data?.message || error.message || "Please try again later",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    const filtered = positions.filter(
      (p) => p.title.toLowerCase().includes(term.toLowerCase()),
    )
    setDisplayPositions(filtered)
  }

  // CRUD Handlers
  const handleCreate = () => {
    setFormData({ title: "", description: "", departmentId: "" })
    setShowCreateDialog(true)
  }

  const handleEdit = (position: PositionDto) => {
    setSelectedPosition(position)
    setFormData({
      title: position.title,
      description: position.description || "",
      departmentId: position.departmentId,
    })
    setShowEditDialog(true)
  }

  const handleDeleteClick = (position: PositionDto) => {
    setSelectedPosition(position)
    setShowDeleteDialog(true)
  }

  const handleSubmitCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      toast.error("Position title is required")
      return
    }

    try {
      setIsSubmitting(true)
      await positionService.create({
        title: formData.title,
        description: formData.description || undefined,
        departmentId: formData.departmentId || departments[0]?.id || '',
      })
      toast.success("Position created successfully")
      setShowCreateDialog(false)
      loadPositions()
    } catch (error: any) {
      console.error('Failed to create position:', error)
      toast.error("Failed to create position", {
        description: error.response?.data?.message || error.message || "Please try again",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPosition || !formData.title.trim()) {
      toast.error("Position title is required")
      return
    }

    try {
      setIsSubmitting(true)
      await positionService.update(selectedPosition.id, {
        title: formData.title,
        description: formData.description || undefined,
        departmentId: formData.departmentId || selectedPosition.departmentId,
      })
      toast.success("Position updated successfully")
      setShowEditDialog(false)
      loadPositions()
    } catch (error: any) {
      console.error('Failed to update position:', error)
      toast.error("Failed to update position", {
        description: error.response?.data?.message || error.message || "Please try again",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!selectedPosition) return

    try {
      setIsSubmitting(true)
      await positionService.delete(selectedPosition.id)
      toast.success("Position deleted successfully")
      setShowDeleteDialog(false)
      loadPositions()
    } catch (error: any) {
      console.error('Failed to delete position:', error)
      toast.error("Failed to delete position", {
        description: error.response?.data?.message || error.message || "Please try again",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-[#00d9ff] mx-auto mb-4" />
            <p className="text-white">Loading positions...</p>
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
            <h1 className="text-3xl font-bold text-white">Positions</h1>
            <p className="text-gray-300 mt-1">Manage job positions and roles</p>
          </div>
          <Button onClick={handleCreate} className="gap-2 bg-primary hover:bg-primary-dark text-background">
            <Plus size={18} />
            Add Position
          </Button>
        </div>

        {/* Search Bar */}
        <GlassCard>
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
              <Input
                placeholder="Search positions..."
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
            { label: "Total Positions", value: positions.length, icon: Briefcase },
            { label: "Active Positions", value: positions.length, icon: Plus },
            { label: "Total Positions", value: positions.length, icon: Briefcase },
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

        {/* Positions List */}
        <div className="space-y-4">
          {displayPositions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-300">No positions found</p>
            </div>
          ) : (
            displayPositions.map((position, i) => (
              <motion.div
                key={position.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <GlassCard>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                          <Briefcase size={24} className="text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white text-lg">{position.title}</h3>
                          <p className="text-sm text-gray-300">{position.description || 'No description'}</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
                        Active
                      </span>
                    </div>

                    <div className="flex gap-2 pt-4 border-t border-white/10">
                      <Button size="sm" variant="ghost" className="gap-2" onClick={() => handleEdit(position)}>
                        <Edit size={16} />
                        Edit
                      </Button>
                      <Button size="sm" variant="ghost" className="gap-2 text-red-400" onClick={() => handleDeleteClick(position)}>
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

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="bg-[#1a2332] border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Create Position</DialogTitle>
            <DialogDescription className="text-gray-300">
              Add a new position to your organization
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitCreate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white">Position Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
                placeholder="e.g., Senior Developer"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-white">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
                placeholder="Position description"
              />
            </div>
            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-primary hover:bg-primary-dark"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : "Create"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowCreateDialog(false)}
                disabled={isSubmitting}
                className="text-white"
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="bg-[#1a2332] border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Position</DialogTitle>
            <DialogDescription className="text-gray-300">
              Update position information
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitEdit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title" className="text-white">Position Title *</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description" className="text-white">Description</Label>
              <Input
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-primary hover:bg-primary-dark"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowEditDialog(false)}
                disabled={isSubmitting}
                className="text-white"
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-[#1a2332] border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Position</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              Are you sure you want to delete <strong className="text-white">{selectedPosition?.title}</strong>? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              disabled={isSubmitting}
              className="bg-white/5 text-white hover:bg-white/10 border-white/10"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isSubmitting}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
