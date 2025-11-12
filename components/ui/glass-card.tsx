"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"

interface GlassCardProps {
  children: ReactNode
  active?: boolean
  className?: string
  onClick?: () => void
}

export function GlassCard({ children, active = false, className = "", onClick }: GlassCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`relative glass transition-all duration-300 ${active ? "glass-active" : ""} ${className}`}
      onClick={onClick}
    >
      {active && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#00d9ff]/10 to-transparent pointer-events-none" />
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}
