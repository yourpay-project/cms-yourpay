import { z } from "zod";

/**
 * Zod schema for a single YourPay customer row used in the `/customers` table.
 *
 * This is a **view model** derived from the backend `Customer` object
 * returned by `GET v1/operators/customers`.
 *
 * Only fields required by the CMS UI are included here.
 */
export const userSchema = z.object({
  /** Customer ID (primary identifier shown in the table). */
  id: z.string(),
  /** Backend `user_id` field (YourPay user identifier). */
  userId: z.string().optional(),
  /** Given name of the customer. */
  firstName: z.string().optional(),
  /** Family name of the customer. */
  lastName: z.string().optional(),
  /** Phone number registered to the customer. */
  phoneNumber: z.string().optional(),
  /** Whether the phone number is active. */
  isPhoneActive: z.boolean().optional(),
  /** Country where the customer is registered (e.g. ID, HK, SG). */
  countryOfRegistration: z.string().optional(),
  /** Nationality text as returned by the backend. */
  nationality: z.string().optional(),
  /** User status (e.g. active, inactive, blocked). */
  status: z.string().optional(),
  /** ISO timestamp for when the customer was created. */
  createdAt: z.string().optional(),
  /**
   * Gender value as returned by the backend.
   *
   * Backend can send values like "male", "female", or an empty string,
   * so we keep this as a plain optional string in the view model.
   */
  gender: z.string().optional().nullable(),
});

/**
 * User (customer) entity as displayed in the customers table.
 */
export type User = z.infer<typeof userSchema>;

/**
 * Zod schema for a single filter option returned by backend metadata.
 */
export const usersFilterOptionSchema = z.object({
  label: z.string(),
  value: z.string(),
});

export type UsersFilterOption = z.infer<typeof usersFilterOptionSchema>;
export const usersFilterTypeSchema = z.enum(["control", "options", "date_range"]);
export type UsersFilterType = z.infer<typeof usersFilterTypeSchema>;

/**
 * Zod schema for a backend filter descriptor used by dynamic filter rendering.
 */
export const usersFilterDefinitionSchema = z.object({
  key: z.string(),
  name: z.string().optional(),
  type: usersFilterTypeSchema,
  options: z.array(usersFilterOptionSchema),
});

export type UsersFilterDefinition = z.infer<typeof usersFilterDefinitionSchema>;

/**
 * Normalized map representation for quick lookup by filter key.
 */
export const usersFiltersSchema = z.record(z.array(usersFilterOptionSchema));

export type UsersFilters = z.infer<typeof usersFiltersSchema>;

/**
 * Zod schema for the paginated customers list response used by the page,
 * including filter metadata when available.
 */
export const usersResponseSchema = z.object({
  data: z.array(userSchema),
  total: z.number(),
  filters: usersFiltersSchema.optional(),
  filterDefinitions: z.array(usersFilterDefinitionSchema).optional(),
});

/**
 * Customers list response type derived from `usersResponseSchema`.
 */
export type UsersResponse = z.infer<typeof usersResponseSchema>;

