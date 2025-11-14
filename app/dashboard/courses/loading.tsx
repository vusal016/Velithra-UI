/**
 * Velithra - Courses Page Loading State
 */

import { CardSkeleton } from '@/components/common/LoadingStates';

export default function CoursesLoading() {
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

          {/* Filter Bar Skeleton */}
          <div className="flex gap-4">
            <div className="h-10 flex-1 bg-white/5 rounded animate-pulse" />
            <div className="h-10 w-48 bg-white/5 rounded animate-pulse" />
            <div className="h-10 w-32 bg-white/5 rounded animate-pulse" />
          </div>

          {/* Cards Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
