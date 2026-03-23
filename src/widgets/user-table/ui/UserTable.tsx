import type { FC } from "react";
import { DataTable, ErrorBoundary, TABLE_BODY_VIEWPORT_HEIGHT } from "@/shared/ui";
import type { User } from "@/entities/user";

import type { UserTableProps } from "./UserTable.type";
import { getUserTableColumns } from "./UserTableColumns";

const COLUMNS = getUserTableColumns();

/** Table widget for the customers page; uses shared DataTable with name frozen left, actions frozen right. */
export const UserTable: FC<UserTableProps> = ({
  data,
  total,
  pageIndex,
  pageSize,
  isRefetching,
  onPageChange,
}) => {

  const pageCount = total === 0 ? 1 : Math.ceil(total / pageSize);

  return (
    <ErrorBoundary>
      <div className="relative flex flex-col">
        <DataTable<User>
          columns={COLUMNS}
          data={data}
          getRowId={(row, index) => `${row.id || "row"}-${index}`}
          scroll={{ y: TABLE_BODY_VIEWPORT_HEIGHT }}
          enableVerticalShadow
          isLoading={isRefetching}
          loading={{ loadingVariant: "spinner" }}
          initialColumnPinning={{ left: ["name"], right: ["actions"] }}
          pagination={{ pageIndex, pageSize }}
          pageCount={pageCount}
          onPaginationChange={(pagination) =>
            onPageChange(pagination.pageIndex, pagination.pageSize)
          }
          empty={{ emptyMessage: "No customers found." }}
          showPagination
          bordered
        />
      </div>
    </ErrorBoundary>
  );
};
