"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { FileText, Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { auditLogService } from "@/lib/services/coreServices"
import { AuditLogDto } from "@/lib/types/core.types"
import { toast } from "sonner"

const actionColors: Record<string, string> = {
  LOGIN: "bg-blue-500/20 text-blue-400",
  CREATE: "bg-green-500/20 text-green-400",
  UPDATE: "bg-yellow-500/20 text-yellow-400",
  DELETE: "bg-red-500/20 text-red-400",
  VIEW: "bg-gray-500/20 text-gray-400",
}

export default function AuditLogsPage() {
  const [logList, setLogList] = useState<AuditLogDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const pageSize = 20

  useEffect(() => {
    loadLogs()
  }, [currentPage])

  const loadLogs = async () => {
    try {
      setIsLoading(true)
      const result = await auditLogService.getPaged(currentPage, pageSize)
      setLogList(result.items)
      setTotalPages(result.totalPages)
    } catch (error: any) {
      toast.error("Failed to load audit logs", {
        description: error.message || "Please try again later"
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading && logList.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-[#00d9ff]" size={48} />
      </div>
    )
  }

  return (
    <div className="space-y-8 p-8 max-w-7xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="text-[#00d9ff]" size={32} />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Audit Logs</h1>
            <p className="text-sm text-[#6b8ca8]">System activity and security logs</p>
          </div>
        </div>
      </div>

      {logList.length === 0 ? (
        <GlassCard>
          <div className="p-12 text-center">
            <FileText className="mx-auto text-[#6b8ca8] mb-4" size={64} />
            <h3 className="text-xl font-semibold text-foreground mb-2">No audit logs found</h3>
            <p className="text-[#6b8ca8]">System activity will appear here</p>
          </div>
        </GlassCard>
      ) : (
        <GlassCard>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-white/10">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-[#6b8ca8]">Action</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-[#6b8ca8]">Performed By</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-[#6b8ca8]" colSpan={2}>Resource</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-[#6b8ca8]">Timestamp</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-[#6b8ca8]">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {logList.map((log) => {
                  const actionType = log.action.toUpperCase()
                  const actionColor = actionColors[actionType] || "bg-gray-500/20 text-gray-400"
                  return (
                    <tr key={log.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-3 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${actionColor}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm text-foreground">{log.performedBy}</td>
                      <td className="px-6 py-3 text-sm text-[#6b8ca8]" colSpan={2}>-</td>
                      <td className="px-6 py-3 text-sm text-[#6b8ca8]">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-3 text-sm text-[#6b8ca8] max-w-md truncate">
                        {log.details || '-'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-6 border-t border-white/10">
              <p className="text-[#6b8ca8] text-sm">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1 || isLoading}
                  className="border-white/20"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || isLoading}
                  className="border-white/20"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </GlassCard>
      )}
    </div>
  )
}
