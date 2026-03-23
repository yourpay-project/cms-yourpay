import type { FeeConfig } from "@/entities/fee-config";

/**
 * Props for {@link FeeConfigTable}.
 */
export interface FeeConfigTableProps {
  data: FeeConfig[];
  total: number;
  pageIndex: number;
  pageSize: number;
  isRefetching: boolean;
  onPageChange: (pageIndex: number, pageSize: number) => void;
  onEdit: (row: FeeConfig) => void;
  onDelete: (row: FeeConfig) => void;
}

