/**
 * Velithra - Global Not Found Page
 */

import Link from 'next/link';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f1f35] to-[#0a1628] flex items-center justify-center p-6">
      <GlassCard className="max-w-2xl w-full p-12">
        <div className="text-center space-y-6">
          {/* 404 */}
          <div className="space-y-2">
            <h1 className="text-9xl font-bold bg-gradient-to-r from-[#00d9ff] to-[#0077ff] bg-clip-text text-transparent">
              404
            </h1>
            <h2 className="text-3xl font-bold text-foreground">Page Not Found</h2>
            <p className="text-muted-foreground">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          {/* Illustration */}
          <div className="py-8">
            <Search size={80} className="text-muted-foreground/30 mx-auto" />
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-center">
            <Link href="/dashboard">
              <Button className="gap-2">
                <Home size={16} />
                Go to Dashboard
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="gap-2">
                Login
              </Button>
            </Link>
          </div>

          {/* Suggestions */}
          <div className="pt-6 border-t border-white/10">
            <p className="text-sm text-muted-foreground mb-3">You might want to:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Link href="/dashboard/modules">
                <Button variant="ghost" size="sm">Modules</Button>
              </Link>
              <Link href="/dashboard/users">
                <Button variant="ghost" size="sm">Users</Button>
              </Link>
              <Link href="/dashboard/courses">
                <Button variant="ghost" size="sm">Courses</Button>
              </Link>
              <Link href="/hr">
                <Button variant="ghost" size="sm">HR</Button>
              </Link>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
