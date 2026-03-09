import { useAuthStore } from "@/entities/session";

/**
 * RBAC helper hook that delegates to the underlying `useAuthStore`.
 *
 * Prefer this over pulling individual selectors from the store in UI code:
 * it keeps all RBAC checks encapsulated and easier to evolve.
 */
export const useCan = (): {
  can: (permission: string) => boolean;
  canAny: (permissions: string[]) => boolean;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
} => {
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const hasAnyPermission = useAuthStore((s) => s.hasAnyPermission);
  const hasRole = useAuthStore((s) => s.hasRole);
  const hasAnyRole = useAuthStore((s) => s.hasAnyRole);
  return {
    can: hasPermission,
    canAny: hasAnyPermission,
    hasRole,
    hasAnyRole,
  };
};

