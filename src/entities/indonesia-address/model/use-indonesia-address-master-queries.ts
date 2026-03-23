import { useQuery } from "@tanstack/react-query";

import {
  fetchIndonesiaCities,
  fetchIndonesiaDistricts,
  fetchIndonesiaProvinces,
  fetchIndonesiaSubDistricts,
} from "./indonesia-address-api";

const STALE_MS = 1000 * 60 * 60;

export interface UseIndonesiaAddressMasterQueriesOptions {
  enabled: boolean;
}

/**
 * Loads Indonesia address hierarchy datasets once (provinces → cities → districts → sub-districts).
 * Filtering by parent id is done client-side (generated clients expose list endpoints only).
 */
export function useIndonesiaAddressMasterQueries({ enabled }: UseIndonesiaAddressMasterQueriesOptions) {
  const provincesQuery = useQuery({
    queryKey: ["indonesia-address-master", "provinces"],
    enabled,
    staleTime: STALE_MS,
    queryFn: async ({ signal }) => {
      return fetchIndonesiaProvinces(signal);
    },
  });

  const citiesQuery = useQuery({
    queryKey: ["indonesia-address-master", "cities"],
    enabled,
    staleTime: STALE_MS,
    queryFn: async ({ signal }) => {
      return fetchIndonesiaCities(signal);
    },
  });

  const districtsQuery = useQuery({
    queryKey: ["indonesia-address-master", "districts"],
    enabled,
    staleTime: STALE_MS,
    queryFn: async ({ signal }) => {
      return fetchIndonesiaDistricts(signal);
    },
  });

  const subDistrictsQuery = useQuery({
    queryKey: ["indonesia-address-master", "sub-districts"],
    enabled,
    staleTime: STALE_MS,
    queryFn: async ({ signal }) => {
      return fetchIndonesiaSubDistricts(signal);
    },
  });

  const isLoading =
    provincesQuery.isLoading ||
    citiesQuery.isLoading ||
    districtsQuery.isLoading ||
    subDistrictsQuery.isLoading;

  return {
    provincesQuery,
    citiesQuery,
    districtsQuery,
    subDistrictsQuery,
    isLoading,
  };
}
