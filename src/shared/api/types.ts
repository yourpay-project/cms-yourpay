export type ApiClientConfig = {
  baseUrl: string;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  onTokensRefreshed?: (access: string, refresh?: string) => void;
  onUnauthorized?: () => void;
};

export interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: Record<string, unknown> | FormData;
  query?: Record<string, string | number | boolean | null | undefined>;
  /**
   * Optional path parameters used by generated API clients to interpolate
   * placeholders such as `{countryCode}` in endpoint URLs.
   */
  pathParams?: Record<string, string | number>;
  skipAuth?: boolean;
  skipRefresh?: boolean;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  ok: boolean;
}

