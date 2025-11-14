"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Plus, Search, Edit, Trash2, Building2, Users, Loader2, X } from "lucide-react";
import { departmentService } from "@/lib/services/api";
import type { DepartmentDto } from "@/lib/types";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function DepartmentsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [departments, setDepartments] = useState<DepartmentDto[]>([]);
  const [displayDepartments, setDisplayDepartments] = useState<DepartmentDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentDto | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadDepartments()
  }, [])

  const loadDepartments = async () => {
    try {
      setIsLoading(true)
      const response = await departmentService.getAll()
      const data = response.data.data || response.data || []
      setDepartments(Array.isArray(data) ? data : [])
      setDisplayDepartments(Array.isArray(data) ? data : [])
    } catch (error: any) {
      console.error('Failed to load departments:', error)
      toast.error("Failed to load departments", {
        description: error.response?.data?.message || error.message || "Please try again later",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = departments.filter(
      (d) => d.name.toLowerCase().includes(term.toLowerCase())
    );
    setDisplayDepartments(filtered);
  };

  const handleCreate = () => {
    setFormData({ name: "", description: "" });
    setShowCreateDialog(true);
  };

  const handleEdit = (department: DepartmentDto) => {
    setSelectedDepartment(department);
    setFormData({ name: department.name, description: department.description || "" });
    setShowEditDialog(true);
  };

  const handleDeleteClick = (department: DepartmentDto) => {
    setSelectedDepartment(department);
    setShowDeleteDialog(true);
  };

  const handleSubmitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error("Department name is required");
      return;
    }

    try {
      setIsSubmitting(true);
      await departmentService.create({
        name: formData.name,
        description: formData.description || undefined,
      });
      toast.success("Department created successfully!");
      setShowCreateDialog(false);
      loadDepartments();
    } catch (error: any) {
      console.error('Failed to create department:', error);
      toast.error(error.response?.data?.message || error.message || "Failed to create department");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDepartment || !formData.name) {
      toast.error("Department name is required");
      return;
    }

    try {
      setIsSubmitting(true);
      await departmentService.update(selectedDepartment.id, {
        name: formData.name,
        description: formData.description || undefined,
      });
      toast.success("Department updated successfully!");
      setShowEditDialog(false);
      loadDepartments();
    } catch (error: any) {
      console.error('Failed to update department:', error);
      toast.error(error.response?.data?.message || error.message || "Failed to update department");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedDepartment) return;

    try {
      setIsSubmitting(true);
      await departmentService.delete(selectedDepartment.id);
      toast.success("Department deleted successfully!");
      setShowDeleteDialog(false);
      loadDepartments();
    } catch (error: any) {
      console.error('Failed to delete department:', error);
      toast.error(error.response?.data?.message || error.message || "Failed to delete department");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-[#00d9ff] mx-auto mb-4" />
            <p className="text-white">Loading departments...</p>
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
            <h1 className="text-3xl font-bold text-white">Departments</h1>
            <p className="text-gray-300 mt-1">Manage organizational departments</p>
          </div>
          <Button 
            onClick={handleCreate}
            className="gap-2 bg-primary hover:bg-primary-dark text-background"
          >
            <Plus size={18} />
            Add Department
          </Button>
        </div>

        {/* Search Bar */}
        <GlassCard>
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
              <Input
                placeholder="Search departments..."
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
            { label: "Total Departments", value: departments.length, icon: Building2 },
            { label: "Total Departments", value: departments.length, icon: Users },
            { label: "Active Departments", value: departments.length, icon: Building2 },
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

        {/* Departments List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayDepartments.length === 0 ? (
            <div className="col-span-2 text-center py-12">
              <p className="text-gray-300">No departments found</p>
            </div>
          ) : (
            displayDepartments.map((department, i) => (
              <motion.div
                key={department.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <GlassCard>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                          <Building2 size={24} className="text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{department.name}</h3>
                          <p className="text-sm text-gray-300">{department.description || 'No description'}</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
                        Active
                      </span>
                    </div>

                    <div className="flex gap-2 pt-4 border-t border-white/10">
                      <Button 
                        onClick={() => handleEdit(department)}
                        size="sm" 
                        variant="ghost" 
                        className="flex-1 gap-2"
                      >
                        <Edit size={16} />
                        Edit
                      </Button>
                      <Button 
                        onClick={() => handleDeleteClick(department)}
                        size="sm" 
                        variant="ghost" 
                        className="flex-1 gap-2 text-red-400"
                      >
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
            <DialogTitle className="text-white">Create Department</DialogTitle>
            <DialogDescription className="text-gray-300">
              Add a new department to your organization
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitCreate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Department Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
                placeholder="e.g., Engineering"
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
                placeholder="Department description"
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
            <DialogTitle className="text-white">Edit Department</DialogTitle>
            <DialogDescription className="text-gray-300">
              Update department information
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitEdit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-white">Department Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
            <AlertDialogTitle className="text-white">Delete Department</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              Are you sure you want to delete <strong className="text-white">{selectedDepartment?.name}</strong>? 
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
