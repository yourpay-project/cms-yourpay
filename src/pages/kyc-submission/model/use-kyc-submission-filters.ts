import { useCallback } from "react";
import { useDebouncedValue } from "@/shared/lib";
import { toCreatedAtFrom, toCreatedAtTo } from "../lib/date-api-format";
import { useKycSubmissionStore } from "./kyc-submission-store";
import { useKycSubmissionQuery } from "./use-kyc-submission-query";
import { buildKycSubmissionBadges } from "./kyc-submission-filters-badges";
import type { FilterBadge } from "./kyc-submission-filters-badges.type";

/**
 * Encapsulates filter state, query, and derived values for the KYC submission list page.
 * State is persisted via {@link useKycSubmissionStore} (localStorage key: cms-kyc-submission).
 */
export function useKycSubmissionFilters() {
  const store = useKycSubmissionStore();

  const {
    pageIndex,
    pageSize,
    status,
    documentType,
    country,
    reverifyStatus,
    kycFrom,
    kycTo,
    lastUpdateFrom,
    lastUpdateTo,
    kycPresetLabel,
    lastUpdatePresetLabel,
    searchInput,
    filtersOpen,
    setPageIndex,
    setPageSize,
    setStatus,
    setDocumentType,
    setCountry,
    setReverifyStatus,
    setKycFrom,
    setKycTo,
    setLastUpdateFrom,
    setLastUpdateTo,
    setKycPresetLabel,
    setLastUpdatePresetLabel,
    setSearchInput,
    setFiltersOpen,
    resetFilters,
  } = store;

  const debouncedSearch = useDebouncedValue(searchInput, 400);

  const query = useKycSubmissionQuery({
    pageIndex,
    pageSize,
    keyword: debouncedSearch,
    status: status !== "all" ? status : undefined,
    country: country !== "all" ? country : undefined,
    documentType: documentType !== "all" ? documentType : undefined,
    createdAtFrom: kycFrom ? toCreatedAtFrom(kycFrom) : undefined,
    createdAtTo: kycTo ? toCreatedAtTo(kycTo) : undefined,
    updatedAtFrom: lastUpdateFrom ? toCreatedAtFrom(lastUpdateFrom) : undefined,
    updatedAtTo: lastUpdateTo ? toCreatedAtTo(lastUpdateTo) : undefined,
    isReverification: reverifyStatus !== "all" ? reverifyStatus : undefined,
  });

  const pageTitleSuffix =
    kycPresetLabel
      ? ` [${kycPresetLabel}]`
      : kycFrom && kycTo
        ? ` [From: ${kycFrom}, To: ${kycTo}]`
        : kycFrom
          ? ` [From: ${kycFrom}]`
          : kycTo
            ? ` [To: ${kycTo}]`
            : "";

  const handleResetFilters = useCallback(() => {
    resetFilters();
  }, [resetFilters]);

  const resetPageIndex = useCallback(() => setPageIndex(0), [setPageIndex]);

  const badges: FilterBadge[] = buildKycSubmissionBadges({
    status,
    setStatus,
    documentType,
    setDocumentType,
    country,
    setCountry,
    reverifyStatus,
    setReverifyStatus,
    kycFromTo: { kycFrom, kycTo },
    setKycFrom,
    setKycTo,
    kycPresetLabel,
    setKycPresetLabel,
    lastUpdateFromTo: { lastUpdateFrom, lastUpdateTo },
    setLastUpdateFrom,
    setLastUpdateTo,
    lastUpdatePresetLabel,
    setLastUpdatePresetLabel,
    resetPageIndex,
  });

  return {
    ...query,
    submissions: query.data?.data ?? [],
    total: query.data?.total ?? 0,
    pageIndex,
    pageSize,
    setPageIndex,
    setPageSize,
    status,
    setStatus,
    documentType,
    setDocumentType,
    country,
    setCountry,
    reverifyStatus,
    setReverifyStatus,
    kycFrom,
    setKycFrom,
    kycTo,
    setKycTo,
    kycPresetLabel,
    setKycPresetLabel,
    lastUpdateFrom,
    setLastUpdateFrom,
    lastUpdateTo,
    setLastUpdateTo,
    lastUpdatePresetLabel,
    setLastUpdatePresetLabel,
    searchInput,
    setSearchInput,
    filtersOpen,
    setFiltersOpen,
    pageTitleSuffix,
    badges,
    handleResetFilters,
    resetPageIndex,
  };
}
