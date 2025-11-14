"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authService } from "@/lib/services/authService"
import { Navbar } from "@/components/layout/navbar"
import { HRSidebar } from "@/components/layout/hr-sidebar"

export default function HRLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<{ email: string; role: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated and has HR role
    const currentUser = authService.getUser()
    
    if (!currentUser) {
      router.push("/login")
      return
    }

    // Check if user has HR or Manager role
    if (!authService.hasRole("HR") && !authService.hasRole("Manager")) {
      const redirectPath = authService.getRoleRedirectPath();
      router.push(redirectPath);
      return;
    }

    setUser({
      email: currentUser.email,
      role: authService.hasRole("HR") ? "HR" : "Manager",
    })
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    authService.logout()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-muted">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />
      <HRSidebar />
      <main className="ml-64">{children}</main>
    </>
  )
}
