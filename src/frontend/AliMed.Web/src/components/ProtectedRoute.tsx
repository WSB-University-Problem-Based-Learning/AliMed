import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: number[];
}

const resolveHomeForRole = (role?: number) => {
  if (role === 2) return '/admin';
  if (role === 1) return '/panel-lekarza';
  return '/dashboard';
};

const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const { isAuthenticated, isAuthReady, isDemoMode, user } = useAuth();

  if (!isAuthReady) {
    return null;
  }

  if (!isAuthenticated && !isDemoMode) {
    return <Navigate to="/login" replace />;
  }

  if (roles && roles.length > 0) {
    const currentRole = user?.role;
    if (currentRole === undefined || !roles.includes(currentRole)) {
      return <Navigate to={resolveHomeForRole(currentRole)} replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
