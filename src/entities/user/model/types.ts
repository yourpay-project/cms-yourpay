import { z } from 'zod';

/**
 * Zod schema for User entity.
 * Used for runtime validation of API responses and for deriving TypeScript types.
 */
export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email().or(z.string()),
  phone: z.string().optional(),
  status: z.string().optional(),
});

/**
 * User entity as returned by the users list API.
 * Derived from `userSchema` so runtime and compile-time types stay aligned.
 */
export type User = z.infer<typeof userSchema>;

/**
 * Zod schema for the paginated users list response.
 */
export const usersResponseSchema = z.object({
  data: z.array(userSchema),
  total: z.number(),
});

/**
 * Users list response type derived from `usersResponseSchema`.
 */
export type UsersResponse = z.infer<typeof usersResponseSchema>;

