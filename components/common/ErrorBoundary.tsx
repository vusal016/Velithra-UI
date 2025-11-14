/**
 * Velithra - Global Error Boundary
 * Catches and handles React errors gracefully
 */

'use client';

import React, { Component, type ReactNode } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Log to external error tracking service (e.g., Sentry)
    if (process.env.NODE_ENV === 'production') {
      // logErrorToService(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

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
                  Oops! Something went wrong
                </h1>
                <p className="text-muted-foreground">
                  An unexpected error occurred. We've been notified and are working on a fix.
                </p>
              </div>

              {/* Error Details (Development only) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="text-left">
                  <details className="group">
                    <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                      View error details
                    </summary>
                    <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <p className="text-sm font-mono text-red-400 mb-2">
                        {this.state.error.name}: {this.state.error.message}
                      </p>
                      <pre className="text-xs text-muted-foreground overflow-x-auto">
                        {this.state.error.stack}
                      </pre>
                    </div>
                  </details>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 justify-center">
                <Button onClick={this.handleReset} className="gap-2">
                  <RefreshCw size={16} />
                  Try Again
                </Button>
                <Button onClick={this.handleGoHome} variant="outline" className="gap-2">
                  <Home size={16} />
                  Go to Dashboard
                </Button>
              </div>

              {/* Support */}
              <p className="text-xs text-muted-foreground">
                If this problem persists, please contact{' '}
                <a href="mailto:support@velithra.com" className="text-primary hover:underline">
                  support@velithra.com
                </a>
              </p>
            </div>
          </GlassCard>
        </div>
      );
    }

    return this.props.children;
  }
}
