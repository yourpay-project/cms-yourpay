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
  let resolvedPath = path;
  if (options.pathParams != null) {
    resolvedPath = Object.entries(options.pathParams).reduce((acc, [key, value]) => {
      return acc.replace(`{${key}}`, encodeURIComponent(String(value)));
    }, path);
  }

  const requestOptions = { ...options };
  delete requestOptions.pathParams;
  const query = requestOptions.query;
  delete requestOptions.query;

  let baseUrl = `${config.baseUrl.replace(/\/$/, "")}/${resolvedPath.replace(/^\/+/, "")}`;
  if (resolvedPath.startsWith("http")) {
    baseUrl = path;
  }
  const searchParams = new URLSearchParams();
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value == null || value === "") continue;
      searchParams.set(key, String(value));
    }
  }
  let url = baseUrl;
  const queryString = searchParams.toString();
  if (queryString) {
    url = `${baseUrl}?${queryString}`;
  }
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
    body: (() => {
      if (requestOptions.body instanceof FormData) {
        return requestOptions.body;
      }
      if (requestOptions.body) {
        return JSON.stringify(requestOptions.body);
      }
      return undefined;
    })(),
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
    let message = res.statusText;
    if (typeof data === "object" && data !== null && "message" in data) {
      message = String((data as { message?: string }).message);
    }

    let code: string | undefined = undefined;
    if (typeof data === "object" && data !== null && "code" in data) {
      code = String((data as { code?: string }).code);
    }

    const error = new ApiClientError(
      message,
      res.status,
      code
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

