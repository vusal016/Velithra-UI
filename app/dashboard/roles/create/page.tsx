"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { roleManagementService } from "@/lib/services/coreServices";
import { toast } from "sonner";

export default function CreateRolePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.description) {
      toast.error("Please enter role name and description");
      return;
    }

    try {
      setIsSubmitting(true);
      await roleManagementService.create(formData);
      toast.success("Role created successfully!");
      router.push("/dashboard/roles");
    } catch (error: any) {
      toast.error(error.message || "Failed to create role");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard/roles")}
            className="gap-2"
          >
            <ArrowLeft size={18} />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">Create Role</h1>
            <p className="text-gray-300 mt-1">Add a new system role</p>
          </div>
        </div>

        {/* Form */}
        <GlassCard>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Role Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">
                Role Name <span className="text-red-400">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Manager, HR Manager, Task Manager"
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                required
              />
              <p className="text-sm text-gray-400">
                Enter a descriptive name for this role
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-white">
                Description <span className="text-red-400">*</span>
              </Label>
              <Input
                id="description"
                type="text"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="e.g., Manages HR operations and employee records"
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                required
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
                    Create Role
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push("/dashboard/roles")}
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
