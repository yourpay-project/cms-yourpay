import { captureException } from "@/shared/lib";
import { ApiClientError } from "./errors";
import type { ApiClientConfig, ApiResponse, RequestOptions } from "./types";

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

async function requestWithRefresh<T>(
  config: ApiClientConfig,
  path: string,
  options: RequestOptions,
  retried = false
): Promise<ApiResponse<T>> {
  const resolvedPath =
    options.pathParams != null
      ? Object.entries(options.pathParams).reduce((acc, [key, value]) => {
          return acc.replace(`{${key}}`, encodeURIComponent(String(value)));
        }, path)
      : path;

  const { pathParams, ...requestOptions } = options;

  const url = resolvedPath.startsWith("http")
    ? path
    : `${config.baseUrl.replace(/\/$/, "")}/${resolvedPath.replace(/^\/+/, "")}`;
  const access = config.getAccessToken();
  const headers: Record<string, string> = {
    ...(requestOptions.headers as Record<string, string>),
  };
  if (!requestOptions.skipAuth && access) {
    headers.Authorization = `Bearer ${access}`;
  }
  if (requestOptions.body && !(requestOptions.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  const res = await fetch(url, {
    ...requestOptions,
    headers,
    body:
      requestOptions.body instanceof FormData
        ? requestOptions.body
        : requestOptions.body
          ? JSON.stringify(requestOptions.body)
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

    const error = new ApiClientError(
      message,
      res.status,
      typeof data === "object" && data !== null && "code" in data
        ? String((data as { code?: string }).code)
        : undefined
    );

    // Capture HTTP errors in Sentry when enabled, without breaking existing behavior.
    captureException(error, {
      url,
      status: res.status,
      path,
      method: options.method ?? "GET",
    });

    throw error;
  }

  return { data: data as T, status: res.status, ok: res.ok };
}

export const createApiRequest = (getConfig: () => ApiClientConfig) => {
  return async function apiRequest<T>(
    path: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return requestWithRefresh<T>(getConfig(), path, options);
  };
};

