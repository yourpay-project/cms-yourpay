/**
 * HTTP API client with JWT in Authorization header and auto refresh token from cookies.
 *
 * This file intentionally re-exports a compact public API while the
 * implementation lives in smaller modules under `shared/api/*`.
 */
import {
  clearTokensInCookies,
  getDefaultAccessToken,
  getDefaultRefreshToken,
  setTokensInCookies,
} from "./cookies";
import { createApiRequest } from "./request";
import { ApiClientError } from "./errors";
import type { ApiClientConfig, ApiResponse, RequestOptions } from "./types";

let sharedConfig: ApiClientConfig | null = null;

export function configureApiClient(config: ApiClientConfig): void {
  sharedConfig = config;
}

export function getApiClientConfig(): ApiClientConfig | null {
  return sharedConfig;
}

export type { ApiClientConfig, ApiResponse, RequestOptions };
export { ApiClientError, getDefaultAccessToken, getDefaultRefreshToken, setTokensInCookies, clearTokensInCookies };

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const getConfig = () =>
    sharedConfig ?? ({
      baseUrl: import.meta.env.VITE_API_BASE_URL ?? "/api",
      getAccessToken: getDefaultAccessToken,
      getRefreshToken: getDefaultRefreshToken,
    } satisfies ApiClientConfig);

  const request = createApiRequest(getConfig);
  return request<T>(path, options);
}

export const apiClient = {
  get: <T>(path: string, init?: RequestOptions) =>
    apiRequest<T>(path, { ...init, method: "GET" } as RequestOptions),
  post: <T>(path: string, body?: Record<string, unknown>, init?: RequestOptions) =>
    apiRequest<T>(path, { ...init, method: "POST", body } as RequestOptions),
  put: <T>(path: string, body?: Record<string, unknown>, init?: RequestOptions) =>
    apiRequest<T>(path, { ...init, method: "PUT", body } as RequestOptions),
  patch: <T>(path: string, body?: Record<string, unknown>, init?: RequestOptions) =>
    apiRequest<T>(path, { ...init, method: "PATCH", body } as RequestOptions),
  delete: <T>(path: string, init?: RequestOptions) =>
    apiRequest<T>(path, { ...init, method: "DELETE" } as RequestOptions),
};

