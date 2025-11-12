"use client"

import { useState } from "react"
import { GlassCard } from "@/components/ui/glass-card"
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
    timestamp: "2025-11-08 14:30:00",
    details: "User login successful",
  },
  {
    id: "2",
    action: "CREATE",
    user: "admin@velithra.local",
    resource: "Employee",
    timestamp: "2025-11-08 14:15:00",
    details: "Created new employee: Alice Johnson",
  },
  {
    id: "3",
    action: "UPDATE",
    user: "hr@velithra.local",
    resource: "Employee",
    timestamp: "2025-11-08 13:45:00",
    details: "Updated employee status to on-leave",
  },
]

const actionColors: Record<string, string> = {
  LOGIN: "bg-blue-500/20 text-blue-400",
  CREATE: "bg-green-500/20 text-green-400",
  UPDATE: "bg-yellow-500/20 text-yellow-400",
  DELETE: "bg-red-500/20 text-red-400",
}

export default function AuditLogsPage() {
  const [logList] = useState<AuditLog[]>(logs)

  return (
    <div className="space-y-8 p-8 max-w-6xl">
      <div className="flex items-center gap-3">
        <FileText className="text-primary" size={32} />
        <h1 className="text-3xl font-bold text-foreground">Audit Logs</h1>
      </div>

      <GlassCard>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-white/10">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted">Action</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted">User</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted">Resource</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted">Timestamp</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {logList.map((log) => (
                <tr key={log.id} className="hover:bg-white/5">
                  <td className="px-6 py-3 text-sm">
                    <span className={`px-2 py-1 rounded text-xs ${actionColors[log.action]}`}>{log.action}</span>
                  </td>
                  <td className="px-6 py-3 text-sm text-foreground">{log.user}</td>
                  <td className="px-6 py-3 text-sm text-muted">{log.resource}</td>
                  <td className="px-6 py-3 text-sm text-muted">{log.timestamp}</td>
                  <td className="px-6 py-3 text-sm text-muted">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  )
}
