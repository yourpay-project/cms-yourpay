import type { FC } from "react";

import { ApiClientError } from "@/shared/api";
import { Button, PageSkeleton, SearchInput } from "@/shared/ui";
import { FeeConfigTable } from "@/widgets/fee-config-table";
import { useModalStore } from "@/widgets/modal-manager";
import { useFeeConfigFilters } from "..";
import { FeeConfigFiltersCard } from "./FeeConfigFiltersCard";
import { cn } from "@/shared/lib";
import { FeeConfigCurrencyButtons } from "./FeeConfigCurrencyButtons";
import { useFeeConfigPageLogic } from "../model/use-fee-config-page-logic";

const FeeConfigPage: FC = () => {
  const filters = useFeeConfigFilters();
  const logic = useFeeConfigPageLogic(filters);
  const { open } = useModalStore();
  const { filtersOpen, setFiltersOpen, serviceOptions } = logic;

  if (filters.isLoading) {
    return <PageSkeleton />;
  }

  if (filters.isError) {
    const apiError = filters.error instanceof ApiClientError ? filters.error : null;
    const message =
      apiError?.status === 403
        ? "You do not have permission to view fee configurations."
        : "Failed to load fee configurations. Please try again.";
    return <p className="text-sm text-destructive">{message}</p>;
  }

  const { canCreateFeeConfig } = logic;

  return (
    <div className="flex min-h-0 flex-col gap-4 overflow-y-auto">
      <div>
        <h2 className="text-xl font-semibold">Fee Config</h2>
      </div>

      <FeeConfigFiltersCard
        filtersOpen={filtersOpen}
        setFiltersOpen={setFiltersOpen}
        status={filters.status}
        setStatus={filters.setStatus}
        feeType={filters.feeType}
        setFeeType={filters.setFeeType}
        service={filters.service}
        setService={filters.setService}
        serviceOptions={serviceOptions}
        badges={filters.badges}
        handleResetFilters={filters.handleResetFilters}
      />

      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex w-full flex-wrap items-center justify-center gap-1 md:w-auto md:justify-start">
          <FeeConfigCurrencyButtons
            currency={filters.currency}
            onSelectCurrency={filters.setCurrency}
            resetPageIndex={filters.resetPageIndex}
          />
        </div>
        <div
          className={cn(
            "flex w-full items-center gap-3 justify-between md:w-auto md:justify-end",
            !canCreateFeeConfig && "justify-end",
          )}
        >
          <SearchInput
            placeholder="Search by name, service, currency..."
            value={filters.search}
            onChange={(e) => {
              filters.setSearch(e.target.value);
              filters.resetPageIndex();
            }}
            containerClassName="w-full max-w-xs"
          />
          {canCreateFeeConfig && (
            <Button
              size="sm"
              type="button"
              onClick={() => {
                open("FEE_CONFIG_CREATE_EDIT_MODAL", {
                  mode: "create",
                  onSubmitted: () => {
                    filters.refetch();
                  },
                });
              }}
            >
              New Fee Config
            </Button>
          )}
        </div>
      </div>

      <div className="min-h-0 flex-none">
        <FeeConfigTable
          data={filters.items}
          total={filters.total}
          pageIndex={filters.pageIndex}
          pageSize={filters.pageSize}
          isRefetching={filters.isFetching && !filters.isLoading}
          onPageChange={(nextPageIndex, nextPageSize) => {
            filters.setPageIndex(nextPageIndex);
            filters.setPageSize(nextPageSize);
          }}
          onEdit={(row) => {
            open("FEE_CONFIG_CREATE_EDIT_MODAL", {
              mode: "edit",
              row,
              onSubmitted: () => {
                filters.refetch();
              },
            });
          }}
          onDelete={logic.handleDelete}
        />
      </div>
    </div>
  );
};

export default FeeConfigPage;

