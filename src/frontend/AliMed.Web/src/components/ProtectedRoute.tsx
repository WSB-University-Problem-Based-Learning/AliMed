import { useEffect, useState, type ReactNode } from 'react';
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
  const [isChecking, setIsChecking] = useState(true);
  const [hasToken, setHasToken] = useState(false);
  const [tokenRole, setTokenRole] = useState<number | undefined>(undefined);
  
  useEffect(() => {
    // Check localStorage on mount (after hydration)
    const token = localStorage.getItem('alimed_token');
    setHasToken(!!token);
    setTokenRole(decodeRoleFromToken(token));
    setIsChecking(false);
  }, []);
  
  // Show nothing while checking (prevents flash redirect)
  if (isChecking) {
    return null;
  }
  
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
