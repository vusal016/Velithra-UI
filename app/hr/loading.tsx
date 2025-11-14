/**
 * Velithra - HR Module Loading State
 */

import { TableSkeleton, CardSkeleton } from '@/components/common/LoadingStates';

export default function HRLoading() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-[#0a1628] via-[#0f1f35] to-[#0a1628]">
      <div className="flex-1 ml-16 overflow-y-auto">
        <div className="p-8 space-y-6">
          {/* Header Skeleton */}
          <div className="space-y-2">
            <div className="h-8 w-48 bg-white/10 rounded animate-pulse" />
            <div className="h-4 w-64 bg-white/5 rounded animate-pulse" />
          </div>

          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>

          {/* Table Skeleton */}
          <TableSkeleton rows={10} columns={7} />
        </div>
      </div>
    </div>
  );
}
