"use client"

import { useState } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Plus, Trash2, Edit } from "lucide-react"

interface ModuleConfig {
  id: string
  name: string
  status: "active" | "inactive" | "disabled"
  users: number
  lastUpdate: string
  version: string
}

const moduleConfigs: ModuleConfig[] = [
  {
    id: "admin",
    name: "Admin Panel",
    status: "active",
    users: 12,
    lastUpdate: "2024-11-09",
    version: "1.2.0",
  },
  {
    id: "hr",
    name: "HR Management",
    status: "active",
    users: 45,
    lastUpdate: "2024-11-08",
    version: "1.0.5",
  },
  {
    id: "courses",
    name: "Learning Hub",
    status: "disabled",
    users: 0,
    lastUpdate: "2024-10-20",
    version: "0.9.0",
  },
]

export default function ModulesPage() {
  const [modules, setModules] = useState<ModuleConfig[]>(moduleConfigs)

  const handleDelete = (id: string) => {
    setModules(modules.filter((m) => m.id !== id))
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Module Manager</h1>
            <p className="text-muted mt-1">Manage and configure system modules</p>
          </div>
          <Button className="gap-2 bg-primary hover:bg-primary-dark text-background">
            <Plus size={18} />
            New Module
          </Button>
        </div>

        {/* Modules Table */}
        <GlassCard>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-white/10">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Module</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Status</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Users</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Version</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Last Update</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {modules.map((module, i) => (
                  <motion.tr
                    key={module.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition"
                  >
                    <td className="px-6 py-4">{module.name}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          module.status === "active"
                            ? "bg-primary/20 text-primary"
                            : module.status === "inactive"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {module.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted">{module.users}</td>
                    <td className="px-6 py-4 text-muted">{module.version}</td>
                    <td className="px-6 py-4 text-muted text-xs">{module.lastUpdate}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Edit size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                          onClick={() => handleDelete(module.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
