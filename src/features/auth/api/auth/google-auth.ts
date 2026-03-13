import { useAuthStore } from "@/entities/session";

export const getGoogleAuthUrl = (): string => {
  const base = import.meta.env.VITE_API_BASE_URL ?? "/api";
  const url = import.meta.env.VITE_GOOGLE_AUTH_URL;
  if (url) return url;
  return `${base.replace(/\/$/, "")}/auth/google`;
};

export const setTokenFromCallback = (token: string): void => {
  // Store bearer token directly in the auth store for client-only auth.
  useAuthStore.getState().setToken(token);
};

