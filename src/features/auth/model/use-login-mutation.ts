import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { authUserSchema, useAuthStore } from "@/entities/session";
import { ApiClientError } from "@/shared/api";
import { login } from "../api";
import type { LoginFormValues } from "./login-schema";

/**
 * Mutation hook for handling the real login flow (email/password).
 *
 * - Sends credentials to the backend via `auth-service.login`.
 * - Stores the resulting user into the session store and redirects to `/`.
 */
export const useLoginMutation = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: async (values: LoginFormValues) => {
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
      setUser(data.user, data.token);
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

