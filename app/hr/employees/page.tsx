"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Mail,
  Loader2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { employeeService } from "@/lib/services/api";
import type { EmployeeDto } from "@/lib/types";
import { toast } from "sonner";
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

export default function EmployeesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [employees, setEmployees] = useState<EmployeeDto[]>([]);
  const [displayEmployees, setDisplayEmployees] = useState<EmployeeDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    employeeId: string;
    employeeName: string;
  }>({ open: false, employeeId: "", employeeName: "" });
  const [deleting, setDeleting] = useState(false);

  const pageSize = 10;

  useEffect(() => {
    loadEmployees();
  }, [currentPage]);

  const loadEmployees = async () => {
    try {
      setIsLoading(true);
      const response = await employeeService.getPaged(currentPage, pageSize);
      const data = response.data.data || response.data;
      setEmployees(data.items || []);
      setDisplayEmployees(data.items || []);
      setTotalPages(data.totalPages || 1);
    } catch (error: any) {
      console.error('Failed to load employees:', error);
      toast.error("Failed to load employees", {
        description: error.response?.data?.message || error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      Active: "bg-green-500/20 text-green-400 border-green-500/30",
      OnLeave: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      Terminated: "bg-red-500/20 text-red-400 border-red-500/30",
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.Active;
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = employees.filter(
      (e) =>
        e.firstName.toLowerCase().includes(term.toLowerCase()) ||
        e.lastName.toLowerCase().includes(term.toLowerCase()) ||
        e.email.toLowerCase().includes(term.toLowerCase())
    );
    setDisplayEmployees(filtered);
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await employeeService.delete(deleteDialog.employeeId);
      toast.success("Employee deleted successfully");
      setDeleteDialog({ open: false, employeeId: "", employeeName: "" });
      loadEmployees();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete employee");
    } finally {
      setDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-[#00d9ff] mx-auto mb-4" />
            <p className="text-white">Loading employees...</p>
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
            <h1 className="text-3xl font-bold text-white">Employee Directory</h1>
            <p className="text-gray-300 mt-1">Manage company workforce</p>
          </div>
          <Button
            onClick={() => router.push("/hr/employees/create")}
            className="gap-2 bg-[#00d9ff] hover:bg-[#0099cc] text-[#0a1628] font-semibold"
          >
            <Plus size={18} />
            Add Employee
          </Button>
        </div>

        {/* Search Bar */}
        <GlassCard>
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
              <Input
                placeholder="Search employees..."
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
            { label: "Total Employees", value: employees.length },
            { label: "Active", value: employees.filter((e) => e.status === "Active").length },
            { label: "On Leave", value: employees.filter((e) => e.status === "OnLeave").length },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}>
              <GlassCard>
                <div className="p-4">
                  <p className="text-xs text-gray-300 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Employees List */}
        <div className="space-y-4">
          {displayEmployees.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-300">No employees found</p>
            </div>
          ) : (
            displayEmployees.map((employee, i) => (
              <motion.div
                key={employee.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <GlassCard>
                  <div className="p-6 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-lg bg-primary/30 flex items-center justify-center text-primary font-bold">
                            {employee.firstName.charAt(0)}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">
                            {employee.firstName} {employee.lastName}
                          </h3>
                          <p className="text-sm text-gray-300">{employee.positionTitle}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail size={14} className="text-[#00d9ff]" />
                          <span className="text-gray-300">{employee.email}</span>
                        </div>
                        <div className="text-sm">
                          <p className="text-xs text-gray-400 uppercase">Department</p>
                          <p className="text-white font-medium">{employee.departmentName}</p>
                        </div>
                        <div className="text-sm">
                          <p className="text-xs text-gray-400 uppercase">Position</p>
                          <p className="text-white font-medium">{employee.positionTitle}</p>
                        </div>
                        <div>
                          <Badge className={getStatusBadge(employee.status)}>
                            {employee.status}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-[#00d9ff] hover:text-[#0099cc]"
                        onClick={() => router.push(`/hr/employees/edit/${employee.id}`)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-red-400"
                        onClick={() =>
                          setDeleteDialog({
                            open: true,
                            employeeId: employee.id,
                            employeeName: `${employee.firstName} ${employee.lastName}`,
                          })
                        }
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <GlassCard>
            <div className="flex items-center justify-between p-4">
              <p className="text-sm text-gray-300">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="text-white"
                >
                  <ChevronLeft size={18} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="text-white"
                >
                  <ChevronRight size={18} />
                </Button>
              </div>
            </div>
          </GlassCard>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) => !deleting && setDeleteDialog({ open, employeeId: "", employeeName: "" })}
      >
        <AlertDialogContent className="bg-[#1a2332] border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="text-red-400" size={24} />
              Delete Employee
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-white">{deleteDialog.employeeName}</span>? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting} className="bg-white/5 text-white hover:bg-white/10 border-white/10">
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
