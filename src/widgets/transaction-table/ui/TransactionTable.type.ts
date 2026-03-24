import type { Transaction } from "@/entities/transaction";

export interface TransactionTableProps {
  data: Transaction[];
  total: number;
  pageIndex: number;
  pageSize: number;
  isRefetching: boolean;
  onPageChange: (nextPageIndex: number, nextPageSize: number) => void;
}
