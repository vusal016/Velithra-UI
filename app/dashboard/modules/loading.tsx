/**
 * Velithra - Module Page Loading State
 */

import { TableSkeleton } from '@/components/common/LoadingStates';

export default function ModulesLoading() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-[#0a1628] via-[#0f1f35] to-[#0a1628]">
      <div className="flex-1 ml-16 overflow-y-auto">
        <div className="p-8 space-y-6">
          {/* Header Skeleton */}
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <div className="h-8 w-48 bg-white/10 rounded animate-pulse" />
              <div className="h-4 w-64 bg-white/5 rounded animate-pulse" />
            </div>
            <div className="h-10 w-32 bg-[#00d9ff]/20 rounded animate-pulse" />
          </div>

          {/* Table Skeleton */}
          <TableSkeleton rows={8} columns={5} />
        </div>
      </div>
    </div>
  );
}
