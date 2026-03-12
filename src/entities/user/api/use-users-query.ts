import { useApiQuery } from '@/shared/api';
import type { User } from '../model/types';

/** API response shape for paginated users list. */
interface UsersResponse {
  data: User[];
  total: number;
}

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
  return useApiQuery<UsersResponse>(
    ['users', pageIndex, pageSize],
    `/users?page=${pageIndex + 1}&per_page=${pageSize}`,
  );
}

