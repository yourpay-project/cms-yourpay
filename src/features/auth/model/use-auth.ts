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
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
} => {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);
  return { user, isAuthenticated, setUser, logout };
};

