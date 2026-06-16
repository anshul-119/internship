import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import Loader from '@/components/ui/Loader';

/**
 * Route protector checking session validation.
 * Redirects unauthenticated users and guards dashboard access.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-dark-900/90 backdrop-blur-md">
        <Loader size="lg" text="Verifying credentials..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
