import { z } from "zod";

/**
 * Zod schema for the operator login response payload.
 *
 * The `user` field is kept as `unknown` here and should be validated by the
 * consumer (e.g. `authUserSchema`) to keep domain schemas centralized.
 */
export const loginResponseSchema = z.object({
  access_token: z.string().min(1),
  refresh_token: z.string().optional(),
  user: z.unknown(),
});

/** Login response payload returned by the backend. */
export type LoginResponse = z.infer<typeof loginResponseSchema>;

