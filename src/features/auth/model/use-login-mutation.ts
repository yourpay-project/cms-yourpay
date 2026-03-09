import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useAuthStore } from "@/entities/session";
import { ApiClientError } from "@/shared/api";
import { isDemoCredentials, DEMO_ADMIN_USER } from "../constants/demo-auth";
import { login, type LoginPayload } from "../api/auth-service";

/**
 * Mutation hook for handling the login flow (email/password + demo mode).
 *
 * - Sends credentials to the backend via `auth-service.login`.
 * - Falls back to a local demo admin user when demo credentials are used.
 * - Stores the resulting user into the session store and redirects to `/`.
 */
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
      navigate({ to: "/" });
    },
    onError: (err) => {
      const message =
        err instanceof ApiClientError
          ? err.message
          : "Login failed. Please try again.";
      toast.error(message);
    },
  });
};

