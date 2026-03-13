import { useAuthStore, type AuthUser } from "@/entities/session";

/**
 * Convenience hook for reading and mutating the current authenticated operator.
 *
 * This is the main entry point the UI uses to:
 * - read `user` and `isAuthenticated` flags, and
 * - update or clear the user after login/logout flows.
 */
export const useAuth = (): {
  user: AuthUser | null;
  isAuthenticated: boolean;
  token: string | null;
  setUser: (user: AuthUser | null, token?: string | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
} => {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const token = useAuthStore((s) => s.token);
  const setUser = useAuthStore((s) => s.setUser);
  const setToken = useAuthStore((s) => s.setToken);
  const logout = useAuthStore((s) => s.logout);
  return { user, isAuthenticated, token, setUser, setToken, logout };
};

