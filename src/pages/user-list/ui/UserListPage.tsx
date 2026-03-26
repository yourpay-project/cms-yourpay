import type { FC } from "react";
import { ApiClientError } from "@/shared/api";
import { FilterControlButtons, PageSkeleton } from "@/shared/ui";
import { UserTable } from "@/widgets/user-table";
import { useUserListFilters } from "..";
import { UserListFiltersCard } from "./UserListFiltersCard";
import { UserListSearchBar } from "./UserListSearchBar";

/**
 * User Yourpay (customers) page at `/customers`.
 * Renders dynamic backend-driven filters, search, and paginated user table.
 */
const UserListPage: FC = () => {
  const filters = useUserListFilters();

  if (filters.isLoading) {
    return <PageSkeleton />;
  }

  if (filters.isError) {
    const apiError = filters.error instanceof ApiClientError ? filters.error : null;
    let message = "Failed to load customers. Please try again.";
    if (apiError?.status === 403) {
      message = "You do not have permission to view YourPay customers. Please check your CMS role/permissions.";
    }
    return <p className="text-sm text-destructive">{message}</p>;
  }

  let filtersCardNode: React.ReactNode = null;
  if (filters.hasBackendFilters) {
    filtersCardNode = (
      <UserListFiltersCard
        filtersOpen={filters.filtersOpen}
        setFiltersOpen={filters.setFiltersOpen}
        badges={filters.badges}
        handleResetFilters={filters.handleResetFilters}
        optionFilterFields={filters.optionsFilterFields}
        selectedFilterValues={filters.selectedFilterValues}
        onChangeFilter={filters.handleChangeFilter}
      />
    );
  }

  return (
    <div className="flex min-h-0 flex-col gap-4 overflow-y-auto">
      <div>
        <h2 className="text-xl font-semibold">User Yourpay</h2>
      </div>

      {filtersCardNode}

      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex w-full justify-center md:w-auto md:justify-start">
          <FilterControlButtons
            fields={filters.controlFilterFields}
            values={filters.selectedFilterValues}
            onChange={filters.handleChangeFilter}
            uppercaseLabels
          />
        </div>
        <div className="flex w-full justify-end md:w-auto">
          <UserListSearchBar
            value={filters.searchInput}
            onChange={filters.setSearchInput}
            onSearchChangeResetPage={filters.resetPageIndex}
          />
        </div>
      </div>

      <div className="min-h-0 flex-none">
        <UserTable
          data={filters.users}
          total={filters.total}
          pageIndex={filters.pageIndex}
          pageSize={filters.pageSize}
          isRefetching={filters.isFetching && !filters.isLoading}
          onPageChange={(nextPageIndex, nextPageSize) => {
            filters.setPageIndex(nextPageIndex);
            filters.setPageSize(nextPageSize);
          }}
        />
      </div>
    </div>
  );
};

export default UserListPage;
