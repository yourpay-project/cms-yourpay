import type { FC } from "react";
import { ApiClientError } from "@/shared/api";
import { Button, PageSkeleton } from "@/shared/ui";
import { UserTable } from "@/widgets/user-table";
import { useUserListFilters, USER_COUNTRY_OPTIONS } from "..";
import { UserListFiltersCard } from "./UserListFiltersCard";
import { UserListSearchBar } from "./UserListSearchBar";

/**
 * User Yourpay (customers) page at `/customers`. Renders filters card, country buttons, search, and UserTable.
 * Uses {@link useUserListFilters} for state and server-side pagination.
 */
const UserListPage: FC = () => {
  const filters = useUserListFilters();

  if (filters.isLoading) {
    return <PageSkeleton />;
  }

  if (filters.isError) {
    const apiError = filters.error instanceof ApiClientError ? filters.error : null;
    const message =
      apiError?.status === 403
        ? "You do not have permission to view YourPay customers. Please check your CMS role/permissions."
        : "Failed to load customers. Please try again.";
    return <p className="text-sm text-destructive">{message}</p>;
  }

  return (
    <div className="flex min-h-0 flex-col gap-4 overflow-y-auto">
      <div>
        <h2 className="text-xl font-semibold">User Yourpay</h2>
      </div>

      <UserListFiltersCard
        filtersOpen={filters.filtersOpen}
        setFiltersOpen={filters.setFiltersOpen}
        badges={filters.badges}
        handleResetFilters={filters.handleResetFilters}
        status={filters.status}
        setStatus={filters.setStatus}
        statusSelectRef={filters.statusSelectRef}
        gender={filters.gender}
        setGender={filters.setGender}
        genderSelectRef={filters.genderSelectRef}
        resetPageIndex={filters.resetPageIndex}
      />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex shrink-0 flex-wrap items-center gap-1">
          {USER_COUNTRY_OPTIONS.map((o) => (
            <Button
              key={o.value}
              type="button"
              size="sm"
              variant={filters.country === o.value ? "default" : "outline"}
              onClick={() => {
                filters.setCountry(o.value);
                filters.resetPageIndex();
              }}
            >
              {o.label}
            </Button>
          ))}
        </div>
        <UserListSearchBar
          value={filters.searchInput}
          onChange={filters.setSearchInput}
          onSearchChangeResetPage={filters.resetPageIndex}
        />
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
