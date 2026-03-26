import type { FC } from "react";
import { ApiClientError } from "@/shared/api";
import { PageSkeleton } from "@/shared/ui";
import { KycSubmissionTable } from "@/widgets/kyc-submission-table";
import { useKycSubmissionFilters } from "..";
import { KycSubmissionFiltersCard } from "./KycSubmissionFiltersCard";
import { KycSubmissionSearchBar } from "./KycSubmissionSearchBar";

/**
 * KYC Submissions page. Renders filters card (status, document type, country, reverify, date ranges), search, and KycSubmissionTable. Uses {@link useKycSubmissionFilters} for state and server-side pagination. Filter state is persisted in localStorage (cms-kyc-submission).
 */
const KycSubmissionPage: FC = () => {
  const filters = useKycSubmissionFilters();

  if (filters.isLoading) {
    return <PageSkeleton />;
  }

  if (filters.isError) {
    const apiError = filters.error instanceof ApiClientError ? filters.error : null;
    let message = "Failed to load KYC submissions. Please try again.";
    if (apiError?.status === 403) {
      message = "You do not have permission to view KYC submissions.";
    }
    return <p className="text-sm text-destructive">{message}</p>;
  }

  let filtersCardNode: React.ReactNode = null;
  if (filters.hasBackendFilters) {
    filtersCardNode = (
      <KycSubmissionFiltersCard
        filtersOpen={filters.filtersOpen}
        setFiltersOpen={filters.setFiltersOpen}
        badges={filters.badges}
        handleResetFilters={filters.handleResetFilters}
        optionsFilterFields={filters.optionsFilterFields}
        selectedOptionFilterValues={filters.selectedOptionFilterValues}
        handleChangeOptionFilter={filters.handleChangeOptionFilter}
        createdAtLabel={filters.createdAtLabel}
        updatedAtLabel={filters.updatedAtLabel}
        kycFrom={filters.kycFrom}
        kycTo={filters.kycTo}
        kycPresetLabel={filters.kycPresetLabel}
        setKycFrom={filters.setKycFrom}
        setKycTo={filters.setKycTo}
        setKycPresetLabel={filters.setKycPresetLabel}
        lastUpdateFrom={filters.lastUpdateFrom}
        lastUpdateTo={filters.lastUpdateTo}
        lastUpdatePresetLabel={filters.lastUpdatePresetLabel}
        setLastUpdateFrom={filters.setLastUpdateFrom}
        setLastUpdateTo={filters.setLastUpdateTo}
        setLastUpdatePresetLabel={filters.setLastUpdatePresetLabel}
        resetPageIndex={filters.resetPageIndex}
      />
    );
  }

  return (
    <div className="flex min-h-0 flex-col gap-4 overflow-y-auto">
      <div>
        <h2 className="text-xl font-semibold">KYC Submissions{filters.pageTitleSuffix}</h2>
      </div>

      {filtersCardNode}

      <div className="flex flex-wrap items-end justify-end gap-3">
        <KycSubmissionSearchBar
          value={filters.searchInput}
          onChange={filters.setSearchInput}
          onSearchChangeResetPage={filters.resetPageIndex}
        />
      </div>

      <div className="min-h-0 flex-none">
        <KycSubmissionTable
          data={filters.submissions}
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

export default KycSubmissionPage;
