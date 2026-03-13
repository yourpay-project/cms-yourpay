import { z } from "zod";

const loginResponseBodySchema = z.object({
  operator_id: z.string().min(1),
  username: z.string().min(1),
  role: z.string().min(1),
  token: z.string().min(1),
});

/**
 * Full login response envelope as returned by the API client
 * (i.e. `{ data: LoginResponse, request_id?: string }`).
 */
export const loginResponseSchema = z.object({
  data: loginResponseBodySchema,
  request_id: z.string().optional(),
});

/** Unwrapped login response payload (`data` field). */
export type LoginResponse = z.infer<typeof loginResponseBodySchema>;

