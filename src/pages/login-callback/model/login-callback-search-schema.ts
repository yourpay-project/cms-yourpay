import { z } from 'zod';

/**
 * Zod schema for `/login/callback` query string parameters.
 * Validates the OAuth callback `token` if present.
 */
export const loginCallbackSearchSchema = z.object({
  token: z.string().optional(),
});

export type LoginCallbackSearch = z.infer<typeof loginCallbackSearchSchema>;

