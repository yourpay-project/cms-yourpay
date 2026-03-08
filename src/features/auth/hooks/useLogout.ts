import { useNavigate } from "react-router-dom";
import { logout as authLogout } from "@/features/auth/services/auth-service";
import { useAuthStore } from "@/store/auth-store";

export const useLogout = () => {
  const navigate = useNavigate();
  const clearStore = useAuthStore((s) => s.logout);

  return () => {
    authLogout();
    clearStore();
    navigate("/login", { replace: true });
  };
};
