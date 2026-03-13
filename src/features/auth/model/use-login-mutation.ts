import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { authUserSchema, useAuthStore } from "@/entities/session";
import { ApiClientError } from "@/shared/api";
import { DEMO_ADMIN_USER, isDemoCredentials } from "../constants";
import { login } from "../api";
import type { LoginFormValues } from "./login-schema";

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
    mutationFn: async (values: LoginFormValues) => {
      if (isDemoCredentials(values.email, values.password)) {
        return {
          user: authUserSchema.parse(DEMO_ADMIN_USER),
          token: "demo",
        };
      }
      const data = await login({ username: values.email, password: values.password });
      const user = authUserSchema.parse({
        id: data.operator_id,
        email: data.username,
        name: data.username,
        roles: [data.role],
        permissions: [],
        avatar: undefined,
      });
      return { ...data, user };
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

