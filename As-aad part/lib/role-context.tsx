'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User, Role } from './types';

export type { Role };

interface RoleState {
  user: User | null;
  role: Role | null;
  userName: string;
  userEmail: string;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => void;
  registerUser: (data: { name: string; email: string; password?: string; role: Role; phone?: string }) => Promise<{ success: boolean; user?: User; error?: string }>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
}

const RoleContext = createContext<RoleState | null>(null);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRoleState] = useState<Role | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Restore authenticated session after client hydration to prevent SSR mismatch
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedSession =
          sessionStorage.getItem('autodoc_tab_jwt_session') ||
          localStorage.getItem('autodoc_tab_jwt_session');

        if (storedSession) {
          const parsed = JSON.parse(storedSession);
          if (parsed && parsed.user && parsed.accessToken) {
            setUser(parsed.user);
            setRoleState(parsed.user.role);
            setUserName(parsed.user.name);
            setUserEmail(parsed.user.email);
            setAccessToken(parsed.accessToken);
            setRefreshToken(parsed.refreshToken || null);
            setIsAuthenticated(true);

            // Live revalidation from Neon PostgreSQL
            fetch(`/api/auth/profile?email=${encodeURIComponent(parsed.user.email)}`)
              .then((res) => res.json())
              .then((resData) => {
                if (resData.success && resData.data) {
                  const dbUser = resData.data;
                  setUser(dbUser);
                  setUserName(dbUser.name);
                  setRoleState(dbUser.role);
                }
              })
              .catch((err) => console.warn('Profile revalidation error:', err));
          }
        }
      } catch (e) {
        console.error('Storage read error:', e);
      }
    }
  }, []);

  // Silent Token Refresh Timer (Every 12 minutes before 15-min Access Token expiry)
  useEffect(() => {
    if (!refreshToken) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/auth/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });
        const data = await res.json();
        if (data.success && data.accessToken) {
          setAccessToken(data.accessToken);
          if (data.refreshToken) setRefreshToken(data.refreshToken);
          if (data.user) {
            setUser(data.user);
            saveTabSession(data.user, data.accessToken, data.refreshToken || refreshToken);
          }
        } else if (data.error && data.error.includes('suspended')) {
          logout();
          alert(data.error);
        }
      } catch (e) {
        console.warn('Silent token refresh failed:', e);
      }
    }, 12 * 60 * 1000);

    return () => clearInterval(interval);
  }, [refreshToken]);

  const saveTabSession = useCallback((u: User, accToken: string, refToken: string) => {
    setUser(u);
    setRoleState(u.role);
    setUserName(u.name);
    setUserEmail(u.email);
    setAccessToken(accToken);
    setRefreshToken(refToken);
    setIsAuthenticated(true);

    if (typeof window !== 'undefined') {
      const sessionStr = JSON.stringify({ user: u, accessToken: accToken, refreshToken: refToken });
      sessionStorage.setItem('autodoc_tab_jwt_session', sessionStr);
      localStorage.setItem('autodoc_tab_jwt_session', sessionStr);
    }
  }, []);

  const login = useCallback(async (email: string, password?: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.success && data.data && data.accessToken) {
        saveTabSession(data.data, data.accessToken, data.refreshToken);
        return { success: true, user: data.data };
      } else {
        return { success: false, error: data.error || 'Account not found. Please register first.' };
      }
    } catch (e: any) {
      return { success: false, error: 'Authentication failed. Please verify database connection.' };
    }
  }, [saveTabSession]);

  const registerUser = useCallback(async (data: { name: string; email: string; password?: string; role: Role; phone?: string }) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (result.success && result.data && result.accessToken) {
        saveTabSession(result.data, result.accessToken, result.refreshToken);
        return { success: true, user: result.data };
      } else {
        return { success: false, error: result.error || 'Registration failed. Please try again.' };
      }
    } catch (e: any) {
      return { success: false, error: 'Failed to connect to registration server.' };
    }
  }, [saveTabSession]);

  const updateUserProfile = useCallback(async (data: Partial<User>) => {
    if (!user || !accessToken) return;
    const updated = { ...user, ...data };
    saveTabSession(updated, accessToken, refreshToken || '');
  }, [user, accessToken, refreshToken, saveTabSession]);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    setRoleState(null);
    setUserName('');
    setUserEmail('');
    setAccessToken(null);
    setRefreshToken(null);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('autodoc_tab_jwt_session');
      localStorage.removeItem('autodoc_tab_jwt_session');
      window.location.href = '/';
    }
  }, []);

  return (
    <RoleContext.Provider
      value={{
        user,
        role,
        userName,
        userEmail,
        accessToken,
        isAuthenticated,
        login,
        logout,
        registerUser,
        updateUserProfile,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error('useRole must be used within RoleProvider');
  return ctx;
}

export const useAuth = useRole;
export const AuthProvider = RoleProvider;
