"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import {
  Boxes,
  Plus,
  Power,
  PowerOff,
  Edit2,
  Trash2,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  RefreshCw,
} from "lucide-react";
import { moduleService } from "@/lib/services/api";
import type { ModuleDto } from "@/lib/types/api.types";
import { toast } from "sonner";
import { motion } from "framer-motion";

// Predefined module configurations
const MODULE_CONFIGS = {
  TASK: {
    code: "TASK_MANAGEMENT",
    name: "Task Management",
    description: "Kanban board, task tracking, comments, and assignments",
    icon: "📋",
    color: "blue",
  },
  HR: {
    code: "HUMAN_RESOURCES",
    name: "Human Resources",
    description: "Employee management, departments, positions, and payroll",
    icon: "👥",
    color: "green",
  },
  COURSE: {
    code: "COURSE_MANAGEMENT",
    name: "Course Management",
    description: "Training courses, lessons, enrollments, and certifications",
    icon: "🎓",
    color: "purple",
  },
  INVENTORY: {
    code: "INVENTORY_MANAGEMENT",
    name: "Inventory Management",
    description: "Stock items, categories, transactions, and warehouse tracking",
    icon: "📦",
    color: "orange",
  },
  CHAT: {
    code: "CHAT_MESSAGING",
    name: "Chat & Messaging",
    description: "Real-time chat rooms, direct messaging, and team communication",
    icon: "💬",
    color: "cyan",
  },
  AUDIT: {
    code: "AUDIT_LOGS",
    name: "Audit & Compliance",
    description: "System audit logs, compliance tracking, and activity monitoring",
    icon: "📊",
    color: "red",
  },
  NOTIFICATION: {
    code: "NOTIFICATIONS",
    name: "Notifications",
    description: "Real-time alerts, email notifications, and push messages",
    icon: "🔔",
    color: "yellow",
  },
  SETTINGS: {
    code: "SYSTEM_SETTINGS",
    name: "System Settings",
    description: "Application configuration, user preferences, and system parameters",
    icon: "⚙️",
    color: "gray",
  },
};

export default function ModuleManagerPage() {
  const [modules, setModules] = useState<ModuleDto[]>([]);
  const [filteredModules, setFilteredModules] = useState<ModuleDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");

  // Dialogs
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedModule, setSelectedModule] = useState<ModuleDto | null>(null);

  // Form state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
  });

  useEffect(() => {
    loadModules();
  }, []);

  useEffect(() => {
    filterModules();
  }, [modules, searchQuery, filterStatus]);

  const loadModules = async () => {
    try {
      setIsLoading(true);
      const response = await moduleService.getAll();
      const data = response.data.data || response.data || [];
      setModules(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error("Failed to load modules:", error);
      toast.error("Failed to load modules", {
        description: error.response?.data?.message || "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterModules = () => {
    let filtered = modules;

    // Filter by status
    if (filterStatus === "active") {
      filtered = filtered.filter((m) => m.isActive);
    } else if (filterStatus === "inactive") {
      filtered = filtered.filter((m) => !m.isActive);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.name.toLowerCase().includes(query) ||
          m.code.toLowerCase().includes(query) ||
          m.description?.toLowerCase().includes(query)
      );
    }

    setFilteredModules(filtered);
  };

  const handleToggleStatus = async (module: ModuleDto) => {
    try {
      await moduleService.updateStatus({
        id: module.id,
        isActive: !module.isActive,
      });
      toast.success(
        module.isActive
          ? `${module.name} deactivated`
          : `${module.name} activated`
      );
      loadModules();
    } catch (error: any) {
      console.error("Failed to toggle module status:", error);
      toast.error("Failed to update module status");
    }
  };

  const handleCreateModule = async () => {
    if (!formData.name || !formData.code) {
      toast.error("Name and code are required");
      return;
    }

    try {
      setIsSubmitting(true);
      await moduleService.create({
        name: formData.name,
        code: formData.code,
        description: formData.description || undefined,
      });
      toast.success("Module created successfully");
      setShowCreateDialog(false);
      resetForm();
      loadModules();
    } catch (error: any) {
      console.error("Failed to create module:", error);
      toast.error("Failed to create module");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditModule = async () => {
    if (!selectedModule || !formData.name || !formData.code) {
      toast.error("Name and code are required");
      return;
    }

    try {
      setIsSubmitting(true);
      await moduleService.update({
        id: selectedModule.id,
        name: formData.name,
        code: formData.code,
        description: formData.description || undefined,
      });
      toast.success("Module updated successfully");
      setShowEditDialog(false);
      setSelectedModule(null);
      resetForm();
      loadModules();
    } catch (error: any) {
      console.error("Failed to update module:", error);
      toast.error("Failed to update module");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteModule = async () => {
    if (!selectedModule) return;

    try {
      setIsSubmitting(true);
      await moduleService.delete(selectedModule.id);
      toast.success("Module deleted successfully");
      setShowDeleteDialog(false);
      setSelectedModule(null);
      loadModules();
    } catch (error: any) {
      console.error("Failed to delete module:", error);
      toast.error("Failed to delete module");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openCreateDialog = (config?: any) => {
    if (config) {
      setFormData({
        name: config.name,
        code: config.code,
        description: config.description,
      });
    }
    setShowCreateDialog(true);
  };

  const openEditDialog = (module: ModuleDto) => {
    setSelectedModule(module);
    setFormData({
      name: module.name,
      code: module.code,
      description: module.description || "",
    });
    setShowEditDialog(true);
  };

  const openDeleteDialog = (module: ModuleDto) => {
    setSelectedModule(module);
    setShowDeleteDialog(true);
  };

  const resetForm = () => {
    setFormData({ name: "", code: "", description: "" });
  };

  const getModuleIcon = (code: string) => {
    const config = Object.values(MODULE_CONFIGS).find((c) => c.code === code);
    return config?.icon || "📦";
  };

  const getModuleColor = (code: string) => {
    const config = Object.values(MODULE_CONFIGS).find((c) => c.code === code);
    return config?.color || "gray";
  };

  const stats = {
    total: modules.length,
    active: modules.filter((m) => m.isActive).length,
    inactive: modules.filter((m) => !m.isActive).length,
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-[#00d9ff] mx-auto mb-4" />
            <p className="text-white">Loading modules...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-[#00d9ff]/20 flex items-center justify-center">
              <Boxes className="text-[#00d9ff]" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Module Manager</h1>
              <p className="text-gray-300 mt-1">
                Manage and configure system modules
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={loadModules}
              variant="outline"
              className="gap-2 border-white/10 text-white hover:bg-white/5"
            >
              <RefreshCw size={18} />
              Refresh
            </Button>
            <Button
              onClick={() => openCreateDialog()}
              className="gap-2 bg-[#00d9ff] hover:bg-[#0099cc] text-[#0a1628]"
            >
              <Plus size={18} />
              Add Module
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <GlassCard className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Modules</p>
                <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
              </div>
              <Boxes className="text-gray-400" size={32} />
            </div>
          </GlassCard>
          <GlassCard className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Modules</p>
                <p className="text-2xl font-bold text-green-400 mt-1">{stats.active}</p>
              </div>
              <CheckCircle2 className="text-green-400" size={32} />
            </div>
          </GlassCard>
          <GlassCard className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Inactive Modules</p>
                <p className="text-2xl font-bold text-gray-400 mt-1">{stats.inactive}</p>
              </div>
              <XCircle className="text-gray-400" size={32} />
            </div>
          </GlassCard>
        </div>

        {/* Filters */}
        <GlassCard className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search modules..."
                className="pl-10 bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setFilterStatus("all")}
                variant={filterStatus === "all" ? "default" : "outline"}
                className={filterStatus === "all" ? "bg-[#00d9ff] text-[#0a1628]" : "border-white/10 text-white"}
              >
                All
              </Button>
              <Button
                onClick={() => setFilterStatus("active")}
                variant={filterStatus === "active" ? "default" : "outline"}
                className={filterStatus === "active" ? "bg-green-500 text-white" : "border-white/10 text-white"}
              >
                Active
              </Button>
              <Button
                onClick={() => setFilterStatus("inactive")}
                variant={filterStatus === "inactive" ? "default" : "outline"}
                className={filterStatus === "inactive" ? "bg-gray-500 text-white" : "border-white/10 text-white"}
              >
                Inactive
              </Button>
            </div>
          </div>
        </GlassCard>

        {/* Quick Add Presets */}
        <GlassCard className="p-6">
          <h3 className="text-white font-semibold mb-4">Quick Add Modules</h3>
          <div className="grid grid-cols-4 gap-3">
            {Object.values(MODULE_CONFIGS).map((config) => {
              const exists = modules.some((m) => m.code === config.code);
              return (
                <button
                  key={config.code}
                  onClick={() => !exists && openCreateDialog(config)}
                  disabled={exists}
                  className={`p-3 rounded-lg border transition-all text-left ${
                    exists
                      ? "border-white/10 bg-white/5 opacity-50 cursor-not-allowed"
                      : "border-[#00d9ff]/40 bg-[#00d9ff]/10 hover:bg-[#00d9ff]/20"
                  }`}
                >
                  <div className="text-2xl mb-2">{config.icon}</div>
                  <p className="text-white text-sm font-medium">{config.name}</p>
                  {exists && (
                    <Badge className="mt-2 bg-green-500/20 text-green-400 text-xs">
                      Installed
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>
        </GlassCard>

        {/* Module List */}
        <div className="space-y-3">
          {filteredModules.length === 0 ? (
            <GlassCard className="p-12 text-center">
              <Boxes className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-50" />
              <p className="text-gray-300 text-lg">No modules found</p>
              <p className="text-gray-400 text-sm mt-2">
                {searchQuery ? "Try different search terms" : "Add your first module to get started"}
              </p>
            </GlassCard>
          ) : (
            filteredModules.map((module, index) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <GlassCard className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="text-4xl">{getModuleIcon(module.code)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-white font-semibold text-lg">
                            {module.name}
                          </h3>
                          <Badge
                            className={
                              module.isActive
                                ? "bg-green-500/20 text-green-400"
                                : "bg-gray-500/20 text-gray-400"
                            }
                          >
                            {module.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <p className="text-gray-400 text-sm mt-1">
                          {module.description || "No description"}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            Created {new Date(module.createdAt).toLocaleDateString()}
                          </span>
                          <span>Code: {module.code}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handleToggleStatus(module)}
                        variant="outline"
                        size="sm"
                        className={`gap-2 border-white/10 ${
                          module.isActive
                            ? "text-red-400 hover:bg-red-500/10"
                            : "text-green-400 hover:bg-green-500/10"
                        }`}
                      >
                        {module.isActive ? (
                          <>
                            <PowerOff size={16} />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <Power size={16} />
                            Activate
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={() => openEditDialog(module)}
                        variant="outline"
                        size="sm"
                        className="gap-2 border-white/10 text-white hover:bg-white/5"
                      >
                        <Edit2 size={16} />
                        Edit
                      </Button>
                      <Button
                        onClick={() => openDeleteDialog(module)}
                        variant="outline"
                        size="sm"
                        className="gap-2 border-white/10 text-red-400 hover:bg-red-500/10"
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

      {/* Create Module Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="bg-[#1a2332] border-white/10 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Create New Module</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="module-name" className="text-white">
                Module Name <span className="text-red-400">*</span>
              </Label>
              <Input
                id="module-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Task Management"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="module-code" className="text-white">
                Module Code <span className="text-red-400">*</span>
              </Label>
              <Input
                id="module-code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="e.g., TASK_MANAGEMENT"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="module-desc" className="text-white">
                Description
              </Label>
              <Textarea
                id="module-desc"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Module description..."
                className="bg-white/5 border-white/10 text-white"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => {
                setShowCreateDialog(false);
                resetForm();
              }}
              disabled={isSubmitting}
              className="text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateModule}
              disabled={isSubmitting}
              className="bg-[#00d9ff] hover:bg-[#0099cc] text-[#0a1628]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2" size={16} />
                  Create Module
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Module Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="bg-[#1a2332] border-white/10 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Module</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-white">
                Module Name <span className="text-red-400">*</span>
              </Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-code" className="text-white">
                Module Code <span className="text-red-400">*</span>
              </Label>
              <Input
                id="edit-code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-desc" className="text-white">
                Description
              </Label>
              <Textarea
                id="edit-desc"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => {
                setShowEditDialog(false);
                setSelectedModule(null);
                resetForm();
              }}
              disabled={isSubmitting}
              className="text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditModule}
              disabled={isSubmitting}
              className="bg-[#00d9ff] hover:bg-[#0099cc] text-[#0a1628]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} />
                  Updating...
                </>
              ) : (
                "Update Module"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-[#1a2332] border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Module</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              Are you sure you want to delete <strong>{selectedModule?.name}</strong>?
              This action cannot be undone and will remove all module data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setShowDeleteDialog(false);
                setSelectedModule(null);
              }}
              disabled={isSubmitting}
              className="bg-transparent border-white/10 text-white hover:bg-white/5"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteModule}
              disabled={isSubmitting}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} />
                  Deleting...
                </>
              ) : (
                "Delete Module"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
