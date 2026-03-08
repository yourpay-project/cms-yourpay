/**
 * RBAC types. Backend will provide roles and permissions (e.g. from JWT or /me).
 */

export interface Permission {
  id?: string;
  name: string;
  resource?: string;
  action?: string;
}

export interface Role {
  id?: string;
  name: string;
  permissions?: string[];
}

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  roles: string[];
  permissions: string[];
  avatar?: string;
}

export interface JwtPayload {
  sub: string;
  email?: string;
  name?: string;
  roles?: string[];
  permissions?: string[];
  exp: number;
  iat: number;
}
