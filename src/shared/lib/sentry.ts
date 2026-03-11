/**
 * Thin wrapper around Sentry’s `captureException`.
 *
 * This module assumes that Sentry has already been initialized
 * by `src/app/sentry.ts`, which is imported first in `src/main.tsx`.
 * When Sentry is disabled or DSN is missing, this becomes a no-op.
 */
import * as Sentry from "@sentry/react";

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;
const SENTRY_ENABLED_RAW = import.meta.env.VITE_SENTRY_ENABLED;

const SENTRY_ENABLED =
  typeof SENTRY_ENABLED_RAW === "string" &&
  SENTRY_ENABLED_RAW.toLowerCase() === "true" &&
  !!SENTRY_DSN;

export function initSentry(): void {
  // Sentry is initialized in `src/app/sentry.ts` and imported first in `src/main.tsx`.
}

export function captureException(
  error: unknown,
  context?: Record<string, unknown>
): void {
  if (!SENTRY_ENABLED) return;
  Sentry.captureException(error, { extra: context });
}

