import { z } from "zod";

/**
 * Zod schemas for Indonesia address master-data API responses (`v1/provinces`, `v1/cities`, etc.).
 */
export const indonesiaProvinceItemSchema = z.object({
  id: z.number(),
  label: z.string(),
});

export const indonesiaCityItemSchema = z.object({
  id: z.number(),
  label: z.string(),
  province_id: z.number(),
});

export const indonesiaDistrictItemSchema = z.object({
  id: z.number(),
  label: z.string(),
  city_id: z.number(),
});

export const indonesiaSubDistrictItemSchema = z.object({
  id: z.number(),
  label: z.string(),
  district_id: z.number(),
});

export const indonesiaProvinceResponseSchema = z.object({
  data: z.array(indonesiaProvinceItemSchema),
  request_id: z.string().optional(),
});

export const indonesiaCityResponseSchema = z.object({
  data: z.array(indonesiaCityItemSchema),
  request_id: z.string().optional(),
});

export const indonesiaDistrictResponseSchema = z.object({
  data: z.array(indonesiaDistrictItemSchema),
  request_id: z.string().optional(),
});

export const indonesiaSubDistrictResponseSchema = z.object({
  data: z.array(indonesiaSubDistrictItemSchema),
  request_id: z.string().optional(),
});

export type IndonesiaProvinceItem = z.infer<typeof indonesiaProvinceItemSchema>;
export type IndonesiaCityItem = z.infer<typeof indonesiaCityItemSchema>;
export type IndonesiaDistrictItem = z.infer<typeof indonesiaDistrictItemSchema>;
export type IndonesiaSubDistrictItem = z.infer<typeof indonesiaSubDistrictItemSchema>;
