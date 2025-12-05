import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('alimed_token');
    const storedRefreshToken = localStorage.getItem('alimed_refresh_token');
    const storedUser = localStorage.getItem('alimed_user');
    const storedDemoMode = localStorage.getItem('alimed_demo_mode');

    if (storedToken && storedRefreshToken) {
      setToken(storedToken);
      setRefreshToken(storedRefreshToken);
    }

    if (storedUser) {
      try {
        setUserState(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user', e);
      }
    }

    if (storedDemoMode === 'true') {
      setIsDemoMode(true);
    }
  }, []);

  const login = (newToken: string, newRefreshToken: string) => {
    setToken(newToken);
    setRefreshToken(newRefreshToken);
    setIsDemoMode(false);
    localStorage.setItem('alimed_token', newToken);
    localStorage.setItem('alimed_refresh_token', newRefreshToken);
    localStorage.removeItem('alimed_demo_mode');
  };

  const logout = () => {
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
      id: 'demo-user',
      email: 'demo@alimed.pl',
      firstName: 'Demo',
      lastName: 'User',
      role: 'Patient' as const,
    };
    
    setUserState(demoUser);
    setToken('demo-token');
    setRefreshToken('demo-refresh-token');
    setIsDemoMode(true);
    localStorage.setItem('alimed_demo_mode', 'true');
    localStorage.setItem('alimed_user', JSON.stringify(demoUser));
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
