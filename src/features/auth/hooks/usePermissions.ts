import { useAuthStore } from "@/store/auth-store";

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
