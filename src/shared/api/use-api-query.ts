import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { apiClient, type ApiResponse } from "./api-client";

type QueryKey = readonly unknown[];

/**
 * Thin wrapper around TanStack Query for calling the shared `apiClient`.
 *
 * - Uses the provided `queryKey` for caching/invalidation.
 * - Calls `apiClient.get(path)` under the hood and unwraps the `data` field.
 * - Accepts any standard TanStack options except `queryKey`, `queryFn`, and `select`
 *   which are managed internally.
 */
export function useApiQuery<T>(
  queryKey: QueryKey,
  path: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<T>, Error, T, QueryKey>,
    "queryKey" | "queryFn" | "select"
  >
) {
  return useQuery({
    queryKey,
    queryFn: async () => apiClient.get<T>(path),
    select: (res) => res.data,
    ...options,
  });
}

