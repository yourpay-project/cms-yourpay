import {
  apiClient,
  clearTokensInCookies,
  setTokensInCookies,
} from "@/shared/api";
import type { AuthUser } from "@/entities/session";
import { postAuthLogin, type PostAuthLoginPayload, type PostAuthLoginResponse } from "@/shared/api/generated";

export type LoginPayload = PostAuthLoginPayload;
export type LoginResponse = PostAuthLoginResponse<AuthUser>;

const AUTH_BASE = "auth";

/**
 * Perform an email/password login against the backend.
 *
 * On success:
 * - stores access/refresh tokens in cookies (via `shared/api` helpers),
 * - returns the raw `LoginResponse` including the resolved `AuthUser`.
 */
export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  const data = await postAuthLogin<AuthUser>(payload);
  if (data.access_token) {
    setTokensInCookies(data.access_token, data.refresh_token, 60 * 15);
  }
  return data;
};

/**
 * Fetch the current authenticated operator from `/auth/me`.
 * This is typically used after tokens are present (e.g. after OAuth callback).
 */
export const getMe = async (): Promise<AuthUser> => {
  const res = await apiClient.get<AuthUser>(`${AUTH_BASE}/me`);
  return res.data;
};

/**
 * Clear tokens client‑side and attempt to call backend logout.
 * Network failures are swallowed because client tokens are already removed.
 */
export const logout = async (): Promise<void> => {
  clearTokensInCookies();
  try {
    await apiClient.post<unknown>(`${AUTH_BASE}/logout`, undefined, { skipAuth: true });
  } catch {
    // ignore
  }
};

/**
 * Build the Google OAuth redirect URL. If `VITE_GOOGLE_AUTH_URL` is present it
 * is used as‑is, otherwise it falls back to `${VITE_API_BASE_URL}/auth/google`.
 */
export const getGoogleAuthUrl = (): string => {
  const base = import.meta.env.VITE_API_BASE_URL ?? "/api";
  const url = import.meta.env.VITE_GOOGLE_AUTH_URL;
  if (url) return url;
  return `${base.replace(/\/$/, "")}/auth/google`;
};

/**
 * Helper for storing the access token returned via `/login/callback?token=…`.
 */
export const setTokenFromCallback = (token: string): void => {
  setTokensInCookies(token, undefined, 60 * 15);
};

