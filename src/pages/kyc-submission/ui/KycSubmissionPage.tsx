import type { FC } from "react";
import { ApiClientError } from "@/shared/api";
import { PageSkeleton } from "@/shared/ui";
import { KycSubmissionTable } from "@/widgets/kyc-submission-table";
import { useKycSubmissionFilters, KYC_COUNTRY_OPTIONS } from "..";
import { KycSubmissionFiltersCard } from "./KycSubmissionFiltersCard";
import { KycSubmissionSearchBar } from "./KycSubmissionSearchBar";

/**
 * KYC Submissions page. Renders filters card (status, document type, reverify, date ranges), country dropdown, search, and KycSubmissionTable. Uses {@link useKycSubmissionFilters} for state and server-side pagination.
 */
const KycSubmissionPage: FC = () => {
  const filters = useKycSubmissionFilters();

  if (filters.isLoading) {
    return <PageSkeleton />;
  }

  if (filters.isError) {
    const apiError = filters.error instanceof ApiClientError ? filters.error : null;
    const message =
      apiError?.status === 403
        ? "You do not have permission to view KYC submissions."
        : "Failed to load KYC submissions. Please try again.";
    return <p className="text-sm text-destructive">{message}</p>;
  }

  return (
    <div className="flex min-h-0 flex-col gap-4 overflow-y-auto">
      <div>
        <h2 className="text-xl font-semibold">KYC Submissions{filters.pageTitleSuffix}</h2>
      </div>

      <KycSubmissionFiltersCard
        filtersOpen={filters.filtersOpen}
        setFiltersOpen={filters.setFiltersOpen}
        badges={filters.badges}
        handleResetFilters={filters.handleResetFilters}
        status={filters.status}
        setStatus={filters.setStatus}
        statusSelectRef={filters.statusSelectRef}
        documentType={filters.documentType}
        setDocumentType={filters.setDocumentType}
        documentTypeSelectRef={filters.documentTypeSelectRef}
        reverifyStatus={filters.reverifyStatus}
        setReverifyStatus={filters.setReverifyStatus}
        reverifySelectRef={filters.reverifySelectRef}
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

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex shrink-0 items-center gap-2">
          <label className="text-xs font-medium text-muted-foreground">Country</label>
          <select
            className="h-10 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            value={filters.country}
            onChange={(e) => {
              filters.setCountry(e.target.value);
              filters.resetPageIndex();
            }}
          >
            {KYC_COUNTRY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
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
