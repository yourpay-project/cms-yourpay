import type { User } from "@/entities/user";

/**
 * Props for {@link UserTable}.
 */
export interface UserTableProps {
  data: User[];
  total: number;
  pageIndex: number;
  pageSize: number;
  isRefetching: boolean;
  onPageChange: (pageIndex: number, pageSize: number) => void;
}

