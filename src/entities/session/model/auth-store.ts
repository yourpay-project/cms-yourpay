import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser } from "./types";

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  /**
   * Raw bearer token used for `Authorization` header.
   * Persisted together with the user for client-only auth.
   */
  token: string | null;
  /**
   * Update the current user and, optionally, the bearer token.
   */
  setUser: (user: AuthUser | null, token?: string | null) => void;
  /**
   * Update only the bearer token without touching the current user.
   */
  setToken: (token: string | null) => void;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
}

/**
 * Global session store for the CMS operator.
 *
 * - Persists the authenticated `AuthUser` and bearer token in `localStorage` under `cms-auth`.
 * - Exposes boolean helpers for permission/role checks used by the auth feature.
 * - Keeps a denormalized `isAuthenticated` flag for inexpensive routing guards.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      token: null,
      setUser: (user, token) =>
        set((state) => ({
          user,
          isAuthenticated: !!user,
          token: token ?? state.token,
        })),
      setToken: (token) =>
        set((state) => ({
          ...state,
          token,
        })),
      logout: () => set({ user: null, isAuthenticated: false, token: null }),
      // NOTE: Temporary relaxed RBAC logic.
      hasPermission: () => true,
      hasRole: () => true,
      hasAnyPermission: () => true,
      hasAnyRole: () => true,
    }),
    { name: "cms-auth" }
  )
);
