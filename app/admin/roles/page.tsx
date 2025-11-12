"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Plus, Edit, Trash2 } from "lucide-react"

interface Role {
  id: string
  name: string
  description: string
  permissions: number
  users: number
}

const roles: Role[] = [
  { id: "1", name: "Admin", description: "Full system access", permissions: 32, users: 2 },
  { id: "2", name: "Manager", description: "Team management", permissions: 16, users: 5 },
  { id: "3", name: "User", description: "Standard access", permissions: 8, users: 45 },
  { id: "4", name: "Viewer", description: "Read-only access", permissions: 4, users: 12 },
]

export default function RolesPage() {
  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Role Management</h1>
            <p className="text-muted mt-1">Manage user roles and permissions</p>
          </div>
          <Button className="gap-2 bg-primary hover:bg-primary-dark text-background">
            <Plus size={18} />
            New Role
          </Button>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roles.map((role, i) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard>
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-foreground">{role.name}</h3>
                      <p className="text-sm text-muted mt-1">{role.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Edit size={16} />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-400">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                    <div>
                      <p className="text-xs text-muted">Permissions</p>
                      <p className="text-lg font-bold text-primary">{role.permissions}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted">Users</p>
                      <p className="text-lg font-bold text-primary">{role.users}</p>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
