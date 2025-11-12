/**
 * Velithra - ProtectedRoute Component
 * Higher-order component for route protection with role-based access
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Spinner } from '@/components/ui/spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  requiredRoles?: string[];
  fallbackPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  requiredRoles,
  fallbackPath = '/login',
}) => {
  const router = useRouter();
  const { isAuthenticated, hasRole, hasAnyRole, isLoading } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      // Wait for auth to load
      if (isLoading) {
        return;
      }

      // Check authentication
      if (!isAuthenticated) {
        router.push(fallbackPath);
        return;
      }

      // Check role-based authorization
      if (requiredRole && !hasRole(requiredRole)) {
        router.push('/unauthorized');
        return;
      }

      if (requiredRoles && !hasAnyRole(requiredRoles)) {
        router.push('/unauthorized');
        return;
      }

      // User is authorized
      setIsAuthorized(true);
      setIsChecking(false);
    };

    checkAuth();
  }, [
    isAuthenticated,
    isLoading,
    requiredRole,
    requiredRoles,
    hasRole,
    hasAnyRole,
    router,
    fallbackPath,
  ]);

  // Show loading spinner while checking
  if (isChecking || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Spinner className="h-8 w-8 mb-4 text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show nothing while redirecting
  if (!isAuthorized) {
    return null;
  }

  // Render protected content
  return <>{children}</>;
};

export default ProtectedRoute;
