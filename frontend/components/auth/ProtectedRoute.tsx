// src/components/auth/ProtectedRoute.tsx

'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { AppRoutes } from '@/lib/constants/routes';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('admin' | 'investor' | 'analyst')[]; // Optional: roles allowed to access this route
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) { // Ensure authentication state has been loaded
      if (!isAuthenticated) {
        // If not authenticated, redirect to login page
        router.push(AppRoutes.LOGIN);
      } else if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        // If authenticated but role not allowed, redirect to dashboard or an unauthorized page
        console.warn(`User ${user.email} with role ${user.role} attempted to access restricted area.`);
        router.push(AppRoutes.DASHBOARD); // Or AppRoutes.UNAUTHORIZED_PAGE
      }
    }
  }, [isAuthenticated, user, loading, router, allowedRoles]);

  if (loading) {
    // Optionally render a loading spinner or skeleton while checking auth status
    return <div>Loading authentication...</div>;
  }

  if (isAuthenticated && (!allowedRoles || (user && allowedRoles.includes(user.role)))) {
    return <>{children}</>;
  }

  // If not authenticated or not authorized, return null or a redirecting message
  return null;
};
