"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { departmentService } from "@/lib/services/hrService";
import { DepartmentDto } from "@/lib/types/module.types";
import { toast } from "sonner";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<DepartmentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", description: "" });
  const [addLoading, setAddLoading] = useState(false);

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    setLoading(true);
    try {
      const data = await departmentService.getAll();
      setDepartments(data);
    } catch (error: any) {
      toast.error("Failed to load departments");
    } finally {
      setLoading(false);
    }
  };

  const handleAddOpen = () => {
    setAddForm({ name: "", description: "" });
    setAddOpen(true);
  };

  const handleAddChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    try {
      await departmentService.create(addForm);
      toast.success("Department added");
      setAddOpen(false);
      loadDepartments();
    } catch (error: any) {
      toast.error("Failed to add department");
    } finally {
      setAddLoading(false);
    }
  };

  // Edit/Delete
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ id: "", name: "", description: "" });
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleEditOpen = (dept: DepartmentDto) => {
    setEditForm({ id: dept.id, name: dept.name, description: dept.description || "" });
    setEditOpen(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      await departmentService.update(editForm.id, { id: editForm.id, name: editForm.name, description: editForm.description });
      toast.success("Department updated");
      setEditOpen(false);
      loadDepartments();
    } catch (error: any) {
      toast.error("Failed to update department");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this department?")) return;
    setDeleteLoading(true);
    try {
      await departmentService.delete(id);
      toast.success("Department deleted");
      loadDepartments();
    } catch (error: any) {
      toast.error("Failed to delete department");
    } finally {
      setDeleteLoading(false);
    }
  };

  // TODO: Add Edit/Delete modals and logic

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Departments</h1>
          <Button className="gap-2 bg-primary text-background" onClick={handleAddOpen}>
            <Plus size={18} /> New Department
          </Button>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogContent>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <DialogHeader>
                <DialogTitle>Add Department</DialogTitle>
              </DialogHeader>
              <div>
                <label htmlFor="deptName" className="block text-sm font-medium mb-1">Name</label>
                <Input id="deptName" name="name" value={addForm.name} onChange={handleAddChange} required placeholder="Enter name" className="w-full" />
              </div>
              <div>
                <label htmlFor="deptDesc" className="block text-sm font-medium mb-1">Description</label>
                <Input id="deptDesc" name="description" value={addForm.description} onChange={handleAddChange} placeholder="Enter description" className="w-full" />
              </div>
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setAddOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-primary text-background" disabled={addLoading}>
                  {addLoading ? <Loader2 className="animate-spin mr-2" size={16} /> : "Add Department"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        <GlassCard>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="animate-spin mr-2" /> Loading departments...
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="border-b border-white/10">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-foreground">Name</th>
                    <th className="px-6 py-3 text-left font-semibold text-foreground">Description</th>
                    <th className="px-6 py-3 text-left font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map((dept) => (
                    <tr key={dept.id} className="border-b border-white/5">
                      <td className="px-6 py-4 font-medium">{dept.name}</td>
                      <td className="px-6 py-4">{dept.description}</td>
                      <td className="px-6 py-4 flex gap-2">
                        <Button size="icon" variant="ghost" title="Edit" onClick={() => handleEditOpen(dept)}>
                          <Edit size={16} />
                        </Button>
                        <Button size="icon" variant="destructive" title="Delete" onClick={() => handleDelete(dept.id)} disabled={deleteLoading}>
                          <Trash2 size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
