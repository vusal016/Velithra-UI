"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { motion } from "framer-motion"
import { FileText } from "lucide-react"

interface AuditLog {
  id: string
  action: string
  user: string
  resource: string
  timestamp: string
  details: string
}

const logs: AuditLog[] = [
  {
    id: "1",
    action: "LOGIN",
    user: "admin@velithra.local",
    resource: "Authentication",
    timestamp: "2024-11-09 14:30:00",
    details: "User login successful",
  },
  {
    id: "2",
    action: "CREATE",
    user: "admin@velithra.local",
    resource: "User",
    timestamp: "2024-11-09 14:15:00",
    details: "Created new user: newuser@velithra.local",
  },
  {
    id: "3",
    action: "UPDATE",
    user: "admin@velithra.local",
    resource: "Module",
    timestamp: "2024-11-09 13:45:00",
    details: "Updated HR Management module version",
  },
  {
    id: "4",
    action: "DELETE",
    user: "admin@velithra.local",
    resource: "Role",
    timestamp: "2024-11-09 13:20:00",
    details: "Deleted deprecated role: Viewer",
  },
]

export default function AuditLogsPage() {
  const actionColors = {
    LOGIN: "bg-blue-500/20 text-blue-400",
    CREATE: "bg-green-500/20 text-green-400",
    UPDATE: "bg-yellow-500/20 text-yellow-400",
    DELETE: "bg-red-500/20 text-red-400",
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Audit Logs</h1>
          <p className="text-muted mt-1">System activity and user actions</p>
        </div>

        {/* Logs Table */}
        <GlassCard>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-white/10">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Action</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">User</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Resource</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Timestamp</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Details</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, i) => (
                  <motion.tr
                    key={log.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition"
                  >
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${actionColors[log.action as keyof typeof actionColors] || "bg-gray-500/20 text-gray-400"}`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted">{log.user}</td>
                    <td className="px-6 py-4 flex items-center gap-2">
                      <FileText size={14} className="text-primary" />
                      {log.resource}
                    </td>
                    <td className="px-6 py-4 text-muted text-xs">{log.timestamp}</td>
                    <td className="px-6 py-4 text-muted text-sm">{log.details}</td>
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
