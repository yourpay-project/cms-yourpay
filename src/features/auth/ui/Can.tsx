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
  const allowed =
    hasCheck &&
    ((permission != null && can(permission)) ||
      (permissions != null && permissions.length > 0 && canAny(permissions)) ||
      (role != null && hasRole(role)) ||
      (roles != null && roles.length > 0 && hasAnyRole(roles)));

  return <>{allowed ? children : fallback}</>;
};

