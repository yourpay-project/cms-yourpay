import { z } from 'zod';

/**
 * Zod schema for the authenticated operator/user returned by auth endpoints.
 * Used for runtime validation and deriving TypeScript types.
 */
export const authUserSchema = z.object({
  id: z.string(),
  email: z.string().email().or(z.string()),
  name: z.string().optional(),
  roles: z.array(z.string()),
  permissions: z.array(z.string()),
  avatar: z.string().optional(),
});

export type AuthUserSchema = z.infer<typeof authUserSchema>;

