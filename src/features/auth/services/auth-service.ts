import { apiClient, setTokensInCookies, clearTokensInCookies } from "@/lib/api-client";
import type { AuthUser } from "@/types/auth";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token?: string;
  user: AuthUser;
}

const AUTH_BASE = "auth";

/**
 * Login with email/password. Expects BE: POST /auth/login → { access_token, refresh_token?, user }.
 * Stores tokens in cookies; caller should setUser(response.user).
 */
export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  const res = await apiClient.post<LoginResponse>(`${AUTH_BASE}/login`, payload as unknown as Record<string, unknown>, { skipAuth: true });
  const data = res.data;
  if (data.access_token) {
    setTokensInCookies(data.access_token, data.refresh_token, 60 * 15);
  }
  return data;
};

/**
 * Fetch current user. Expects BE: GET /auth/me → AuthUser.
 */
export const getMe = async (): Promise<AuthUser> => {
  const res = await apiClient.get<AuthUser>(`${AUTH_BASE}/me`);
  return res.data;
};

/**
 * Logout: clear tokens and optionally call BE logout.
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
 * URL for Google OAuth redirect. Laravel: route('auth.google.redirect').
 * BE should redirect to Google then callback; callback redirects back to app with token or sets cookies.
 */
export const getGoogleAuthUrl = (): string => {
  const base = import.meta.env.VITE_API_BASE_URL ?? "/api";
  const url = import.meta.env.VITE_GOOGLE_AUTH_URL;
  if (url) return url;
  return `${base.replace(/\/$/, "")}/auth/google`;
};

/**
 * After Google callback: BE may redirect to /login/callback?token=... or set cookies and redirect to /.
 * If token in query, store it and return true so callback page can fetch /me.
 */
export const setTokenFromCallback = (token: string): void => {
  setTokensInCookies(token, undefined, 60 * 15);
};
