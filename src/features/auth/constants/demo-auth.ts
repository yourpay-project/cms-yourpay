import type { AuthUser } from "@/entities/session";

/**
 * Static demo credentials for local development when the backend is not available.
 * Remove or replace this when the real authentication flow is fully wired.
 */
export const DEMO_CREDENTIALS = {
  email: "demo@yourpay.co.id",
  password: "password",
} as const;

/**
 * In‑memory admin user with full roles and permissions so all CMS menus are visible.
 * Only used when logging in with {@link DEMO_CREDENTIALS}.
 */
export const DEMO_ADMIN_USER: AuthUser = {
  id: "demo-admin-1",
  email: DEMO_CREDENTIALS.email,
  name: "Demo Admin",
  roles: [
    "super_admin",
    "Operator",
    "Partner",
    "panel_user",
  ],
  permissions: ["*"],
};

export const isDemoCredentials = (email: string, password: string): boolean =>
  email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password;
