"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { employeeService, departmentService, positionService, userService } from "@/lib/services/api";
import { toast } from "sonner";
import type { DepartmentDto, PositionDto, AppUserDto } from "@/lib/types";

export default function CreateEmployeePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState<DepartmentDto[]>([]);
  const [positions, setPositions] = useState<PositionDto[]>([]);
  const [users, setUsers] = useState<AppUserDto[]>([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    email: "",
    phoneNumber: "",
    address: "",
    positionId: "",
    departmentId: "",
    hireDate: "",
    userId: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [deptsRes, possRes, usrsRes] = await Promise.all([
        departmentService.getAll(),
        positionService.getAll(),
        userService.getAll(),
      ]);
      setDepartments(deptsRes.data.data || deptsRes.data || []);
      setPositions(possRes.data.data || possRes.data || []);
      setUsers(usrsRes.data.data || usrsRes.data || []);
    } catch (error: any) {
      console.error('Failed to load form data:', error);
      toast.error("Failed to load form data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email || 
        !formData.phoneNumber || !formData.departmentId || !formData.positionId || 
        !formData.hireDate || !formData.dateOfBirth) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setIsSubmitting(true);
      await employeeService.create({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        positionId: formData.positionId,
        departmentId: formData.departmentId,
        hireDate: new Date(formData.hireDate).toISOString(),
        phoneNumber: formData.phoneNumber,
        address: formData.address || undefined,
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : undefined,
      });
      toast.success("Employee created successfully!");
      router.push("/hr/employees");
    } catch (error: any) {
      console.error('Failed to create employee:', error);
      toast.error(error.response?.data?.message || error.message || "Failed to create employee");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-[#00d9ff] mx-auto mb-4" />
            <p className="text-white">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/hr/employees")}
            className="gap-2"
          >
            <ArrowLeft size={18} />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">Add Employee</h1>
            <p className="text-gray-300 mt-1">Create a new employee record</p>
          </div>
        </div>

        {/* Form */}
        <GlassCard>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-white">
                  First Name <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  placeholder="John"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                  required
                />
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-white">
                  Last Name <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  placeholder="Doe"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="john.doe@company.com"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                  required
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-white">
                  Phone Number <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleChange("phoneNumber", e.target.value)}
                  placeholder="+994501234567"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                  required
                />
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className="text-white">
                  Date of Birth <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                  required
                />
              </div>

              {/* Hire Date */}
              <div className="space-y-2">
                <Label htmlFor="hireDate" className="text-white">
                  Hire Date <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="hireDate"
                  type="date"
                  value={formData.hireDate}
                  onChange={(e) => handleChange("hireDate", e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                  required
                />
              </div>

              {/* Department */}
              <div className="space-y-2">
                <Label htmlFor="departmentId" className="text-white">
                  Department <span className="text-red-400">*</span>
                </Label>
                <Select
                  value={formData.departmentId}
                  onValueChange={(value) => handleChange("departmentId", value)}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2332] border-white/10">
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id} className="text-white hover:bg-white/10">
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Position */}
              <div className="space-y-2">
                <Label htmlFor="positionId" className="text-white">
                  Position <span className="text-red-400">*</span>
                </Label>
                <Select
                  value={formData.positionId}
                  onValueChange={(value) => handleChange("positionId", value)}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2332] border-white/10">
                    {positions.map((pos) => (
                      <SelectItem key={pos.id} value={pos.id} className="text-white hover:bg-white/10">
                        {pos.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* User (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="userId" className="text-white">
                  Link to User (Optional)
                </Label>
                <Select
                  value={formData.userId}
                  onValueChange={(value) => handleChange("userId", value)}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Select user (optional)" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2332] border-white/10">
                    <SelectItem value="none" className="text-white hover:bg-white/10">
                      None
                    </SelectItem>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id} className="text-white hover:bg-white/10">
                        {user.userName} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address" className="text-white">
                Address
              </Label>
              <Input
                id="address"
                type="text"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="Full address"
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-[#00d9ff] hover:bg-[#0099cc] text-[#0a1628] font-semibold gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Create Employee
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push("/hr/employees")}
                disabled={isSubmitting}
                className="text-white"
              >
                Cancel
              </Button>
            </div>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}
