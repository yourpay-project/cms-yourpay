import type { FC } from "react";

import { ApiClientError } from "@/shared/api";
import {
  PageSkeleton,
  SearchInput,
  Button,
  Input,
} from "@/shared/ui";
import { Modal } from "@/shared/ui/modal";
import type { Country } from "@/entities/country";
import { CountriesTable } from "@/widgets/countries-table";
import { useCountriesFilters, useCountryForm } from "../model";

const CountriesPage: FC = () => {
  const filters = useCountriesFilters();
  const {
    editing,
    code,
    name,
    isActive,
    isDialogOpen,
    isSubmitting,
    errors,
    setCode,
    setName,
    setIsActive,
    openForCreate,
    openForEdit,
    closeDialog,
    submit,
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
          <Button size="sm" onClick={openForCreate}>
            Add country
          </Button>
          <Modal
            open={isDialogOpen}
            onCancel={closeDialog}
            onOk={submit}
            confirmLoading={isSubmitting}
            title={editing ? "Edit Country" : "Create Country (API)"}
            description={
              editing
                ? "Update country code, name, or status."
                : "Create a new country record for operator APIs."
            }
            centered
          >
            <div className="mt-4 flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <Input
                    label="Country Code"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    disabled={!!editing}
                    status={errors.code ? "error" : undefined}
                    helperText={
                      errors.code ??
                      "Letters and numbers allowed (will be converted to uppercase)"
                    }
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Input
                    label="Country Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    status={errors.name ? "error" : undefined}
                    helperText={errors.name}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-medium text-muted-foreground">Status</span>
                  <div className="inline-flex gap-2 rounded-md bg-muted/40 p-1 text-xs">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      aria-pressed={isActive}
                      className={`h-7 px-3 text-xs rounded ${
                        isActive ? "bg-success text-success-foreground" : "bg-transparent"
                      }`}
                      onClick={() => setIsActive(true)}
                    >
                      Active
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      aria-pressed={!isActive}
                      className={`h-7 px-3 text-xs rounded ${
                        !isActive ? "bg-destructive text-destructive-foreground" : "bg-transparent"
                      }`}
                      onClick={() => setIsActive(false)}
                    >
                      Inactive
                    </Button>
                  </div>
                </div>
              </div>
          </Modal>
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
          onEdit={openForEdit as (country: Country) => void}
          onDelete={remove}
        />
      </div>
    </div>
  );
};

export default CountriesPage;

