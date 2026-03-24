/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_BRAND_LOGO_URL?: string;
  readonly VITE_GOOGLE_AUTH_URL?: string;
  readonly VITE_APP_VERSION?: string;
  readonly VITE_APP_ENV?: "development" | "staging" | "production";
  readonly VITE_SENTRY_DSN?: string;
  readonly VITE_SENTRY_ENABLED?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
