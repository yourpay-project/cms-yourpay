import type { FC } from "react";
import { useNavigate } from "@tanstack/react-router";
import { DataTable, ErrorBoundary, TABLE_BODY_VIEWPORT_HEIGHT } from "@/shared/ui";
import type { Transaction } from "@/entities/transaction";
import type { TransactionTableProps } from "./TransactionTable.type";
import { getTransactionTableColumns } from "./TransactionTableColumns";

const COLUMNS = getTransactionTableColumns();

export const TransactionTable: FC<TransactionTableProps> = ({
  data,
  total,
  pageIndex,
  pageSize,
  isRefetching,
  onPageChange,
}) => {
  const navigate = useNavigate();
  const pageCount = total === 0 ? 1 : Math.ceil(total / pageSize);

  return (
    <ErrorBoundary>
      <div className="relative flex flex-col">
        <DataTable<Transaction>
          columns={COLUMNS}
          data={data}
          getRowId={(row, index) => row.id || `trx-${index}`}
          scroll={{ y: TABLE_BODY_VIEWPORT_HEIGHT }}
          enableVerticalShadow
          isLoading={isRefetching}
          loading={{ loadingVariant: "spinner" }}
          initialColumnPinning={{ left: ["id"], right: ["status"] }}
          onRow={(row) => ({
            className: row.original.id ? "cursor-pointer" : undefined,
            onClick: () => {
              if (!row.original.id) return;
              void navigate({
                to: "/transactions/$id",
                params: { id: row.original.id },
              });
            },
          })}
          pagination={{ pageIndex, pageSize }}
          pageCount={pageCount}
          onPaginationChange={(pagination) => onPageChange(pagination.pageIndex, pagination.pageSize)}
          empty={{ emptyMessage: "No transactions found." }}
          showPagination
          bordered
        />
      </div>
    </ErrorBoundary>
  );
};
