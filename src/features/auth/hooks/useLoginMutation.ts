import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { login, type LoginPayload } from "@/features/auth/services/auth-service";
import { useAuthStore } from "@/store/auth-store";
import { ApiClientError } from "@/lib/api-client";
import { isDemoCredentials, DEMO_ADMIN_USER } from "@/features/auth/constants/demo-auth";

export const useLoginMutation = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      if (isDemoCredentials(payload.email, payload.password)) {
        return { user: DEMO_ADMIN_USER, access_token: "demo", refresh_token: undefined };
      }
      return login(payload);
    },
    onSuccess: (data) => {
      setUser(data.user);
      toast.success("Login successful");
      navigate("/", { replace: true });
    },
    onError: (err) => {
      const message = err instanceof ApiClientError ? err.message : "Login failed. Please try again.";
      toast.error(message);
    },
  });
};
