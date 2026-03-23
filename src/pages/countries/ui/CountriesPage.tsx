import type { FC } from "react";

import { ApiClientError } from "@/shared/api";
import {
  PageSkeleton,
  SearchInput,
  Button,
} from "@/shared/ui";
import type { Country } from "@/entities/country";
import { CountriesTable } from "@/widgets/countries-table";
import { useModalStore } from "@/widgets/modal-manager";
import { useCountriesFilters, useCountryForm } from "../model";

const CountriesPage: FC = () => {
  const filters = useCountriesFilters();
  const openModal = useModalStore().open;
  const {
    remove,
  } = useCountryForm();

  if (filters.isLoading) {
    return <PageSkeleton />;
  }

  if (filters.isError) {
    const apiError = filters.error instanceof ApiClientError ? filters.error : null;
    const message =
      apiError?.status === 403
        ? "You do not have permission to view countries."
        : "Failed to load countries. Please try again.";
    return <p className="text-sm text-destructive">{message}</p>;
  }

  return (
    <div className="flex min-h-0 flex-col gap-4 overflow-y-auto">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">Countries</h2>
        <div className="flex items-center gap-3">
          <SearchInput
            placeholder="Search by name or code..."
            value={filters.search}
            onChange={(e) => {
              filters.setSearch(e.target.value);
              filters.resetPageIndex();
            }}
            containerClassName="w-full max-w-xs"
          />
          <Button
            size="sm"
            onClick={() => openModal("COUNTRIES_CREATE_EDIT_MODAL", { mode: "create" })}
          >
            Add country
          </Button>
        </div>
      </div>

      <div className="min-h-0 flex-none">
        <CountriesTable
          data={filters.countriesPage}
          total={filters.total}
          pageIndex={filters.pageIndex}
          pageSize={filters.pageSize}
          isRefetching={filters.isFetching && !filters.isLoading}
          onPageChange={(nextPageIndex, nextPageSize) => {
            filters.setPageIndex(nextPageIndex);
            filters.setPageSize(nextPageSize);
          }}
          onEdit={(country: Country) => {
            openModal("COUNTRIES_CREATE_EDIT_MODAL", { mode: "edit", row: country });
          }}
          onDelete={remove}
        />
      </div>
    </div>
  );
};

export default CountriesPage;

