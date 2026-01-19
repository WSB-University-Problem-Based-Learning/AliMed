import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { User } from '../types/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isDemoMode: boolean;
  login: (token: string, refreshToken: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  enableDemoMode: () => void;
  enableDemoModeAsDoctor: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const roleMap: Record<string, number> = {
  User: 0,
  Lekarz: 1,
  Admin: 2,
};

const decodeTokenPayload = (token: string): Record<string, unknown> | null => {
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
    const json = atob(padded);
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
};

const getUserFromToken = (token: string): User | null => {
  const payload = decodeTokenPayload(token);
  if (!payload) return null;

  const roleValue =
    (payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] as string | undefined) ||
    (payload['role'] as string | undefined);
  const role = roleValue && roleMap[roleValue] !== undefined ? roleMap[roleValue] : 0;

  const userId =
    (payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] as string | undefined) ||
    (payload['sub'] as string | undefined) ||
    '';

  const name =
    (payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] as string | undefined) ||
    (payload['unique_name'] as string | undefined) ||
    (payload['github_login'] as string | undefined) ||
    '';

  return {
    userId,
    username: name || undefined,
    githubName: name || undefined,
    role,
  };
};

const readStoredAuth = () => {
  if (typeof window === 'undefined') {
    return { storedToken: null, storedUser: null, storedDemoMode: false };
  }

  const storedToken = localStorage.getItem('alimed_token');
  const storedDemoMode = localStorage.getItem('alimed_demo_mode') === 'true';

  let storedUser: User | null = null;
  const storedUserRaw = localStorage.getItem('alimed_user');

  if (storedUserRaw) {
    try {
      storedUser = JSON.parse(storedUserRaw) as User;
    } catch (e) {
      console.error('Failed to parse stored user', e);
    }
  }

  const derivedUser = storedToken && !storedUser ? getUserFromToken(storedToken) : null;

  // RefreshToken is stored as HttpOnly cookie by backend, not in localStorage
  return { storedToken, storedUser: storedUser ?? derivedUser, storedDemoMode };
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { storedToken, storedUser, storedDemoMode } = readStoredAuth();

  const [user, setUserState] = useState<User | null>(storedUser);
  const [token, setToken] = useState<string | null>(storedToken);
  // RefreshToken is in HttpOnly cookie, managed by backend
  const [refreshToken, setRefreshToken] = useState<string | null>(storedToken ? 'stored-in-cookie' : null);
  const [isDemoMode, setIsDemoMode] = useState(storedDemoMode);

  const login = (newToken: string, newRefreshToken: string) => {
    setToken(newToken);
    // RefreshToken is stored as HttpOnly cookie by backend, don't store it in localStorage
    setRefreshToken(newRefreshToken || 'stored-in-cookie');
    setIsDemoMode(false);
    localStorage.setItem('alimed_token', newToken);
    const derivedUser = getUserFromToken(newToken);
    if (derivedUser) {
      setUserState(derivedUser);
      localStorage.setItem('alimed_user', JSON.stringify(derivedUser));
    }
    // Remove refresh token from localStorage as it's now handled via HttpOnly cookie
    localStorage.removeItem('alimed_refresh_token');
    localStorage.removeItem('alimed_demo_mode');
  };

  const logout = async () => {
    // Call backend to revoke refresh token (if not in demo mode)
    if (!isDemoMode) {
      try {
        // Dynamically import to avoid circular dependencies
        const { apiService } = await import('../services/api');
        await apiService.logout();
      } catch (error) {
        console.error('Error during backend logout:', error);
      }
    }
    
    // Clear local state
    setToken(null);
    setRefreshToken(null);
    setUserState(null);
    setIsDemoMode(false);
    localStorage.removeItem('alimed_token');
    localStorage.removeItem('alimed_refresh_token');
    localStorage.removeItem('alimed_user');
    localStorage.removeItem('alimed_demo_mode');
  };

  const setUser = (newUser: User) => {
    setUserState(newUser);
    localStorage.setItem('alimed_user', JSON.stringify(newUser));
  };

  const enableDemoMode = () => {
    const demoUser: User = {
      userId: 'demo-user',
      email: 'demo@alimed.pl',
      firstName: 'Demo',
      lastName: 'User',
      role: 0, // UserRole.User = 0 (Patient)
    };
    
    setUserState(demoUser);
    setToken('demo-token');
    setRefreshToken('demo-refresh-token');
    setIsDemoMode(true);
    localStorage.setItem('alimed_token', 'demo-token');
    localStorage.setItem('alimed_refresh_token', 'demo-refresh-token');
    localStorage.setItem('alimed_demo_mode', 'true');
    localStorage.setItem('alimed_user', JSON.stringify(demoUser));
  };

  const enableDemoModeAsDoctor = () => {
    const demoDoctor: User = {
      userId: 'demo-doctor',
      email: 'dr.nowak@alimed.pl',
      firstName: 'Jan',
      lastName: 'Nowak',
      role: 1, // UserRole.Lekarz = 1 (Doctor)
    };
    
    setUserState(demoDoctor);
    setToken('demo-token-doctor');
    setRefreshToken('demo-refresh-token-doctor');
    setIsDemoMode(true);
    localStorage.setItem('alimed_token', 'demo-token-doctor');
    localStorage.setItem('alimed_refresh_token', 'demo-refresh-token-doctor');
    localStorage.setItem('alimed_demo_mode', 'true');
    localStorage.setItem('alimed_user', JSON.stringify(demoDoctor));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        refreshToken,
        isAuthenticated: !!token,
        isDemoMode,
        login,
        logout,
        setUser,
        enableDemoMode,
        enableDemoModeAsDoctor,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
