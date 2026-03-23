import { useSyncGlobalLoading } from "@/shared/lib";
import { useUsersQuery } from "@/entities/user";

export function useUserListQuery({
  pageIndex,
  pageSize,
  search,
  filters,
}: {
  pageIndex: number;
  pageSize: number;
  search?: string;
  filters?: Record<string, string>;
}) {
  const query = useUsersQuery({
    pageIndex,
    pageSize,
    search,
    filters,
  });

  useSyncGlobalLoading(query.isLoading);
  return query;
}

