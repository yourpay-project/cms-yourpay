import { useAuthStore } from "@/entities/session";

/**
 * Read‑only view over the current user's permission list plus helpers.
 *
 * Use this in dashboards or widgets that need to render permission badges or
 * lists, while `useCan` is better for yes/no access checks.
 */
export const usePermissions = (): {
  permissions: string[];
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
} => {
  const user = useAuthStore((s) => s.user);
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const hasAnyPermission = useAuthStore((s) => s.hasAnyPermission);
  const permissions = user?.permissions ?? [];
  return { permissions, hasPermission, hasAnyPermission };
};

