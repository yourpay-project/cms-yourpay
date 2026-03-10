import packageJson from "../../../package.json";

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;
const SENTRY_ENABLED_RAW = import.meta.env.VITE_SENTRY_ENABLED;
const APP_ENV = import.meta.env.VITE_APP_ENV;
const APP_VERSION = import.meta.env.VITE_APP_VERSION ?? packageJson.version;

const SENTRY_ENABLED =
  typeof SENTRY_ENABLED_RAW === "string" &&
  SENTRY_ENABLED_RAW.toLowerCase() === "true" &&
  !!SENTRY_DSN;

type SentryCaptureFn = (error: unknown, context?: Record<string, unknown>) => void;

let captureExceptionImpl: SentryCaptureFn | null = null;

export function initSentry(): void {
  if (!SENTRY_ENABLED || captureExceptionImpl) {
    return;
  }

  // Lazy-load Sentry so it is completely tree-shakeable when disabled.
  void import("@sentry/react")
    .then((Sentry) => {
      if (!SENTRY_DSN) return;

      Sentry.init({
        dsn: SENTRY_DSN,
        release: APP_VERSION,
        environment: APP_ENV ?? import.meta.env.MODE,
        integrations: (integrations) => integrations,
        tracesSampleRate: 0,
      });

      captureExceptionImpl = (error, context) => {
        Sentry.captureException(error, { extra: context });
      };
    })
    .catch(() => {
      // Fail silently if Sentry cannot be loaded; app must continue to work.
    });
}

export function captureException(
  error: unknown,
  context?: Record<string, unknown>
): void {
  if (!SENTRY_ENABLED) return;

  if (captureExceptionImpl) {
    captureExceptionImpl(error, context);
    return;
  }

  // If called before init finishes, enqueue a lazy import once.
  void import("@sentry/react")
    .then((Sentry) => {
      if (!SENTRY_DSN) return;
      if (!captureExceptionImpl) {
        Sentry.init({
          dsn: SENTRY_DSN,
          release: APP_VERSION,
          environment: APP_ENV ?? import.meta.env.MODE,
          integrations: (integrations) => integrations,
          tracesSampleRate: 0,
        });
        captureExceptionImpl = (err, ctx) => {
          Sentry.captureException(err, { extra: ctx });
        };
      }
      captureExceptionImpl(error, context);
    })
    .catch(() => {
      // Ignore Sentry failures; do not break runtime.
    });
}

