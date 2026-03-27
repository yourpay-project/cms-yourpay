import type { FC } from "react";
import { ApiClientError } from "@/shared/api";
import { FilterControlButtons } from "@/shared/ui";
import { TransactionTable } from "@/widgets/transaction-table";
import { useTransactionsFilters } from "..";
import { TransactionsFiltersCard } from "./TransactionsFiltersCard";
import { TransactionsSearchBar } from "./TransactionsSearchBar";

const TransactionsPage: FC = () => {
  const filters = useTransactionsFilters();

  if (filters.isError) {
    const apiError = filters.error instanceof ApiClientError ? filters.error : null;
    const message =
      apiError?.status === 403
        ? "You do not have permission to view transactions."
        : "Failed to load transactions. Please try again.";
    return <p className="text-sm text-destructive">{message}</p>;
  }

  const isTableLoading = filters.isLoading || filters.isFetching;

  return (
    <div className="flex min-h-0 flex-col gap-4 overflow-y-auto">
      <div>
        <h2 className="text-xl font-semibold">Transactions</h2>
      </div>

      {!filters.isLoading && filters.hasBackendFilters ? (
        <TransactionsFiltersCard
          filtersOpen={filters.filtersOpen}
          setFiltersOpen={filters.setFiltersOpen}
          badges={filters.badges}
          handleResetFilters={filters.handleResetFilters}
          gridProps={{
            optionsFilterFields: filters.optionsFilterFields,
            selectedFilterValues: filters.selectedFilterValues,
            handleChangeFilter: filters.handleChangeFilter,
            dateRangeDefinitions: filters.dateRangeDefinitions,
            dateRanges: filters.dateRanges,
            setDateRange: filters.setDateRange,
          }}
        />
      ) : null}

      {!filters.isLoading ? (
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
            <TransactionsSearchBar
              value={filters.searchInput}
              onChange={filters.setSearchInput}
              onSearchChangeResetPage={filters.resetPageIndex}
            />
          </div>
        </div>
      ) : null}

      <div className="min-h-0 flex-none">
        <TransactionTable
          data={filters.transactions}
          total={filters.total}
          pageIndex={filters.pageIndex}
          pageSize={filters.pageSize}
          isRefetching={isTableLoading}
          onPageChange={(nextPageIndex, nextPageSize) => {
            filters.setPageIndex(nextPageIndex);
            filters.setPageSize(nextPageSize);
          }}
        />
      </div>
    </div>
  );
};

export default TransactionsPage;
