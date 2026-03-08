import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { apiClient, type ApiResponse } from "./api-client";

type QueryKey = readonly unknown[];

/**
 * Reusable API query hook. Uses TanStack Query; auto refetch on window focus per default.
 * Returns data as T (unwrapped from ApiResponse). Use isLoading / isPending for loading state.
 */
export function useApiQuery<T>(
  queryKey: QueryKey,
  path: string,
  options?: Omit<UseQueryOptions<ApiResponse<T>, Error, T, QueryKey>, "queryKey" | "queryFn" | "select">
) {
  return useQuery({
    queryKey,
    queryFn: async () => apiClient.get<T>(path),
    select: (res) => res.data,
    ...options,
  });
}
