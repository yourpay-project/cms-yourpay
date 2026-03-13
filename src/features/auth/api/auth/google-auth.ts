import { setTokensInCookies } from "@/shared/api";

export const getGoogleAuthUrl = (): string => {
  const base = import.meta.env.VITE_API_BASE_URL ?? "/api";
  const url = import.meta.env.VITE_GOOGLE_AUTH_URL;
  if (url) return url;
  return `${base.replace(/\/$/, "")}/auth/google`;
};

export const setTokenFromCallback = (token: string): void => {
  setTokensInCookies(token, undefined, 60 * 15);
};

