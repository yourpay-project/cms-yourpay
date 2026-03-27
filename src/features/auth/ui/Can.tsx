import type { FC, ReactNode } from "react";
import { useCan } from "../model";

export interface CanProps {
  permission?: string;
  permissions?: string[];
  role?: string;
  roles?: string[];
  children: ReactNode;
  fallback?: ReactNode;
}

export const Can: FC<CanProps> = ({
  permission,
  permissions,
  role,
  roles,
  children,
  fallback = null,
}) => {
  const { can, canAny, hasRole, hasAnyRole } = useCan();

  const hasCheck =
    permission != null ||
    (permissions != null && permissions.length > 0) ||
    role != null ||
    (roles != null && roles.length > 0);
  if (!hasCheck) {
    return <>{fallback}</>;
  }

  const allowed =
    (permission != null && can(permission)) ||
    (permissions != null && permissions.length > 0 && canAny(permissions)) ||
    (role != null && hasRole(role)) ||
    (roles != null && roles.length > 0 && hasAnyRole(roles));

  if (allowed) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};

