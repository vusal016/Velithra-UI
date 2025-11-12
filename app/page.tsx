"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { VelithraLogo } from "@/components/logo/velithra-logo"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function Home() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent to-background flex items-center justify-center p-4">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(0deg, transparent 24%, rgba(0, 245, 212, 0.05) 25%, rgba(0, 245, 212, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 245, 212, 0.05) 75%, rgba(0, 245, 212, 0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0, 245, 212, 0.05) 25%, rgba(0, 245, 212, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 245, 212, 0.05) 75%, rgba(0, 245, 212, 0.05) 76%, transparent 77%, transparent)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-6">
            <VelithraLogo size={240} animate />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Velithra</h1>
          <p className="text-gray-300 text-sm">Enterprise Crystalline Platform</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-4"
        >
          <GlassCard>
            <div className="p-8 text-center space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Welcome</h2>
                <p className="text-sm text-gray-300">Access the advanced enterprise management system</p>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => {
                    setIsLoading(true)
                    router.push("/login")
                  }}
                  disabled={isLoading}
                  className="w-full bg-[#00d9ff] hover:bg-[#0099cc] text-[#0a1628] font-semibold transition-colors shadow-lg shadow-[#00d9ff]/30"
                >
                  {isLoading ? "Loading..." : "Sign In"}
                </Button>
                <Button
                  onClick={() => {
                    setIsLoading(true)
                    router.push("/register")
                  }}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full border-[#00d9ff]/40 text-[#00d9ff] hover:bg-[#00d9ff]/10 transition-colors"
                >
                  Create Account
                </Button>
              </div>

              <div className="text-xs text-gray-400">Backend credentials: admin@velithra.com / Admin123!</div>
            </div>
          </GlassCard>

          <p className="text-center text-xs text-gray-400">Secure • Real-time • Enterprise-grade</p>
        </motion.div>
      </div>
    </div>
  )
}
