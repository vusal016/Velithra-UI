"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Save,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { authService } from "@/lib/services/authService";
import { userManagementService, roleManagementService } from "@/lib/services/coreServices";
import { toast } from "sonner";
import type { AppUserDto, RoleDto } from "@/lib/types/core.types";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
  // Modal state for Add/Edit
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUser, setEditUser] = useState<AppUserDto | null>(null);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [addForm, setAddForm] = useState({
    userName: "",
    email: "",
    password: "",
    roleId: "",
  });
  const [addSubmitting, setAddSubmitting] = useState(false);
  const [editForm, setEditForm] = useState({
    id: "",
    userName: "",
    email: "",
  });
  const [editSubmitting, setEditSubmitting] = useState(false);

export default function UsersManagementPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<AppUserDto[]>([]);
  const [roles, setRoles] = useState<RoleDto[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    userId: string | null;
    userName: string;
  }>({ open: false, userId: null, userName: "" });
  const pageSize = 10;

  useEffect(() => {
    // Check authentication and admin role
    if (!authService.isAuthenticated() || !authService.hasRole('Admin')) {
      toast.error("Access denied - Admin role required");
      router.push("/dashboard");
      return;
    }

    loadData();
  }, [router, currentPage]);

  const loadData = async () => {
    try {
      setLoading(true);
      setRolesLoading(true);
      // Load roles for reference
      const rolesData = await roleManagementService.getAll();
      setRoles(rolesData);
      setRolesLoading(false);
      // Load users with pagination
      const result = await userManagementService.getPaged(currentPage, pageSize);
      setUsers(result.items);
      setTotalPages(result.totalPages);
    } catch (error: any) {
      setRolesLoading(false);
      console.error("Failed to load users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      if (!searchTerm.trim()) {
        await loadData();
        return;
      }

      // Client-side filtering for now
      const allUsers = await userManagementService.getAll();
      const filtered = allUsers.filter(
        (user) =>
          user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setUsers(filtered);
      setTotalPages(1);
    } catch (error) {
      toast.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.userId) return;

    try {
      await userManagementService.delete(deleteDialog.userId);
      toast.success("User deleted successfully");
      setDeleteDialog({ open: false, userId: null, userName: "" });
      await loadData();
    } catch (error: any) {
      console.error("Failed to delete user:", error);
      toast.error(error.message || "Failed to delete user");
    }
  };

  const filteredUsers = searchTerm
    ? users.filter(
        (user) =>
          user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : users;

  if (loading && users.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#00d9ff] mx-auto mb-4" />
          <p className="text-white">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">User Management</h1>
            <p className="text-gray-400">Manage system users and their roles</p>
          </div>
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-primary hover:bg-primary-dark"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Add User
          </Button>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <GlassCard className="p-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search by username, email, or full name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10 bg-white/5 border-white/10"
                />
              </div>
              <Button onClick={handleSearch} className="bg-primary hover:bg-primary-dark">
                Search
              </Button>
            </div>
          </GlassCard>
        </motion.div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <GlassCard className="p-6">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No users found</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-4 px-4 text-gray-400 font-medium">Username</th>
                        <th className="text-left py-4 px-4 text-gray-400 font-medium">Email</th>
                        <th className="text-left py-4 px-4 text-gray-400 font-medium">Full Name</th>
                        <th className="text-left py-4 px-4 text-gray-400 font-medium">Created At</th>
                        <th className="text-right py-4 px-4 text-gray-400 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user, index) => (
                        <motion.tr
                          key={user.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="border-b border-white/5 hover:bg-white/5"
                        >
                          <td className="py-4 px-4">
                            <span className="text-white font-medium">{user.userName}</span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-gray-300">{user.email}</span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-gray-300">{user.fullName || "-"}</span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-gray-400 text-sm">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={async () => {
                                  setEditSubmitting(false);
                                  setEditUser(user);
                                  setEditForm({
                                    id: user.id,
                                    userName: user.userName,
                                    email: user.email,
                                  });
                                  setShowEditModal(true);
                                }}
                                className="hover:bg-blue-500/10 text-blue-400"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                                    {/* Add User Modal */}
                                    <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
                                      <DialogContent className="bg-[#1a1a2e] border-white/10">
                                        <DialogHeader>
                                          <DialogTitle className="text-white">Add User</DialogTitle>
                                        </DialogHeader>
                                        <form
                                          onSubmit={async (e) => {
                                            e.preventDefault();
                                            if (!addForm.userName || !addForm.email || !addForm.password || !addForm.roleId) {
                                              toast.error("Please fill in all required fields");
                                              return;
                                            }
                                            try {
                                              setAddSubmitting(true);
                                              await userManagementService.create({
                                                ...addForm,
                                                fullName: addForm.userName,
                                              });
                                              toast.success("User created successfully!");
                                              setShowAddModal(false);
                                              setAddForm({ userName: "", email: "", password: "", roleId: "" });
                                              await loadData();
                                            } catch (error: any) {
                                              toast.error(error.message || "Failed to create user");
                                            } finally {
                                              setAddSubmitting(false);
                                            }
                                          }}
                                          className="space-y-4 py-2"
                                        >
                                          <div className="space-y-2">
                                            <Label htmlFor="add-userName" className="text-white">Username *</Label>
                                            <Input
                                              id="add-userName"
                                              value={addForm.userName}
                                              onChange={e => setAddForm(f => ({ ...f, userName: e.target.value }))}
                                              className="bg-white/5 border-white/10 text-white"
                                              placeholder="Enter username"
                                              required
                                            />
                                          </div>
                                          <div className="space-y-2">
                                            <Label htmlFor="add-email" className="text-white">Email *</Label>
                                            <Input
                                              id="add-email"
                                              type="email"
                                              value={addForm.email}
                                              onChange={e => setAddForm(f => ({ ...f, email: e.target.value }))}
                                              className="bg-white/5 border-white/10 text-white"
                                              placeholder="user@example.com"
                                              required
                                            />
                                          </div>
                                          <div className="space-y-2">
                                            <Label htmlFor="add-password" className="text-white">Password *</Label>
                                            <Input
                                              id="add-password"
                                              type="password"
                                              value={addForm.password}
                                              onChange={e => setAddForm(f => ({ ...f, password: e.target.value }))}
                                              className="bg-white/5 border-white/10 text-white"
                                              placeholder="Password"
                                              required
                                            />
                                          </div>
                                          <div className="space-y-2">
                                            <Label htmlFor="add-role" className="text-white">Role *</Label>
                                            <Select
                                              value={addForm.roleId}
                                              onValueChange={val => setAddForm(f => ({ ...f, roleId: val }))}
                                              disabled={rolesLoading}
                                            >
                                              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                                <SelectValue placeholder="Select role" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                {roles.map(role => (
                                                  <SelectItem key={role.id} value={role.id} className="text-white">
                                                    {role.name}
                                                  </SelectItem>
                                                ))}
                                              </SelectContent>
                                            </Select>
                                          </div>
                                          <DialogFooter>
                                            <Button
                                              type="button"
                                              variant="outline"
                                              onClick={() => setShowAddModal(false)}
                                              className="border-white/20"
                                              disabled={addSubmitting}
                                            >
                                              Cancel
                                            </Button>
                                            <Button type="submit" className="bg-primary hover:bg-primary-dark" disabled={addSubmitting}>
                                              {addSubmitting ? <Loader2 className="animate-spin w-4 h-4" /> : <UserPlus className="w-4 h-4" />} Add User
                                            </Button>
                                          </DialogFooter>
                                        </form>
                                      </DialogContent>
                                    </Dialog>

                                    {/* Edit User Modal */}
                                    <Dialog open={showEditModal} onOpenChange={open => { setShowEditModal(open); if (!open) setEditUser(null); }}>
                                      <DialogContent className="bg-[#1a1a2e] border-white/10">
                                        <DialogHeader>
                                          <DialogTitle className="text-white">Edit User</DialogTitle>
                                        </DialogHeader>
                                        <form
                                          onSubmit={async (e) => {
                                            e.preventDefault();
                                            if (!editForm.userName || !editForm.email) {
                                              toast.error("Please fill in all required fields");
                                              return;
                                            }
                                            try {
                                              setEditSubmitting(true);
                                              await userManagementService.update(editForm);
                                              toast.success("User updated successfully!");
                                              setShowEditModal(false);
                                              setEditUser(null);
                                              await loadData();
                                            } catch (error: any) {
                                              toast.error(error.message || "Failed to update user");
                                            } finally {
                                              setEditSubmitting(false);
                                            }
                                          }}
                                          className="space-y-4 py-2"
                                        >
                                          <div className="space-y-2">
                                            <Label htmlFor="edit-userName" className="text-white">Username *</Label>
                                            <Input
                                              id="edit-userName"
                                              value={editForm.userName}
                                              onChange={e => setEditForm(f => ({ ...f, userName: e.target.value }))}
                                              className="bg-white/5 border-white/10 text-white"
                                              placeholder="Enter username"
                                              required
                                            />
                                          </div>
                                          <div className="space-y-2">
                                            <Label htmlFor="edit-email" className="text-white">Email *</Label>
                                            <Input
                                              id="edit-email"
                                              type="email"
                                              value={editForm.email}
                                              onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))}
                                              className="bg-white/5 border-white/10 text-white"
                                              placeholder="user@example.com"
                                              required
                                            />
                                          </div>
                                          <DialogFooter>
                                            <Button
                                              type="button"
                                              variant="outline"
                                              onClick={() => setShowEditModal(false)}
                                              className="border-white/20"
                                              disabled={editSubmitting}
                                            >
                                              Cancel
                                            </Button>
                                            <Button type="submit" className="bg-primary hover:bg-primary-dark" disabled={editSubmitting}>
                                              {editSubmitting ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />} Save Changes
                                            </Button>
                                          </DialogFooter>
                                        </form>
                                      </DialogContent>
                                    </Dialog>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  setDeleteDialog({
                                    open: true,
                                    userId: user.id,
                                    userName: user.userName,
                                  })
                                }
                                className="hover:bg-red-500/10 text-red-400"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/10">
                    <p className="text-gray-400 text-sm">
                      Page {currentPage} of {totalPages}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1 || loading}
                        className="border-white/20"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages || loading}
                        className="border-white/20"
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </GlassCard>
        </motion.div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => !open && setDeleteDialog({ open: false, userId: null, userName: "" })}>
        <DialogContent className="bg-[#1a1a2e] border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-300">
              Are you sure you want to delete user <strong>{deleteDialog.userName}</strong>?
            </p>
            <p className="text-gray-400 text-sm mt-2">This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, userId: null, userName: "" })}
              className="border-white/20"
            >
              Cancel
            </Button>
            <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
