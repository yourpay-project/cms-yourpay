import { useQuery } from "@tanstack/react-query";

import type { ApiResponse } from "@/shared/api";
import { getV1OperatorsCountries } from "@/shared/api/generated";

import {
  apiCountriesListResponseSchema,
  countriesResponseSchema,
  type CountriesResponse,
  type Country,
} from "../model";

/**
 * TanStack Query hook for the Operator countries list.
 *
 * Uses `GET v1/operators/countries` and maps the backend list into Country[]
 * for consumption by page-level hooks and widgets.
 */
export function useCountriesQuery() {
  return useQuery<ApiResponse<unknown>, Error, CountriesResponse>({
    queryKey: ["operator-countries"],
    queryFn: async ({ signal }) => getV1OperatorsCountries({ signal }),
    placeholderData: (previousData) => previousData,
    select: (res) => {
      const validated = apiCountriesListResponseSchema.parse(res.data);
      const list =
        validated.data?.list ??
        [];

      const data: Country[] = list
        .map((item: { code?: string; name?: string; is_active?: boolean }) => ({
          code: item.code ?? "",
          name: item.name ?? "",
          isActive: item.is_active ?? false,
        }))
        .filter((item: Country) => Boolean(item.code && item.name));

      return countriesResponseSchema.parse({
        data,
        total: data.length,
      });
    },
  });
}

