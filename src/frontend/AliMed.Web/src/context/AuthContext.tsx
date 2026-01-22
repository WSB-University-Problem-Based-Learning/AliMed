import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User, UserRole } from '../types/api';
import { apiService, setAuthToken } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAuthReady: boolean;
  isDemoMode: boolean;
  login: (_token: string, _refreshToken: string) => void;
  logout: () => void;
  setUser: (_user: User) => void;
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
    role: role as UserRole,
  };
};

const buildDefaultDemoUser = (): User => ({
  userId: 'demo-user',
  email: 'demo@alimed.pl',
  firstName: 'Demo',
  lastName: 'User',
  role: 0,
});

const readStoredAuth = () => {
  if (typeof window === 'undefined') {
    return { storedDemoMode: false, storedDemoUser: null };
  }

  const storedDemoMode = localStorage.getItem('alimed_demo_mode') === 'true';
  let storedDemoUser: User | null = null;

  if (storedDemoMode) {
    const storedUserRaw = localStorage.getItem('alimed_user');
    if (storedUserRaw) {
      try {
        storedDemoUser = JSON.parse(storedUserRaw) as User;
      } catch (e) {
        console.error('Failed to parse stored demo user', e);
      }
    }
  }

  if (storedDemoMode && !storedDemoUser) {
    storedDemoUser = buildDefaultDemoUser();
  }

  return { storedDemoMode, storedDemoUser };
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { storedDemoMode, storedDemoUser } = readStoredAuth();
  const initialDemoToken =
    storedDemoMode && storedDemoUser?.role === 1 ? 'demo-token-doctor' : storedDemoMode ? 'demo-token' : null;

  const [user, setUserState] = useState<User | null>(storedDemoUser);
  const [token, setToken] = useState<string | null>(initialDemoToken);
  const [isDemoMode, setIsDemoMode] = useState(storedDemoMode);
  const [isAuthReady, setIsAuthReady] = useState(storedDemoMode);

  const clearDemoStorage = () => {
    if (typeof window === 'undefined') {
      return;
    }
    localStorage.removeItem('alimed_demo_mode');
    localStorage.removeItem('alimed_user');
  };

  const applyToken = (newToken: string | null) => {
    if (!newToken) {
      setToken(null);
      setUserState(null);
      setAuthToken(null);
      return;
    }

    const derivedUser = getUserFromToken(newToken);
    if (!derivedUser) {
      setToken(null);
      setUserState(null);
      setAuthToken(null);
      return;
    }

    setToken(newToken);
    setUserState(derivedUser);
    setAuthToken(newToken);
  };

  useEffect(() => {
    let cancelled = false;

    const bootstrapAuth = async () => {
      if (isDemoMode) {
        setAuthToken(token);
        setIsAuthReady(true);
        return;
      }

      if (token) {
        setIsAuthReady(true);
        return;
      }

      try {
        const { accessToken } = await apiService.refreshToken();
        if (cancelled) return;
        applyToken(accessToken || null);
      } catch {
        if (cancelled) return;
        applyToken(null);
      } finally {
        if (!cancelled) {
          setIsAuthReady(true);
        }
      }
    };

    bootstrapAuth();

    return () => {
      cancelled = true;
    };
  }, [isDemoMode]);

  const login = (newToken: string, _refreshToken: string) => {
    setIsDemoMode(false);
    clearDemoStorage();
    applyToken(newToken);
    setIsAuthReady(true);
  };

  const logout = async () => {
    if (!isDemoMode) {
      try {
        await apiService.logout();
      } catch (error) {
        console.error('Error during backend logout:', error);
      }
    }

    applyToken(null);
    setIsDemoMode(false);
    clearDemoStorage();
    setIsAuthReady(true);
  };

  const setUser = (newUser: User) => {
    setUserState(newUser);
    if (isDemoMode && typeof window !== 'undefined') {
      localStorage.setItem('alimed_user', JSON.stringify(newUser));
    }
  };

  const enableDemoMode = () => {
    const demoUser = buildDefaultDemoUser();

    setUserState(demoUser);
    setToken('demo-token');
    setAuthToken('demo-token');
    setIsDemoMode(true);
    setIsAuthReady(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('alimed_demo_mode', 'true');
      localStorage.setItem('alimed_user', JSON.stringify(demoUser));
    }
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
    setAuthToken('demo-token-doctor');
    setIsDemoMode(true);
    setIsAuthReady(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('alimed_demo_mode', 'true');
      localStorage.setItem('alimed_user', JSON.stringify(demoDoctor));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!token,
        isAuthReady,
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
