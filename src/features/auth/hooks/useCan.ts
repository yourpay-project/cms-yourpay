import { useAuthStore } from "@/store/auth-store";

/**
 * Hook for RBAC: check if current user can do something (by permission or role).
 * Use in components to conditionally render or guard actions.
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
