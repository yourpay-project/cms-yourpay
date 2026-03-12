import { useQuery } from '@tanstack/react-query';

import { apiClient, parseApiData, type ApiResponse } from '@/shared/api';
import { usersResponseSchema, type UsersResponse } from '../model/types';

/** Parameters for the users list query (pagination). */
interface UseUsersQueryParams {
  pageIndex: number;
  pageSize: number;
}

/**
 * TanStack Query hook for fetching a paginated list of users.
 * Uses `GET /users?page=&per_page=` via the shared API client.
 */
export function useUsersQuery({ pageIndex, pageSize }: UseUsersQueryParams) {
  const path = `/users?page=${pageIndex + 1}&per_page=${pageSize}`;

  return useQuery({
    queryKey: ['users', pageIndex, pageSize],
    queryFn: async ({ signal }): Promise<ApiResponse<unknown>> =>
      apiClient.get<unknown>(path, { signal }),
    select: (res): UsersResponse => parseApiData(usersResponseSchema, res),
  });
}

