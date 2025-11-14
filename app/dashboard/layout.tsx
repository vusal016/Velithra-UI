"use client"

import type React from "react"

import { useEffect, Suspense } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { DynamicSidebar } from "@/components/layout/dynamic-sidebar"
import { useAuthContext } from "@/components/providers/auth-provider"
import { FullPageLoader, DashboardSkeleton } from "@/components/common/LoadingStates"
import { ErrorBoundary } from "@/components/common/ErrorBoundary"
import { useKeyboardNavigation, SkipToContent } from "@/hooks/use-keyboard-navigation"
import { PWAInstallPrompt } from "@/components/common/PWAInstallPrompt"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, isAuthenticated, isLoading, hasRole, logout } = useAuthContext();

  // Enable keyboard navigation
  useKeyboardNavigation();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
        return;
      }
      // All authenticated users can access dashboard
      // Role-based content is handled in individual pages
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = () => {
    logout();
  }

  if (isLoading) {
    return <FullPageLoader message="Loading dashboard..." />;
  }

  // Adapt user object for Navbar (ensure it has email and role)
  const navbarUser = user ? {
    email: user.email,
    role: Array.isArray(user.roles) && user.roles.length > 0 
      ? user.roles[0].charAt(0).toUpperCase() + user.roles[0].slice(1).toLowerCase()
      : "User"
  } : null;

  return (
    <ErrorBoundary>
      <SkipToContent />
      <Navbar user={navbarUser} onLogout={handleLogout} />
      <DynamicSidebar />
      <main id="main-content" role="main" aria-label="Dashboard content" className="ml-64 pt-[72px]">
        <Suspense fallback={<DashboardSkeleton />}>
          {children}
        </Suspense>
      </main>
      <PWAInstallPrompt />
    </ErrorBoundary>
  );
}
