import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "@/entities/session";
import { logout as authLogout } from "../api/auth-service";

export const useLogout = () => {
  const navigate = useNavigate();
  const clearStore = useAuthStore((s) => s.logout);

  return () => {
    authLogout();
    clearStore();
    navigate({ to: "/login" });
  };
};

