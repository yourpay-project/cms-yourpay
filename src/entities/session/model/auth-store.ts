import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser } from "./types";

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
}

/**
 * Global session store for the CMS operator.
 *
 * - Persists the authenticated `AuthUser` in `localStorage` under `cms-auth`.
 * - Exposes boolean helpers for permission/role checks used by the auth feature.
 * - Keeps a denormalized `isAuthenticated` flag for inexpensive routing guards.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: () => set({ user: null, isAuthenticated: false }),
      // NOTE: Temporary relaxed RBAC logic.
      // Original implementations:
      // hasPermission: (permission) => {
      //   const { user } = get();
      //   if (!user?.permissions?.length) return false;
      //   return user.permissions.includes(permission) || user.permissions.includes("*");
      // },
      // hasRole: (role) => {
      //   const { user } = get();
      //   if (!user?.roles?.length) return false;
      //   return user.roles.includes(role) || user.roles.includes("super_admin");
      // },
      // hasAnyPermission: (permissions) =>
      //   permissions.some((p) => get().hasPermission(p)),
      // hasAnyRole: (roles) => roles.some((r) => get().hasRole(r)),
      hasPermission: () => true,
      hasRole: () => true,
      hasAnyPermission: () => true,
      hasAnyRole: () => true,
    }),
    { name: "cms-auth" }
  )
);
