"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  authApi,
  getAccessToken,
  onAccessTokenChange,
  setAccessToken,
  type ApiEnvelope,
  type Permission,
  type RegisterResult,
  type UserRole,
} from "@/lib/api";

export interface SessionUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  /** From login / GET /auth/me — what this user may do in the dashboard. */
  permissions: Permission[];
  isEmailVerified: boolean;
  createdAt?: string;
}

type Status = "loading" | "authenticated" | "guest";

interface AuthContextValue {
  user: SessionUser | null;
  status: Status;
  /** Has dashboard:access. */
  isStaff: boolean;
  /** The built-in admin role. */
  isAdmin: boolean;
  /** True when the user holds every listed permission. */
  can: (...perms: Permission[]) => boolean;
  login: (email: string, password: string) => Promise<SessionUser>;
  register: (input: { fullName: string; email: string; password: string }) => Promise<ApiEnvelope<RegisterResult>>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  reloadUser: () => Promise<SessionUser | null>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  const reloadUser = useCallback(async () => {
    if (!getAccessToken()) {
      setUser(null);
      setStatus("guest");
      return null;
    }
    try {
      const me = await authApi.me();
      const u: SessionUser = {
        id: me._id,
        fullName: me.fullName,
        email: me.email,
        role: me.role,
        permissions: me.permissions ?? [],
        isEmailVerified: me.isEmailVerified,
        createdAt: me.createdAt,
      };
      setUser(u);
      setStatus("authenticated");
      return u;
    } catch {
      setAccessToken(null);
      setUser(null);
      setStatus("guest");
      return null;
    }
  }, []);

  // Restore the session on first load (the client refreshes an expired token itself).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- session restore reads the stored token (client-only)
    void reloadUser();
  }, [reloadUser]);

  // Token cleared elsewhere (refresh failed, other tab logged out) → become a guest.
  useEffect(
    () =>
      onAccessTokenChange((token) => {
        if (!token) {
          setUser(null);
          setStatus("guest");
        }
      }),
    []
  );

  // Keep tabs in sync.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "oc_access_token") void reloadUser();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [reloadUser]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await authApi.login({ email: email.trim(), password });
    setAccessToken(res.accessToken);
    const u: SessionUser = { ...res.user, permissions: res.user.permissions ?? [] };
    setUser(u);
    setStatus("authenticated");
    return u;
  }, []);

  const register = useCallback(
    (input: { fullName: string; email: string; password: string }) =>
      authApi.register({ ...input, fullName: input.fullName.trim(), email: input.email.trim() }),
    []
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // the local session is cleared regardless
    }
    setAccessToken(null);
    setUser(null);
    setStatus("guest");
  }, []);

  const logoutAll = useCallback(async () => {
    try {
      await authApi.logoutAll();
    } finally {
      setAccessToken(null);
      setUser(null);
      setStatus("guest");
    }
  }, []);

  const can = useCallback(
    (...perms: Permission[]) => !!user && perms.every((p) => user.permissions.includes(p)),
    [user]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      isStaff: !!user?.permissions.includes("dashboard:access"),
      isAdmin: user?.role === "admin",
      can,
      login,
      register,
      logout,
      logoutAll,
      reloadUser,
    }),
    [user, status, can, login, register, logout, logoutAll, reloadUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
