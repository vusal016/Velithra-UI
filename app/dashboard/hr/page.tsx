"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Plus, Loader2, Search, Edit, Trash2, Eye, X } from "lucide-react"
import { employeeService, departmentService, positionService } from "@/lib/services/hrService"
import { EmployeeDto, DepartmentDto, PositionDto } from "@/lib/types/module.types"
import { toast } from "sonner"


const statusColors: Record<string, string> = {
  Active: "bg-green-500/20 text-green-400",
  OnLeave: "bg-yellow-500/20 text-yellow-400",
  Terminated: "bg-red-500/20 text-red-400",
}
const statusLabels: Record<string, string> = {
  Active: "Active",
  OnLeave: "On Leave",
  Terminated: "Terminated",
}
function getEmployeeStatus(employee: EmployeeDto): string {
  if (employee.status) return employee.status
  return "Active"
}


export default function HRManagerPage() {
  const router = useRouter();
  
  // State for employees, pagination, search, filter, modals, loading, etc.
  const [employees, setEmployees] = useState<EmployeeDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeDto | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch employees (paged, search, filter)
  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true);
      try {
        const res = await employeeService.getPaged(page, pageSize, search, status);
        console.log("API Response:", res);
        console.log("Employee Data:", res.items);
        setEmployees(res.items);
        setTotalPages(res.totalPages);
        setTotalCount(res.totalCount);
      } catch (error: any) {
        console.error("Employee fetch error:", error);
        toast.error(error.message || "Failed to fetch employees");
      } finally {
        setIsLoading(false);
      }
    };
    fetchEmployees();
  }, [page, pageSize, search, status]);


  // Handlers for modals (Add/Edit/View/Delete)
  const handleAddOpen = () => {
    router.push("/dashboard/hr/add");
  };
  
  const handleEditOpen = (emp: EmployeeDto) => { 
    setSelectedEmployee(emp); 
    setEditOpen(true); 
  };
  
  const handleViewOpen = (emp: EmployeeDto) => { 
    setSelectedEmployee(emp); 
    setViewOpen(true); 
  };
  
  const handleDeleteOpen = (emp: EmployeeDto) => { 
    setSelectedEmployee(emp); 
    setDeleteOpen(true); 
  };
  
  const handleModalClose = () => { 
    setAddOpen(false); 
    setEditOpen(false); 
    setViewOpen(false); 
    setDeleteOpen(false); 
    setSelectedEmployee(null); 
  };

  const handleDeleteConfirm = async () => {
    if (!selectedEmployee) return;
    
    try {
      setIsDeleting(true);
      await employeeService.delete(selectedEmployee.id);
      toast.success(`${selectedEmployee.firstName} ${selectedEmployee.lastName} deleted successfully`);
      setDeleteOpen(false);
      setSelectedEmployee(null);
      // Refresh employee list
      const res = await employeeService.getPaged(page, pageSize, search, status);
      setEmployees(res.items);
      setTotalPages(res.totalPages);
      setTotalCount(res.totalCount);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete employee");
    } finally {
      setIsDeleting(false);
    }
  };

  // Search submit
  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setPage(1); };
  // Status filter
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => { setStatus(e.target.value); setPage(1); };
  // Pagination
  const handlePageChange = (newPage: number) => { if (newPage < 1 || newPage > totalPages) return; setPage(newPage); };

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">HR Manager</h1>
        <Button onClick={handleAddOpen} className="gap-2 bg-gradient-to-r from-[#00d9ff] to-[#00ffa3] text-[#0a1628] font-bold shadow-lg shadow-[#00d9ff]/30 hover:scale-105 transition-transform">
          <Plus size={18} /> Add Employee
        </Button>
      </div>

      {/* Search & Filter */}
      <form onSubmit={handleSearch} className="flex gap-2 max-w-xl">
        <input
          className="rounded px-3 py-2 border border-[#00d9ff]/30 bg-background/60 text-foreground"
          placeholder="Search employees..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="rounded px-3 py-2 border border-[#00d9ff]/30 bg-background/60 text-foreground" value={status} onChange={handleStatusChange}>
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="OnLeave">On Leave</option>
          <option value="Terminated">Terminated</option>
        </select>
        <Button type="submit" size="icon" variant="ghost"><Search /></Button>
      </form>

      {/* Table */}
      <GlassCard className="backdrop-blur-lg bg-gradient-to-br from-[#0a1628]/80 to-[#00d9ff]/10 border border-[#00d9ff]/20 shadow-xl">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#00d9ff]" />
            </div>
          ) : !employees || employees.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#6b8ca8]">No employees found</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-[#00d9ff]/20">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Name</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Email</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Department</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Position</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Hire Date</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Status</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees?.map(emp => (
                  <tr key={emp.id} className="border-b border-[#00d9ff]/10 hover:bg-[#00d9ff]/5 transition">
                    <td className="px-6 py-4 font-medium">{emp.firstName} {emp.lastName}</td>
                    <td className="px-6 py-4">{emp.email}</td>
                    <td className="px-6 py-4">{emp.departmentName || '-'}</td>
                    <td className="px-6 py-4">{emp.positionTitle || '-'}</td>
                    <td className="px-6 py-4">{emp.hireDate ? new Date(emp.hireDate).toLocaleDateString() : '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs ${statusColors[getEmployeeStatus(emp)]}`}>
                        {statusLabels[getEmployeeStatus(emp)]}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        title="View" 
                        onClick={() => {
                          console.log("View clicked for employee:", emp);
                          toast.info(`Viewing ${emp.firstName} ${emp.lastName}`);
                          handleViewOpen(emp);
                        }}
                      >
                        <Eye size={16} />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        title="Edit" 
                        onClick={() => {
                          console.log("Edit clicked for employee:", emp);
                          toast.info(`Editing ${emp.firstName} ${emp.lastName}`);
                          handleEditOpen(emp);
                        }}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="destructive" 
                        title="Delete" 
                        onClick={() => {
                          console.log("Delete clicked for employee:", emp);
                          handleDeleteOpen(emp);
                        }}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {/* Pagination */}
        <div className="flex justify-between items-center py-4 px-2">
          <div className="text-xs text-muted-foreground">Total: {totalCount}</div>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => handlePageChange(page - 1)} disabled={page === 1}>Prev</Button>
            <span className="text-xs">Page {page} / {totalPages}</span>
            <Button size="sm" variant="ghost" onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>Next</Button>
          </div>
        </div>
      </GlassCard>

      {/* View Employee Modal */}
      <Dialog open={viewOpen} onOpenChange={(open) => !open && handleModalClose()}>
        <DialogContent className="bg-[#1a2332] border-white/10 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white text-2xl">Employee Details</DialogTitle>
          </DialogHeader>
          {selectedEmployee && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-400 text-xs">First Name</Label>
                  <p className="text-white font-medium">{selectedEmployee.firstName}</p>
                </div>
                <div>
                  <Label className="text-gray-400 text-xs">Last Name</Label>
                  <p className="text-white font-medium">{selectedEmployee.lastName}</p>
                </div>
                <div>
                  <Label className="text-gray-400 text-xs">Email</Label>
                  <p className="text-white font-medium">{selectedEmployee.email}</p>
                </div>
                <div>
                  <Label className="text-gray-400 text-xs">Phone</Label>
                  <p className="text-white font-medium">{(selectedEmployee as any).phoneNumber || '-'}</p>
                </div>
                <div>
                  <Label className="text-gray-400 text-xs">Department</Label>
                  <p className="text-white font-medium">{selectedEmployee.departmentName || '-'}</p>
                </div>
                <div>
                  <Label className="text-gray-400 text-xs">Position</Label>
                  <p className="text-white font-medium">{selectedEmployee.positionTitle || '-'}</p>
                </div>
                <div>
                  <Label className="text-gray-400 text-xs">Status</Label>
                  <span className={`px-2 py-1 rounded text-xs ${statusColors[getEmployeeStatus(selectedEmployee)]}`}>
                    {statusLabels[getEmployeeStatus(selectedEmployee)]}
                  </span>
                </div>
                <div>
                  <Label className="text-gray-400 text-xs">Hire Date</Label>
                  <p className="text-white font-medium">
                    {selectedEmployee.hireDate ? new Date(selectedEmployee.hireDate).toLocaleDateString() : '-'}
                  </p>
                </div>
                <div className="col-span-2">
                  <Label className="text-gray-400 text-xs">Address</Label>
                  <p className="text-white font-medium">{(selectedEmployee as any).address || '-'}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={handleModalClose} className="text-white">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Employee Modal */}
      <Dialog open={editOpen} onOpenChange={(open) => !open && handleModalClose()}>
        <DialogContent className="bg-[#1a2332] border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Employee</DialogTitle>
            <DialogDescription className="text-gray-400">
              Update employee information
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 text-center">
            <p className="text-white">Edit functionality will be implemented here.</p>
            <p className="text-gray-400 text-sm mt-2">You can navigate to the edit page or implement inline editing.</p>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={handleModalClose} className="text-white">
              Cancel
            </Button>
            <Button 
              className="bg-primary hover:bg-primary-dark text-background"
              onClick={() => {
                if (selectedEmployee) {
                  router.push(`/dashboard/hr/employees/edit/${selectedEmployee.id}`);
                }
              }}
            >
              Go to Edit Page
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={(open) => !open && handleModalClose()}>
        <AlertDialogContent className="bg-[#1a2332] border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Employee</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              Are you sure you want to delete{" "}
              <strong className="text-white">
                {selectedEmployee?.firstName} {selectedEmployee?.lastName}
              </strong>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              disabled={isDeleting}
              className="bg-white/5 text-white hover:bg-white/10 border-white/10"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {isDeleting ? (
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
