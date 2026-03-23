import type { FC } from "react";
import { useMemo } from "react";

import { DataTable, ErrorBoundary, TABLE_BODY_VIEWPORT_HEIGHT } from "@/shared/ui";
import type { FeeConfig } from "@/entities/fee-config";

import type { FeeConfigTableProps } from "./FeeConfigTable.type";
import { getFeeConfigTableColumns } from "./FeeConfigTableColumns";

export const FeeConfigTable: FC<FeeConfigTableProps> = ({
  data,
  total,
  pageIndex,
  pageSize,
  isRefetching,
  onPageChange,
  onEdit,
  onDelete,
}) => {
  const columns = useMemo(
    () => getFeeConfigTableColumns({ onEdit, onDelete }),
    [onEdit, onDelete],
  );

  const pageCount = total === 0 ? 1 : Math.ceil(total / pageSize);

  return (
    <ErrorBoundary>
      <div className="relative flex flex-col">
        <DataTable<FeeConfig>
          columns={columns}
          data={data}
          getRowId={(row) => row.id}
          scroll={{ y: TABLE_BODY_VIEWPORT_HEIGHT }}
          enableVerticalShadow
          isLoading={isRefetching}
          loading={{ loadingVariant: "spinner" }}
          initialColumnPinning={{ left: ["service"], right: ["actions"] }}
          pagination={{ pageIndex, pageSize }}
          pageCount={pageCount}
          onPaginationChange={(pagination) =>
            onPageChange(pagination.pageIndex, pagination.pageSize)
          }
          empty={{ emptyMessage: "No fee configurations found." }}
          showPagination
          bordered
        />
      </div>
    </ErrorBoundary>
  );
};

