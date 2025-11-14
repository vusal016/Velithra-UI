"use client";

import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { roleManagementService } from "@/lib/services/coreServices";
import { authService } from "@/lib/services/authService";
import { toast } from "sonner";
import { motion } from "framer-motion";
import type { RoleDto } from "@/lib/types/core.types";
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

export default function RolesPage() {
  // const router = useRouter();
  // Add/Edit modal state
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editId, setEditId] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [roles, setRoles] = useState<RoleDto[]>([]);
  const [filteredRoles, setFilteredRoles] = useState<RoleDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    roleId: string | null;
    roleName?: string;
  }>({ open: false, roleId: null, roleName: "" });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!authService.hasRole('Admin')) {
      toast.error("Access denied. Admin only.");
      return;
    }
    loadRoles();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      setFilteredRoles(
        roles.filter((role) => role.name.toLowerCase().includes(query))
      );
    } else {
      setFilteredRoles(roles);
    }
  }, [searchQuery, roles]);

  const loadRoles = async () => {
    try {
      setLoading(true);
      const data = await roleManagementService.getAll();
      setRoles(data);
      setFilteredRoles(data);
    } catch (error: any) {
      toast.error("Failed to load roles");
    } finally {
      setLoading(false);
    }
  };

  const handleAddOpen = () => {
    setForm({ name: "", description: "" });
    setAddOpen(true);
  };

  const handleEditOpen = (role: RoleDto) => {
    setForm({ name: role.name, description: role.description || "" });
    setEditId(role.id);
    setEditOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await roleManagementService.create(form);
      toast.success("Role added");
      setAddOpen(false);
      loadRoles();
    } catch (error: any) {
      toast.error(error.message || "Failed to add role");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId) return;
    setFormLoading(true);
    try {
      await roleManagementService.update(editId, { id: editId, ...form });
      toast.success("Role updated");
      setEditOpen(false);
      setEditId(null);
      loadRoles();
    } catch (error: any) {
      toast.error(error.message || "Failed to update role");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      if (deleteDialog.roleId) {
        await roleManagementService.delete(deleteDialog.roleId);
        toast.success("Role deleted successfully");
      }
      setDeleteDialog({ open: false, roleId: null, roleName: "" });
      loadRoles();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete role");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-[#00d9ff] mx-auto mb-4" />
            <p className="text-white">Loading roles...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Role Management</h1>
          <p className="text-gray-300 mt-1">
            Manage system roles and permissions
          </p>
        </div>
        <Button
          onClick={handleAddOpen}
          className="bg-[#00d9ff] hover:bg-[#0099cc] text-[#0a1628] font-semibold gap-2"
        >
          <Plus size={18} />
          Add Role
        </Button>
      </div>

      {/* Search */}
      <GlassCard>
        <div className="p-4">
          <div className="relative">
            <Input
              placeholder="Search roles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400"
            />
          </div>
        </div>
      </GlassCard>

      {/* Roles List */}
      <GlassCard>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 text-gray-300 font-semibold">
                  Role Name
                </th>
                <th className="text-left p-4 text-gray-300 font-semibold">
                  Description
                </th>
                <th className="text-right p-4 text-gray-300 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRoles.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-gray-400">
                    {searchQuery
                      ? "No roles found matching your search"
                      : "No roles available"}
                  </td>
                </tr>
              ) : (
                filteredRoles.map((role, index) => (
                  <tr
                    key={role.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4 text-white font-medium">{role.name}</td>
                    <td className="p-4 text-gray-300">{role.description || "N/A"}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditOpen(role)}
                          className="text-[#00d9ff] hover:text-[#0099cc] hover:bg-white/5"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setDeleteDialog({
                              open: true,
                              roleId: role.id,
                              roleName: role.name,
                            })
                          }
                          className="text-red-400 hover:text-red-300 hover:bg-white/5"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          !deleting &&
          setDeleteDialog({ open, roleId: null, roleName: "" })
        }
      >
        <AlertDialogContent className="bg-[#1a2332] border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="text-red-400" size={24} />
              Delete Role
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              Are you sure you want to delete the role{" "}
              <span className="font-semibold text-white">
                {deleteDialog.roleName}
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleting}
              className="bg-white/5 text-white hover:bg-white/10 border-white/10"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {deleting ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
