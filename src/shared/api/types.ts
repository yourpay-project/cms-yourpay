export type ApiClientConfig = {
  baseUrl: string;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  onTokensRefreshed?: (access: string, refresh?: string) => void;
  onUnauthorized?: () => void;
};

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

