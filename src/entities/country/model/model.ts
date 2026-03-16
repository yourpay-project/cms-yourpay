import { z } from "zod";

/**
 * Zod schema for a single country row in the Master Data countries list.
 *
 * Aligned with backend `CountryResponseDTO` returned from `GET v1/countries`.
 */
export const countrySchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  isActive: z.boolean(),
});

/**
 * Country entity as displayed in the countries table.
 */
export type Country = z.infer<typeof countrySchema>;

/**
 * Raw API response schema for `GET v1/countries`.
 *
 * Matches generated `ListCountryResponse` and `ListCountryResponseDTO`.
 */
export const apiCountriesListResponseSchema = z.object({
  data: z
    .object({
      list: z
        .array(
          z.object({
            code: z.string().optional(),
            name: z.string().optional(),
            is_active: z.boolean().optional(),
          }),
        )
        .optional(),
    })
    .optional(),
  request_id: z.string().optional(),
});

/**
 * Paginated-ish countries response used by the page.
 * Pagination is handled client-side over the full list.
 */
export const countriesResponseSchema = z.object({
  data: z.array(countrySchema),
  total: z.number().int(),
});

export type CountriesResponse = z.infer<typeof countriesResponseSchema>;

