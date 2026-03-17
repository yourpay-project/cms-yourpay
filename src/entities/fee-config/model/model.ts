import { z } from "zod";

/**
 * Zod schema for a single fee configuration row.
 *
 * Align this with the backend Fee Config DTO once the OpenAPI
 * specification and generated client are available.
 */
export const feeConfigSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  nominal: z.number().nonnegative(),
  service: z.string().min(1),
  currency: z.string().min(1),
  feeType: z.enum(["fixed", "percentage", "tiered"]),
  feeMode: z.enum(["exclusive", "inclusive"]),
  isActive: z.boolean(),
});

export type FeeConfig = z.infer<typeof feeConfigSchema>;

/**
 * Zod schema for a paginated fee configuration list response.
 */
export const feeConfigListResponseSchema = z.object({
  data: z.array(feeConfigSchema),
  total: z.number().int().nonnegative(),
});

export type FeeConfigListResponse = z.infer<typeof feeConfigListResponseSchema>;

