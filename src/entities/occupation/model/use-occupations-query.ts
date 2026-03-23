import { useQuery } from "@tanstack/react-query";

import { fetchOccupations } from "./occupation-api";

const STALE_MS = 1000 * 60 * 30;

/**
 * TanStack Query for operator occupation options (`v1/occupations`).
 */
export function useOccupationsQuery(enabled = true) {
  return useQuery({
    queryKey: ["master-data", "occupations"],
    enabled,
    staleTime: STALE_MS,
    queryFn: async ({ signal }) => {
      return fetchOccupations(signal);
    },
  });
}
