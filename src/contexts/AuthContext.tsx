// src/contexts/AuthContext.tsx
// Mirrors the web AuthProvider but uses AsyncStorage (via storageService)
// instead of localStorage.

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { apiService, isTokenExpired } from "../services/api";
import { storageService } from "../services/storage";
import type { User, LoginData, RegisterData } from "../types";

// ── Context shape ──────────────────────────────────────────────────────────────

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ── Hook ───────────────────────────────────────────────────────────────────────

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
};

// ── Provider ───────────────────────────────────────────────────────────────────

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Boot-time auth check:
   *  1. Read the stored token — bail early if none exists.
   *  2. Hydrate the UI from the cached user instantly (no flicker).
   *  3. Verify with the server (handles token rotation / expiry).
   */
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);

      const token = await storageService.getAccessToken();

      // No token at all → send to Welcome
      if (!token) {
        setUser(null);
        return;
      }

      // Token is definitively expired → try refresh before giving up
      if (isTokenExpired(token)) {
        try {
          await apiService.refreshToken();
          // Refresh succeeded — fall through to server verify below
        } catch {
          // Refresh also failed → token is dead, send to Welcome
          await storageService.clearAll();
          setUser(null);
          return;
        }
      }

      // Token is valid (or just refreshed) — hydrate UI from cache instantly
      const cached = await storageService.getUserData();
      if (cached) setUser(cached);

      // Verify with server to get fresh user data
      try {
        const response = await apiService.getDashboard();
        if (response?.user) {
          setUser(response.user);
          await storageService.setUserData(response.user);
        }
      } catch (err: any) {
        if (err?.status === 401) {
          // Definitively rejected by server → Welcome
          await storageService.clearAll();
          setUser(null);
        } else {
          // Transient network error — keep cached user, stay on Main
          // (offline-tolerant: don't log out a valid user just because wifi dropped)
          if (!cached) {
            await storageService.clearAll();
            setUser(null);
          }
        }
      }
    } catch {
      await storageService.clearAll();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // ── Auth actions ────────────────────────────────────────────────────────────

  const login = useCallback(async (data: LoginData): Promise<void> => {
    // apiService.login() persists tokens + user to storage internally
    const response = await apiService.login(data);
    setUser(response.user);
  }, []);

  const register = useCallback(async (data: RegisterData): Promise<void> => {
    // 1. Create the account
    await apiService.register(data);

    // 2. Auto-login with the same credentials (mirrors the web flow)
    const loginResponse = await apiService.login({
      username: data.username,
      password: data.password1, // backend field is password1
    });
    setUser(loginResponse.user);
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      // Blacklist the refresh token on the server
      await apiService.logout();
    } catch {
      /* storage is already cleared inside apiService.logout() */
    } finally {
      setUser(null);
    }
  }, []);

  const refreshUser = useCallback(async (): Promise<void> => {
    await checkAuth();
  }, [checkAuth]);

  // ── Value ───────────────────────────────────────────────────────────────────

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
