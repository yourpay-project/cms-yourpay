import { useAuthStore } from "@/store/auth-store";
import type { AuthUser } from "@/types/auth";

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
