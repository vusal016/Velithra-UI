"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store"
import { AdminDashboard } from "@/components/dashboard/AdminDashboard"
import { ManagerDashboard } from "@/components/dashboard/ManagerDashboard"
import { EmployeeDashboard } from "@/components/dashboard/EmployeeDashboard"
import { Skeleton } from "@/components/ui/skeleton"



export default function DashboardPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial load
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 p-8 min-h-screen">
        <Skeleton className="h-20 w-full" />
        <div className="grid grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  // Role-based dashboard rendering
  const userRoles = user?.roles || [];

  // Admin: System overview, metrics, module management
  if (userRoles.includes('Admin')) {
    return <AdminDashboard />;
  }

  // Manager: Team overview, employee tasks, department metrics
  if (userRoles.includes('Manager')) {
    return <ManagerDashboard />;
  }

  // Employee/User: Personal tasks, courses, notifications
  return <EmployeeDashboard />;
}
