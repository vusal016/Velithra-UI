"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { userManagementService } from "@/lib/services/coreServices";
import { toast } from "sonner";
import type { AppUserDto } from "@/lib/types/core.types";

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    userName: "",
    email: "",
  });

  useEffect(() => {
    loadUser();
  }, [userId]);

  const loadUser = async () => {
    try {
      setLoading(true);
      const user = await userManagementService.getById(userId);
      setFormData({
        id: user.id,
        userName: user.userName,
        email: user.email,
      });
    } catch (error: any) {
      toast.error("Failed to load user");
      router.push("/dashboard/users");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.userName || !formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setIsSubmitting(true);
      await userManagementService.update(formData);
      toast.success("User updated successfully!");
      router.push("/dashboard/users");
    } catch (error: any) {
      toast.error(error.message || "Failed to update user");
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
        <div className="max-w-2xl mx-auto flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-[#00d9ff] mx-auto mb-4" />
            <p className="text-white">Loading user...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard/users")}
            className="gap-2"
          >
            <ArrowLeft size={18} />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">Edit User</h1>
            <p className="text-gray-300 mt-1">Update user information</p>
          </div>
        </div>

        {/* Form */}
        <GlassCard>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="userName" className="text-white">
                Username <span className="text-red-400">*</span>
              </Label>
              <Input
                id="userName"
                type="text"
                value={formData.userName}
                onChange={(e) => handleChange("userName", e.target.value)}
                placeholder="Enter username"
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
                placeholder="user@example.com"
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
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Changes
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push("/dashboard/users")}
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
