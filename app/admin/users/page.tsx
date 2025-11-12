"use client"

import { useState } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { Plus, Search, Edit, Trash2, Shield } from "lucide-react"

interface User {
  id: string
  email: string
  role: string
  status: "active" | "inactive"
  joinDate: string
}

const users: User[] = [
  { id: "1", email: "admin@velithra.local", role: "Admin", status: "active", joinDate: "2024-01-15" },
  { id: "2", email: "manager@velithra.local", role: "Manager", status: "active", joinDate: "2024-02-20" },
  { id: "3", email: "user@velithra.local", role: "User", status: "active", joinDate: "2024-03-10" },
  { id: "4", email: "intern@velithra.local", role: "Intern", status: "inactive", joinDate: "2024-05-01" },
]

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [displayUsers, setDisplayUsers] = useState(users)

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    setDisplayUsers(
      users.filter(
        (u) => u.email.toLowerCase().includes(term.toLowerCase()) || u.role.toLowerCase().includes(term.toLowerCase()),
      ),
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">User Management</h1>
            <p className="text-muted mt-1">Manage system users and permissions</p>
          </div>
          <Button className="gap-2 bg-primary hover:bg-primary-dark text-background">
            <Plus size={18} />
            Add User
          </Button>
        </div>

        {/* Search Bar */}
        <GlassCard>
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 bg-white/5 border-white/10"
              />
            </div>
          </div>
        </GlassCard>

        {/* Users Table */}
        <GlassCard>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-white/10">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Email</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Role</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Status</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Join Date</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayUsers.map((user, i) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition"
                  >
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4 flex items-center gap-2">
                      <Shield size={14} className="text-primary" />
                      {user.role}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.status === "active" ? "bg-primary/20 text-primary" : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted text-xs">{user.joinDate}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Edit size={16} />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-400">
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
