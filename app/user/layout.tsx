"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserSidebar, UserHeader } from "@/components/user";
import { useAuthContext } from "@/components/providers/auth-provider";

export default function UserLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading, hasRole } = useAuthContext();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
        return;
      }
      if (hasRole("Admin")) {
        router.push("/dashboard");
        return;
      }
      if (hasRole("Manager")) {
        router.push("/manager/dashboard");
        return;
      }
      if (hasRole("HR")) {
        router.push("/hr/employees");
        return;
      }
      if (hasRole("Teacher")) {
        router.push("/teacher/courses");
        return;
      }
    }
  }, [isAuthenticated, isLoading, hasRole, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e]">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-2 border-[#00d9ff] border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e]">
      <UserSidebar />
      <div className="flex-1 flex flex-col">
        <UserHeader />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
