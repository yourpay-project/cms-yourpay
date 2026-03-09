import {
  clearTokensInCookies,
  configureApiClient,
  getDefaultAccessToken,
  getDefaultRefreshToken,
  setTokensInCookies,
} from "./api-client";

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "/api";

export function initApiClient(): void {
  configureApiClient({
    baseUrl,
    getAccessToken: getDefaultAccessToken,
    getRefreshToken: getDefaultRefreshToken,
    onTokensRefreshed: (access, refresh) => {
      setTokensInCookies(access, refresh);
    },
    onUnauthorized: () => {
      clearTokensInCookies();
      window.location.href = "/login";
    },
  });
}

