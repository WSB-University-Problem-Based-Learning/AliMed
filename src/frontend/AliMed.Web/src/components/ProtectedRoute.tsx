import { useState, type ReactNode } from 'react';
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

const decodeRoleFromToken = (token: string | null): number | undefined => {
  if (!token) return undefined;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const role =
      payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
      payload.role;
    if (role === 'Admin') return 2;
    if (role === 'Lekarz') return 1;
    if (role === 'User') return 0;
  } catch {
    return undefined;
  }
  return undefined;
};

const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuth();
  
  // Initialize from localStorage on first render - no need for isChecking state
  const [hasToken] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('alimed_token');
  });
  const [tokenRole] = useState(() => {
    if (typeof window === 'undefined') return undefined;
    return decodeRoleFromToken(localStorage.getItem('alimed_token'));
  });
  
  // Not authenticated and no token in localStorage
  if (!isAuthenticated && !hasToken) {
    return <Navigate to="/login" replace />;
  }

  if (roles && roles.length > 0) {
    const currentRole = user?.role ?? tokenRole;
    if (currentRole === undefined || !roles.includes(currentRole)) {
      return <Navigate to={resolveHomeForRole(currentRole)} replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
