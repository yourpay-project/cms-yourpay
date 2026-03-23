import { z } from "zod";

/**
 * Zod schema for `GET /v1/occupations` (`ListOccupationResponse`).
 */
export const occupationItemSchema = z.object({
  id: z.string(),
  label_english: z.string(),
  label_indonesia: z.string(),
  name: z.string(),
});

export const listOccupationResponseSchema = z.object({
  data: z.object({
    list: z.array(occupationItemSchema).optional(),
  }),
  request_id: z.string().optional(),
});

export type OccupationItem = z.infer<typeof occupationItemSchema>;
