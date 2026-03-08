import { useCan } from "@/features/auth/hooks/useCan";

interface CanProps {
  permission?: string;
  permissions?: string[];
  role?: string;
  roles?: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Conditionally render children based on RBAC (permission or role).
 * If any of permission/permissions/role/roles matches, children are shown; else fallback.
 */
export const Can = ({ permission, permissions, role, roles, children, fallback = null }: CanProps) => {
  const { can, canAny, hasRole, hasAnyRole } = useCan();

  const hasCheck =
    permission != null ||
    (permissions != null && permissions.length > 0) ||
    role != null ||
    (roles != null && roles.length > 0);
  const allowed =
    hasCheck &&
    ((permission != null && can(permission)) ||
      (permissions != null && permissions.length > 0 && canAny(permissions)) ||
      (role != null && hasRole(role)) ||
      (roles != null && roles.length > 0 && hasAnyRole(roles)));

  return <>{allowed ? children : fallback}</>;
};
