import { z } from 'zod';

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().default('/api'),
  VITE_GOOGLE_AUTH_URL: z.string().optional(),
  VITE_APP_VERSION: z.string().optional(),
  VITE_SENTRY_DSN: z.string().optional(),
  VITE_SENTRY_ENABLED: z.string().default('false'),
  VITE_APP_ENV: z.enum(['development', 'staging', 'production']).optional(),
  VITE_SENTRY_TRACES_SAMPLE_RATE: z
    .string()
    .optional()
    .transform((v) => (v == null || v === '' ? undefined : Number(v)))
    .refine((v) => v == null || (!Number.isNaN(v) && v >= 0 && v <= 1), {
      message: 'VITE_SENTRY_TRACES_SAMPLE_RATE must be a number between 0 and 1',
    }),
  VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE: z
    .string()
    .optional()
    .transform((v) => (v == null || v === '' ? undefined : Number(v)))
    .refine((v) => v == null || (!Number.isNaN(v) && v >= 0 && v <= 1), {
      message:
        'VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE must be a number between 0 and 1',
    }),
  VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE: z
    .string()
    .optional()
    .transform((v) => (v == null || v === '' ? undefined : Number(v)))
    .refine((v) => v == null || (!Number.isNaN(v) && v >= 0 && v <= 1), {
      message:
        'VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE must be a number between 0 and 1',
    }),
});

/**
 * Validates Vite environment variables at application startup.
 * Keeps runtime errors predictable and centralized.
 */
export function validateEnv(): void {
  envSchema.parse(import.meta.env);
}

