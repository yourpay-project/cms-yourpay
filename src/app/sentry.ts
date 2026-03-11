/**
 * Global Sentry initialization for the React SPA.
 *
 * This module is imported as the very first import in `src/main.tsx`
 * to follow Sentry’s React SPA guidance:
 * https://docs.sentry.io/platforms/javascript/guides/react/
 *
 * Runtime configuration:
 * - VITE_SENTRY_DSN (required when enabled)
 * - VITE_SENTRY_ENABLED ("true" to enable)
 * - VITE_APP_ENV (optional, used as Sentry environment; falls back to Vite mode)
 * - VITE_APP_VERSION (optional, falls back to package.json version)
 *
 * Optional sampling configuration (all default to 0 = disabled):
 * - VITE_SENTRY_TRACES_SAMPLE_RATE
 * - VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE
 * - VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE
 */
import * as Sentry from "@sentry/react";
import packageJson from "../../package.json";

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;
const SENTRY_ENABLED_RAW = import.meta.env.VITE_SENTRY_ENABLED;
const APP_ENV = import.meta.env.VITE_APP_ENV;
const APP_VERSION = import.meta.env.VITE_APP_VERSION ?? packageJson.version;

const TRACES_SAMPLE_RATE_RAW = import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE;
const REPLAYS_SESSION_SAMPLE_RATE_RAW =
  import.meta.env.VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE;
const REPLAYS_ON_ERROR_SAMPLE_RATE_RAW =
  import.meta.env.VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE;

const SENTRY_ENABLED =
  typeof SENTRY_ENABLED_RAW === "string" &&
  SENTRY_ENABLED_RAW.toLowerCase() === "true" &&
  !!SENTRY_DSN;

const parseRate = (raw: unknown, fallback: number) => {
  if (typeof raw !== "string" || raw.trim() === "") return fallback;
  const n = Number.parseFloat(raw);
  return Number.isFinite(n) ? n : fallback;
};

if (SENTRY_ENABLED) {
  const tracesSampleRate = parseRate(TRACES_SAMPLE_RATE_RAW, 0);
  const replaysSessionSampleRate = parseRate(REPLAYS_SESSION_SAMPLE_RATE_RAW, 0);
  const replaysOnErrorSampleRate = parseRate(REPLAYS_ON_ERROR_SAMPLE_RATE_RAW, 0);

  Sentry.init({
    dsn: SENTRY_DSN,
    release: APP_VERSION,
    environment: APP_ENV ?? import.meta.env.MODE,
    integrations: [
      ...(tracesSampleRate > 0 ? [Sentry.browserTracingIntegration()] : []),
      ...(replaysSessionSampleRate > 0 || replaysOnErrorSampleRate > 0
        ? [Sentry.replayIntegration()]
        : []),
    ],
    tracesSampleRate,
    replaysSessionSampleRate,
    replaysOnErrorSampleRate,
  });
}

