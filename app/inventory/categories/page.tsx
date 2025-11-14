"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { motion } from "framer-motion"
import { Plus, Search, Edit, Trash2, FolderOpen, Loader2 } from "lucide-react"
import { categoryService } from "@/lib/services/api"
import type { CategoryDto } from "@/lib/types"
import { toast } from "sonner"

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categories, setCategories] = useState<any[]>([])
  const [displayCategories, setDisplayCategories] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setIsLoading(true)
      const response = await categoryService.getAll()
      const data = response.data.data || response.data || []
      setCategories(Array.isArray(data) ? data : [])
      setDisplayCategories(Array.isArray(data) ? data : [])
    } catch (error: any) {
      console.error('Failed to load categories:', error)
      toast.error("Failed to load categories", {
        description: error.message || "Please try again later"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    const filtered = categories.filter(
      (c) =>
        c.name.toLowerCase().includes(term.toLowerCase()) ||
        (c.description && c.description.toLowerCase().includes(term.toLowerCase()))
    )
    setDisplayCategories(filtered)
  }

  const handleCreate = () => {
    setIsEditMode(false)
    setSelectedCategory(null)
    setFormData({ name: "", description: "" })
    setIsDialogOpen(true)
  }

  const handleEdit = (category: any) => {
    setIsEditMode(true)
    setSelectedCategory(category)
    setFormData({
      name: category.name,
      description: category.description || ""
    })
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    try {
      if (!formData.name.trim()) {
        toast.error("Name is required")
        return
      }

      setIsSubmitting(true)
      if (isEditMode && selectedCategory) {
        await categoryService.update(selectedCategory.id, {
          name: formData.name,
          description: formData.description,
        })
        toast.success("Category updated successfully")
      } else {
        await categoryService.create({
          name: formData.name,
          description: formData.description,
        })
        toast.success("Category created successfully")
      }
      setIsDialogOpen(false)
      loadCategories()
    } catch (error: any) {
      console.error('Failed to save category:', error)
      toast.error("Failed to save category", {
        description: error.message || "Please try again"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (categoryId: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return

    try {
      setIsDeleting(categoryId)
      await categoryService.delete(categoryId)
      toast.success("Category deleted successfully")
      loadCategories()
    } catch (error: any) {
      console.error('Failed to delete category:', error)
      toast.error("Failed to delete category", {
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
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Categories</h1>
            <p className="text-muted mt-1">Manage inventory categories</p>
          </div>
          <Button onClick={handleCreate} className="gap-2 bg-primary hover:bg-primary-dark text-background">
            <Plus size={18} />
            New Category
          </Button>
        </div>

        {/* Search Bar */}
        <GlassCard>
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
              <Input
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-foreground"
              />
            </div>
          </div>
        </GlassCard>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted">Total Categories</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{categories.length}</p>
                </div>
                <FolderOpen className="text-primary" size={40} />
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Categories Grid */}
        {displayCategories.length === 0 ? (
          <GlassCard>
            <div className="p-12 text-center">
              <FolderOpen className="mx-auto text-muted mb-4" size={64} />
              <h3 className="text-xl font-semibold text-foreground mb-2">No categories found</h3>
              <p className="text-muted mb-6">Create your first category to get started</p>
              <Button onClick={handleCreate} className="bg-primary hover:bg-primary-dark text-background">
                <Plus size={18} className="mr-2" />
                Create Category
              </Button>
            </div>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayCategories.map((category, i) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <GlassCard>
                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                          <FolderOpen className="text-primary" size={24} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{category.name}</h3>
                          {category.description && (
                            <p className="text-sm text-muted mt-1">{category.description}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4 border-t border-white/10">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="flex-1"
                        onClick={() => handleEdit(category)}
                      >
                        <Edit size={16} className="mr-2" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="flex-1 text-red-400 hover:text-red-300"
                        onClick={() => handleDelete(category.id)}
                        disabled={isDeleting === category.id}
                      >
                        {isDeleting === category.id ? (
                          <Loader2 className="animate-spin" size={16} />
                        ) : (
                          <>
                            <Trash2 size={16} className="mr-2" />
                            Delete
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}

        {/* Create/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-background border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">
                {isEditMode ? "Edit Category" : "Create Category"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">
                  Name <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter category name"
                  className="bg-white/5 border-white/10 text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-foreground">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter category description"
                  className="bg-white/5 border-white/10 text-foreground"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-primary hover:bg-primary-dark text-background" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : (isEditMode ? "Update" : "Create")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
