"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { VelithraLogo } from "@/components/logo/velithra-logo"
import { useAuth } from "@/hooks/use-auth"
import { authService } from "@/lib/services/authService"
import ENV from "@/lib/config/env"

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading } = useAuth()
  const [email, setEmail] = useState("admin@velithra.com")
  const [password, setPassword] = useState("Admin123!")
  const [error, setError] = useState("")

  // Clear localStorage on mount to fix sidebar issue
  useEffect(() => {
    localStorage.removeItem('velithra-modules');
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      // Clear cache before login
      localStorage.clear();
      
      await login({ email, password })
      
      // Role-based redirect using authService helper
      const redirectPath = authService.getRoleRedirectPath()
      router.push(redirectPath)
    } catch (err: any) {
      // Extract error message from the error
      const errorMessage = err.message || "Login failed. Please try again."
      
      // Check for specific errors
      if (err.code === "ERR_NETWORK") {
        setError(`Cannot connect to backend server. Please ensure backend is running on ${ENV.API_BASE_URL.replace('/api', '')}`)
      } else {
        setError(errorMessage)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <VelithraLogo size={192} animate={false} />
          </div>
          <h1 className="text-3xl font-bold text-white">Sign In</h1>
          <p className="text-gray-300 text-sm mt-2">Enter your credentials to continue</p>
        </div>

        <GlassCard>
          <form onSubmit={handleLogin} className="p-8 space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-sm">
                <div className="flex items-start gap-3">
                  <span className="text-red-400 text-lg">⚠️</span>
                  <div className="flex-1">
                    <p className="text-red-400 font-medium mb-1">Login Failed</p>
                    <p className="text-red-300/80 text-xs leading-relaxed">{error}</p>
                    {error.includes("Cannot connect") && (
                      <Link href="/test-api" className="text-xs text-blue-400 underline mt-2 block">
                        → Test API Connection
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@velithra.com"
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#00d9ff] hover:bg-[#0099cc] text-[#0a1628] font-semibold transition-colors shadow-lg shadow-[#00d9ff]/30"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-300">
                Don't have an account?{" "}
                <Link href="/register" className="text-[#00d9ff] hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </GlassCard>
      </div>
    </div>
  )
}
