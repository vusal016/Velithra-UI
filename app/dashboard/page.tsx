"use client"

import type React from "react"

import { useState } from "react"
import { VelithraLogo } from "@/components/logo/velithra-logo"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { CheckSquare, Package, BookOpen, MessageCircle, ShieldAlert, Briefcase } from "lucide-react"

interface Module {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ size: number }>
  isActive: boolean
  users: number
}

const modules: Module[] = [
  {
    id: "admin",
    name: "Admin Panel",
    description: "User & role management",
    icon: ShieldAlert,
    isActive: true,
    users: 12,
  },
  {
    id: "hr",
    name: "HR Management",
    description: "Employee & payroll",
    icon: Briefcase,
    isActive: true,
    users: 45,
  },
  {
    id: "tasks",
    name: "Task Manager",
    description: "Project tracking",
    icon: CheckSquare,
    isActive: true,
    users: 78,
  },
  {
    id: "inventory",
    name: "Inventory",
    description: "Stock management",
    icon: Package,
    isActive: true,
    users: 23,
  },
  {
    id: "courses",
    name: "Learning Hub",
    description: "Training courses",
    icon: BookOpen,
    isActive: false,
    users: 0,
  },
  {
    id: "chat",
    name: "Communication",
    description: "Team messaging",
    icon: MessageCircle,
    isActive: true,
    users: 156,
  },
]

function ModuleCard({ module }: { module: Module }) {
  const [localActive, setLocalActive] = useState(module.isActive)
  const Icon = module.icon

  const handleToggle = () => {
    setLocalActive(!localActive)
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <GlassCard active={localActive} className="h-full">
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div
              className={`p-3 rounded-lg ${localActive ? "bg-[#00d9ff]/20" : "bg-white/5"} transition-colors`}
              style={{ color: localActive ? "#00d9ff" : "#6b8ca8" }}
            >
              <Icon size={24} />
            </div>
            <Button
              onClick={handleToggle}
              size="sm"
              variant={localActive ? "default" : "outline"}
              className={`text-xs ${
                localActive ? "bg-[#00d9ff] hover:bg-[#0099cc] text-[#0a1628] shadow-sm shadow-[#00d9ff]/30" : "border-white/20 text-[#6b8ca8]"
              }`}
            >
              {localActive ? "Active" : "Inactive"}
            </Button>
          </div>

          <div>
            <h3 className="font-semibold text-foreground">{module.name}</h3>
            <p className="text-xs text-muted mt-1">{module.description}</p>
          </div>

          <div className="pt-2 border-t border-white/10 flex justify-between text-xs">
            <span className="text-muted">Users</span>
            <span className={localActive ? "text-[#00d9ff] font-medium" : "text-[#6b8ca8]"}>
              {localActive ? module.users : "N/A"}
            </span>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}

export default function DashboardPage() {
  const [stats] = useState({
    totalUsers: 314,
    activeModules: 5,
    systemHealth: 99.8,
    lastSync: "Just now",
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f1f35] to-[#0a1628] p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Section */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="flex justify-center mb-6">
            <VelithraLogo size={288} animate />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Control Center</h1>
          <p className="text-[#6b8ca8]">Crystalline architecture for enterprise management</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Users", value: stats.totalUsers },
            { label: "Active Modules", value: stats.activeModules },
            { label: "System Health", value: `${stats.systemHealth}%` },
            { label: "Last Sync", value: stats.lastSync },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard>
                <div className="p-4">
                  <p className="text-xs text-[#6b8ca8] uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-bold text-[#00d9ff] mt-2">{stat.value}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Modules Section */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">System Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => (
              <ModuleCard key={module.id} module={module} />
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div>
          <h3 className="text-xl font-bold text-foreground mb-4">Recent Activity</h3>
          <GlassCard>
            <div className="p-6 space-y-3">
              {[
                { time: "5 mins ago", event: "User login", user: "admin@velithra.local" },
                { time: "12 mins ago", event: "Module activated", user: "HR Management" },
                { time: "28 mins ago", event: "System backup", user: "Automated" },
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-white/10 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{activity.event}</p>
                    <p className="text-xs text-muted">{activity.user}</p>
                  </div>
                  <span className="text-xs text-muted">{activity.time}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
