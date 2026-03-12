import { useState } from 'react';

import { PageSkeleton } from '@/shared/ui';
import { UserTable } from '@/widgets/user-table';
import { useUserListQuery } from '../model/use-user-list-query';

const DEFAULT_PAGE_SIZE = 10;

/** Page at `/customers`: lists users with paginated DataTable and TanStack Query. */
const UserListPage = () => {
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);

  const { data, isLoading, isError } = useUserListQuery({
    pageIndex,
    pageSize,
  });

  if (isLoading) {
    return <PageSkeleton />;
  }

  if (isError) {
    return (
      <p className="text-sm text-destructive">
        Failed to load users. Please try again.
      </p>
    );
  }

  const users = data?.data ?? [];
  const total = data?.total ?? 0;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Users</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Example page using the shared DataTable widget with TanStack Query.
        </p>
      </div>

      <UserTable
        data={users}
        total={total}
        pageIndex={pageIndex}
        pageSize={pageSize}
        onPageChange={(nextPageIndex: number, nextPageSize: number) => {
          setPageIndex(nextPageIndex);
          setPageSize(nextPageSize);
        }}
      />
    </div>
  );
};

export default UserListPage;

