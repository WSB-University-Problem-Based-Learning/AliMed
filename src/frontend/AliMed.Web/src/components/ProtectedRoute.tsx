import { useEffect, useState, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const [hasToken, setHasToken] = useState(false);
  
  useEffect(() => {
    // Check localStorage on mount (after hydration)
    const token = localStorage.getItem('alimed_token');
    setHasToken(!!token);
    setIsChecking(false);
  }, []);
  
  // Show nothing while checking (prevents flash redirect)
  if (isChecking) {
    return null;
  }
  
  if (!isAuthenticated && !hasToken) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
