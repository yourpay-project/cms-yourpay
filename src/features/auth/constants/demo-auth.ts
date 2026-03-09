import type { AuthUser } from "@/entities/session";

/** Demo login (no BE). Ganti/hapus setelah backend siap. */
export const DEMO_CREDENTIALS = {
  email: "admin@yourpay.co.id",
  password: "password",
} as const;

/**
 * Dummy admin dengan semua role agar semua menu sidebar tampil.
 * Hanya dipakai saat login dengan DEMO_CREDENTIALS.
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
