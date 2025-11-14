"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { employeeService } from "@/lib/services/hrService";
import { EmployeeDto } from "@/lib/types/module.types";
import { toast } from "sonner";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<EmployeeDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    positionTitle: "",
    departmentName: "",
    status: "Active",
    hireDate: "",
    dateOfBirth: "",
    phoneNumber: "",
    address: "",
    positionId: "",
    departmentId: ""
  });
  const [addLoading, setAddLoading] = useState(false);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const data = await employeeService.getAll();
      setEmployees(data);
    } catch (error: any) {
      toast.error("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  const handleAddOpen = () => {
    setAddForm({
      firstName: "",
      lastName: "",
      email: "",
      positionTitle: "",
      departmentName: "",
      status: "Active",
      hireDate: "",
      dateOfBirth: "",
      phoneNumber: "",
      address: "",
      positionId: "",
      departmentId: ""
    });
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
      // Ensure all required fields for EmployeeCreateDto are present
      // All required fields are now present in addForm
      await employeeService.create({
        ...addForm,
        dateOfBirth: addForm.dateOfBirth || new Date().toISOString(),
      });
      toast.success("Employee added");
      setAddOpen(false);
      loadEmployees();
    } catch (error: any) {
      toast.error("Failed to add employee");
    } finally {
      setAddLoading(false);
    }
  };

  // Edit/Delete logic
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<any>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleEditOpen = (emp: EmployeeDto) => {
    setEditForm({ ...emp });
    setEditOpen(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm?.id) return;
    setEditLoading(true);
    try {
      await employeeService.update(editForm.id, editForm);
      toast.success('Employee updated');
      setEditOpen(false);
      loadEmployees();
    } catch (error: any) {
      toast.error('Failed to update employee');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    setDeleteLoading(true);
    try {
      await employeeService.delete(id);
      toast.success('Employee deleted');
      loadEmployees();
    } catch (error: any) {
      toast.error('Failed to delete employee');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Employees</h1>
          <Button className="gap-2 bg-primary text-background" onClick={handleAddOpen}>
            <Plus size={18} /> New Employee
          </Button>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogContent>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <DialogHeader>
                <DialogTitle>Add Employee</DialogTitle>
              </DialogHeader>
              <div>
                <label htmlFor="empFirstName" className="block text-sm font-medium mb-1">First Name</label>
                <Input id="empFirstName" name="firstName" value={addForm.firstName} onChange={handleAddChange} required placeholder="Enter first name" className="w-full" />
              </div>
              <div>
                <label htmlFor="empLastName" className="block text-sm font-medium mb-1">Last Name</label>
                <Input id="empLastName" name="lastName" value={addForm.lastName} onChange={handleAddChange} required placeholder="Enter last name" className="w-full" />
              </div>
              <div>
                <label htmlFor="empEmail" className="block text-sm font-medium mb-1">Email</label>
                <Input id="empEmail" name="email" value={addForm.email} onChange={handleAddChange} required placeholder="Enter email" className="w-full" />
              </div>
              <div>
                <label htmlFor="empPosition" className="block text-sm font-medium mb-1">Position</label>
                <Input id="empPosition" name="positionTitle" value={addForm.positionTitle} onChange={handleAddChange} placeholder="Enter position" className="w-full" />
              </div>
              <div>
                <label htmlFor="empDepartment" className="block text-sm font-medium mb-1">Department</label>
                <Input id="empDepartment" name="departmentName" value={addForm.departmentName} onChange={handleAddChange} placeholder="Enter department" className="w-full" />
              </div>
              <div>
                <label htmlFor="empStatus" className="block text-sm font-medium mb-1">Status</label>
                <Input id="empStatus" name="status" value={addForm.status} onChange={handleAddChange} placeholder="Active/OnLeave/Terminated" className="w-full" />
              </div>
              <div>
                <label htmlFor="empHireDate" className="block text-sm font-medium mb-1">Hire Date</label>
                <Input id="empHireDate" name="hireDate" value={addForm.hireDate} onChange={handleAddChange} placeholder="YYYY-MM-DD" className="w-full" />
              </div>
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setAddOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-primary text-background" disabled={addLoading}>
                  {addLoading ? <Loader2 className="animate-spin mr-2" size={16} /> : "Add Employee"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        <GlassCard>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="animate-spin mr-2" /> Loading employees...
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="border-b border-white/10">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-foreground">First Name</th>
                    <th className="px-6 py-3 text-left font-semibold text-foreground">Last Name</th>
                    <th className="px-6 py-3 text-left font-semibold text-foreground">Email</th>
                    <th className="px-6 py-3 text-left font-semibold text-foreground">Position</th>
                    <th className="px-6 py-3 text-left font-semibold text-foreground">Department</th>
                    <th className="px-6 py-3 text-left font-semibold text-foreground">Status</th>
                    <th className="px-6 py-3 text-left font-semibold text-foreground">Hire Date</th>
                    <th className="px-6 py-3 text-left font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp.id} className="border-b border-white/5">
                      <td className="px-6 py-4 font-medium">{emp.firstName}</td>
                      <td className="px-6 py-4">{emp.lastName}</td>
                      <td className="px-6 py-4">{emp.email}</td>
                      <td className="px-6 py-4">{emp.positionTitle}</td>
                      <td className="px-6 py-4">{emp.departmentName}</td>
                      <td className="px-6 py-4">{emp.status}</td>
                      <td className="px-6 py-4">{emp.hireDate}</td>
                      <td className="px-6 py-4 flex gap-2">
                        <Button size="icon" variant="ghost" title="Edit" onClick={() => handleEditOpen(emp)}>
                          <Edit size={16} />
                        </Button>
                        <Button size="icon" variant="destructive" title="Delete" onClick={() => handleDelete(emp.id)} disabled={deleteLoading}>
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
