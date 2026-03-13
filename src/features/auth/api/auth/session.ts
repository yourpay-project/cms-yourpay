import { apiClient, clearTokensInCookies, parseApiData } from "@/shared/api";
import { authUserSchema, type AuthUser } from "@/entities/session";

const AUTH_BASE = "auth";

export const getMe = async (signal?: AbortSignal): Promise<AuthUser> => {
  const res = await apiClient.get<unknown>(`${AUTH_BASE}/me`, { signal });
  return parseApiData(authUserSchema, res);
};

export const logout = async (): Promise<void> => {
  clearTokensInCookies();
  try {
    await apiClient.post<unknown>(`${AUTH_BASE}/logout`, undefined, { skipAuth: true });
  } catch {
    // ignore
  }
};

