"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit, Loader2, Search, Check, X } from "lucide-react";
import { toast } from "sonner";
import apiClient from "@/lib/api/client";
import type { GenericResponse } from "@/lib/types";

interface ModuleDto {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export default function ModulesPage() {
  const [modules, setModules] = useState<ModuleDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<ModuleDto | null>(null);
  const [addForm, setAddForm] = useState({ name: "", description: "" });
  const [editForm, setEditForm] = useState({ id: "", name: "", description: "", isActive: true });
  const [addLoading, setAddLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadModules();
  }, []);

  const loadModules = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get<GenericResponse<ModuleDto[]>>('/module');
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to load modules');
      }
      setModules(response.data.data || []);
    } catch (error: any) {
      console.error('Error loading modules:', error);
      toast.error(error.message || "Failed to load modules");
      setModules([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOpen = () => {
    setAddForm({ name: "", description: "" });
    setAddOpen(true);
  };

  const handleAddChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAddForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    try {
      const response = await apiClient.post<GenericResponse<string>>('/module', addForm);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to add module');
      }
      toast.success("Module added successfully");
      setAddOpen(false);
      loadModules();
    } catch (error: any) {
      console.error('Error adding module:', error);
      toast.error(error.message || "Failed to add module");
    } finally {
      setAddLoading(false);
    }
  };

  const handleEditOpen = (mod: ModuleDto) => {
    setEditForm({ id: mod.id, name: mod.name, description: mod.description, isActive: mod.isActive });
    setEditOpen(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let fieldValue: string | boolean = value;
    if (type === "checkbox") fieldValue = (e.target as HTMLInputElement).checked;
    setEditForm((prev) => ({ ...prev, [name]: fieldValue }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      const response = await apiClient.put<GenericResponse<string>>('/module', {
        id: editForm.id,
        name: editForm.name,
        description: editForm.description,
        isActive: editForm.isActive,
      });
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update module');
      }
      toast.success("Module updated successfully");
      setEditOpen(false);
      loadModules();
    } catch (error: any) {
      console.error('Error updating module:', error);
      toast.error(error.message || "Failed to update module");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteOpen = (mod: ModuleDto) => {
    setSelectedModule(mod);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedModule) return;
    setDeleteLoading(true);
    try {
      const response = await apiClient.delete<GenericResponse<boolean>>(`/module/${selectedModule.id}`);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to delete module');
      }
      toast.success("Module deleted successfully");
      setDeleteOpen(false);
      loadModules();
    } catch (error: any) {
      console.error('Error deleting module:', error);
      toast.error(error.message || "Failed to delete module");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleStatusToggle = async (mod: ModuleDto) => {
    setStatusLoading(mod.id);
    try {
      const response = await apiClient.patch<GenericResponse<boolean>>('/module/status', {
        id: mod.id,
        isActive: !mod.isActive
      });
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update status');
      }
      toast.success("Status updated successfully");
      loadModules();
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error(error.message || "Failed to update status");
    } finally {
      setStatusLoading(null);
    }
  };

  const filteredModules = modules.filter(mod => 
    mod.name.toLowerCase().includes(search.toLowerCase()) ||
    mod.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Module Manager</h1>
            <p className="text-gray-400 mt-1">Manage and configure system modules</p>
          </div>
          <Button 
            className="gap-2 bg-gradient-to-r from-[#00d9ff] to-[#00ffa3] text-[#0a1628] font-bold shadow-lg shadow-[#00d9ff]/30 hover:scale-105 transition-transform" 
            onClick={handleAddOpen}
          >
            <Plus size={18} />
            New Module
          </Button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 max-w-xs">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search modules..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white"
            />
          </div>
        </div>

        {/* Add Module Dialog */}
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogContent className="bg-[#1a1a2e] border-white/10">
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <DialogHeader>
                <DialogTitle className="text-white">Add New Module</DialogTitle>
              </DialogHeader>
              <div>
                <label htmlFor="moduleName" className="block text-sm font-medium mb-1 text-gray-400">Module Name</label>
                <Input
                  id="moduleName"
                  name="name"
                  value={addForm.name}
                  onChange={handleAddChange}
                  required
                  placeholder="Enter module name"
                  className="w-full bg-white/5 border-white/10 text-white"
                />
              </div>
              <div>
                <label htmlFor="moduleDescription" className="block text-sm font-medium mb-1 text-gray-400">Description</label>
                <Textarea
                  id="moduleDescription"
                  name="description"
                  value={addForm.description}
                  onChange={handleAddChange}
                  placeholder="Enter description"
                  className="w-full bg-white/5 border-white/10 text-white"
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setAddOpen(false)} className="text-white">
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary-dark" disabled={addLoading}>
                  {addLoading ? <><Loader2 className="animate-spin mr-2" size={16} />Adding...</> : "Add Module"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Module Dialog */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="bg-[#1a1a2e] border-white/10">
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <DialogHeader>
                <DialogTitle className="text-white">Edit Module</DialogTitle>
              </DialogHeader>
              <div>
                <label htmlFor="editModuleName" className="block text-sm font-medium mb-1 text-gray-400">Module Name</label>
                <Input
                  id="editModuleName"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  required
                  placeholder="Enter module name"
                  className="w-full bg-white/5 border-white/10 text-white"
                />
              </div>
              <div>
                <label htmlFor="editModuleDescription" className="block text-sm font-medium mb-1 text-gray-400">Description</label>
                <Textarea
                  id="editModuleDescription"
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                  placeholder="Enter description"
                  className="w-full bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={editForm.isActive}
                  onChange={handleEditChange}
                  id="editIsActive"
                  className="w-4 h-4"
                />
                <label htmlFor="editIsActive" className="text-sm text-gray-400">Active</label>
              </div>
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setEditOpen(false)} className="text-white">
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary-dark" disabled={editLoading}>
                  {editLoading ? <><Loader2 className="animate-spin mr-2" size={16} />Saving...</> : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Module Dialog */}
        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogContent className="bg-[#1a1a2e] border-white/10">
            <DialogHeader>
              <DialogTitle className="text-white">Delete Module</DialogTitle>
            </DialogHeader>
            <div className="text-gray-300">
              Are you sure you want to delete <b className="text-white">{selectedModule?.name}</b>?
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setDeleteOpen(false)} className="text-white">
                Cancel
              </Button>
              <Button type="button" variant="destructive" onClick={handleDeleteConfirm} disabled={deleteLoading}>
                {deleteLoading ? <><Loader2 className="animate-spin mr-2" size={16} />Deleting...</> : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modules Table */}
        <GlassCard className="backdrop-blur-lg bg-gradient-to-br from-[#0a1628]/80 to-[#00d9ff]/10 border border-[#00d9ff]/20 shadow-xl">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="animate-spin mr-2 text-primary" size={32} /> 
                <span className="text-white">Loading modules...</span>
              </div>
            ) : !filteredModules || filteredModules.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400">No modules found</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="border-b border-[#00d9ff]/20">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-white">Module</th>
                    <th className="px-6 py-3 text-left font-semibold text-white">Description</th>
                    <th className="px-6 py-3 text-left font-semibold text-white">Status</th>
                    <th className="px-6 py-3 text-left font-semibold text-white">Created At</th>
                    <th className="px-6 py-3 text-left font-semibold text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredModules.map((mod) => (
                    <tr key={mod.id} className="border-b border-[#00d9ff]/10 hover:bg-[#00d9ff]/5 transition">
                      <td className="px-6 py-4 font-medium text-white">{mod.name}</td>
                      <td className="px-6 py-4 text-gray-300">{mod.description}</td>
                      <td className="px-6 py-4">
                        <Button
                          size="sm"
                          variant={mod.isActive ? "secondary" : "ghost"}
                          className={`border ${mod.isActive ? "border-green-400 bg-green-500/20" : "border-red-400 bg-red-500/20"} transition-all`}
                          title="Toggle Status"
                          onClick={() => handleStatusToggle(mod)}
                          disabled={statusLoading === mod.id}
                        >
                          {statusLoading === mod.id ? (
                            <Loader2 className="animate-spin" size={16} />
                          ) : mod.isActive ? (
                            <><Check className="text-green-400 mr-1" size={16} />Active</>
                          ) : (
                            <><X className="text-red-400 mr-1" size={16} />Inactive</>
                          )}
                        </Button>
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {mod.createdAt ? new Date(mod.createdAt).toLocaleDateString() : "-"}
                      </td>
                      <td className="px-6 py-4 flex gap-2">
                        <Button size="icon" variant="ghost" title="Edit" onClick={() => handleEditOpen(mod)} className="hover:bg-white/10">
                          <Edit size={16} className="text-blue-400" />
                        </Button>
                        <Button size="icon" variant="ghost" title="Delete" onClick={() => handleDeleteOpen(mod)} className="hover:bg-red-500/20">
                          <Trash2 size={16} className="text-red-400" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="flex justify-between items-center py-4 px-6 border-t border-white/10">
            <div className="text-xs text-gray-400">
              Total: {filteredModules.length} module(s)
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
