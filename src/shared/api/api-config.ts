import { configureApiClient } from "./api-client";
import { useAuthStore } from "@/entities/session";

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "/api";

export function initApiClient(): void {
  configureApiClient({
    baseUrl,
    getAccessToken: () => {
      try {
        return useAuthStore.getState().token;
      } catch {
        return null;
      }
    },
    getRefreshToken: () => null,
    onTokensRefreshed: () => {
      // No-op: refresh flow is currently disabled in client-only auth mode.
    },
    onUnauthorized: () => {
      try {
        useAuthStore.getState().logout();
      } catch {
        // ignore
      }
    },
  });
}

