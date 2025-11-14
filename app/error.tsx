/**
 * Velithra - Global Error Page
 */

'use client';

import { useEffect } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to error reporting service
    console.error('Global error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f1f35] to-[#0a1628] flex items-center justify-center p-6">
      <GlassCard className="max-w-2xl w-full p-8">
        <div className="text-center space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-red-500/20">
              <AlertTriangle size={48} className="text-red-500" />
            </div>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Something went wrong!
            </h1>
            <p className="text-muted-foreground">
              An unexpected error occurred. Please try again or contact support if the problem persists.
            </p>
          </div>

          {/* Error Details (Development only) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="text-left">
              <details className="group">
                <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  View error details
                </summary>
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-sm font-mono text-red-400 mb-2">
                    {error.message}
                  </p>
                  {error.digest && (
                    <p className="text-xs text-muted-foreground">
                      Error ID: {error.digest}
                    </p>
                  )}
                </div>
              </details>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-center">
            <Button onClick={() => reset()} className="gap-2">
              <RefreshCw size={16} />
              Try Again
            </Button>
            <Button onClick={() => window.location.href = '/dashboard'} variant="outline" className="gap-2">
              <Home size={16} />
              Go to Dashboard
            </Button>
          </div>

          {/* Support */}
          <p className="text-xs text-muted-foreground">
            Need help?{' '}
            <a href="mailto:support@velithra.com" className="text-primary hover:underline">
              Contact Support
            </a>
          </p>
        </div>
      </GlassCard>
    </div>
  );
}
