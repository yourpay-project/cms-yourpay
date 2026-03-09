/**
 * HTTP API client with JWT in Authorization header and auto refresh token from cookies.
 * Reusable across the app; use getApiClient() or useApiClient() for consistent behavior.
 */

const COOKIE_ACCESS = "access_token";
const COOKIE_REFRESH = "refresh_token";

export type ApiClientConfig = {
  baseUrl: string;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  onTokensRefreshed?: (access: string, refresh?: string) => void;
  onUnauthorized?: () => void;
};

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(
      "(?:^|; )" + name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1") + "=([^;]*)"
    )
  );
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(
  name: string,
  value: string,
  maxAgeSeconds = 60 * 60 * 24 * 7
): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

export class ApiClientError extends Error {
  status: number;
  code?: string;
  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.code = code;
  }
}

let sharedConfig: ApiClientConfig | null = null;

export function configureApiClient(config: ApiClientConfig): void {
  sharedConfig = config;
}

export function getApiClientConfig(): ApiClientConfig | null {
  return sharedConfig;
}

/**
 * Default token getters: read from cookies (and optionally sync to memory after refresh).
 * Backend should set httpOnly cookies for refresh; if access is in cookie too, use getCookie(COOKIE_ACCESS).
 */
export function getDefaultAccessToken(): string | null {
  return getCookie(COOKIE_ACCESS);
}

export function getDefaultRefreshToken(): string | null {
  return getCookie(COOKIE_REFRESH);
}

export function setTokensInCookies(
  access: string,
  refresh?: string,
  accessMaxAgeSeconds?: number
): void {
  setCookie(COOKIE_ACCESS, access, accessMaxAgeSeconds ?? 60 * 15);
  if (refresh) setCookie(COOKIE_REFRESH, refresh, 60 * 60 * 24 * 7);
}

export function clearTokensInCookies(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE_ACCESS}=; path=/; max-age=0`;
  document.cookie = `${COOKIE_REFRESH}=; path=/; max-age=0`;
}

async function refreshAccessToken(config: ApiClientConfig): Promise<string | null> {
  const refresh = config.getRefreshToken();
  if (!refresh) return null;
  const url = `${config.baseUrl.replace(/\/$/, "")}/auth/refresh`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refresh }),
    credentials: "include",
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { access_token?: string; refresh_token?: string };
  const newAccess = data.access_token ?? null;
  if (newAccess) {
    config.onTokensRefreshed?.(newAccess, data.refresh_token);
  }
  return newAccess;
}

export interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: Record<string, unknown> | FormData;
  skipAuth?: boolean;
  skipRefresh?: boolean;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  ok: boolean;
}

async function requestWithRefresh<T>(
  config: ApiClientConfig,
  path: string,
  options: RequestOptions,
  retried = false
): Promise<ApiResponse<T>> {
  const url = path.startsWith("http")
    ? path
    : `${config.baseUrl.replace(/\/$/, "")}/${path.replace(/^\/+/, "")}`;
  const access = config.getAccessToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };
  if (!options.skipAuth && access) {
    headers.Authorization = `Bearer ${access}`;
  }
  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  const res = await fetch(url, {
    ...options,
    headers,
    body:
      options.body instanceof FormData
        ? options.body
        : options.body
          ? JSON.stringify(options.body)
          : undefined,
  });

  if (res.status === 401 && !options.skipAuth && !options.skipRefresh && !retried) {
    const newAccess = await refreshAccessToken(config);
    if (newAccess) {
      return requestWithRefresh<T>(config, path, { ...options, skipRefresh: true }, true);
    }
    config.onUnauthorized?.();
  }

  let data: T;
  const contentType = res.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    try {
      data = (await res.json()) as T;
    } catch {
      data = undefined as T;
    }
  } else {
    data = (await res.text()) as T;
  }

  if (!res.ok) {
    const message =
      typeof data === "object" && data !== null && "message" in data
        ? String((data as { message?: string }).message)
        : res.statusText;
    throw new ApiClientError(
      message,
      res.status,
      typeof data === "object" && data !== null && "code" in data
        ? String((data as { code?: string }).code)
        : undefined
    );
  }

  return { data: data as T, status: res.status, ok: res.ok };
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const config =
    sharedConfig ?? ({
      baseUrl: import.meta.env.VITE_API_BASE_URL ?? "/api",
      getAccessToken: getDefaultAccessToken,
      getRefreshToken: getDefaultRefreshToken,
    } satisfies ApiClientConfig);
  return requestWithRefresh<T>(config, path, options);
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

