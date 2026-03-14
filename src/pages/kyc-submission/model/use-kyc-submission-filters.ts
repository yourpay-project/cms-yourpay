import { useCallback, useMemo, useRef } from "react";
import { useDebouncedValue } from "@/shared/lib";
import { toCreatedAtFrom, toCreatedAtTo } from "../lib/date-api-format";
import { useKycSubmissionStore } from "./kyc-submission-store";
import { useKycSubmissionQuery } from "./use-kyc-submission-query";
import {
  KYC_STATUS_OPTIONS,
  KYC_DOCUMENT_TYPE_OPTIONS,
  KYC_COUNTRY_OPTIONS,
  REVERIFY_OPTIONS,
} from "./constants";

export interface FilterBadge {
  key: string;
  label: string;
  onClear: () => void;
}

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

  const statusSelectRef = useRef<HTMLSelectElement>(null);
  const documentTypeSelectRef = useRef<HTMLSelectElement>(null);
  const countrySelectRef = useRef<HTMLSelectElement>(null);
  const reverifySelectRef = useRef<HTMLSelectElement>(null);

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

  const pageTitleSuffix = useMemo(() => {
    if (kycPresetLabel) return ` [${kycPresetLabel}]`;
    if (kycFrom && kycTo) return ` [From: ${kycFrom}, To: ${kycTo}]`;
    if (kycFrom) return ` [From: ${kycFrom}]`;
    if (kycTo) return ` [To: ${kycTo}]`;
    return "";
  }, [kycPresetLabel, kycFrom, kycTo]);

  const handleResetFilters = useCallback(() => {
    resetFilters();
  }, [resetFilters]);

  const badges = useMemo((): FilterBadge[] => {
    const list: FilterBadge[] = [];
    if (status !== "all") {
      const label = KYC_STATUS_OPTIONS.find((o) => o.value === status)?.label ?? status;
      list.push({
        key: "status",
        label: `Status: ${label}`,
        onClear: () => {
          setStatus("all");
          setPageIndex(0);
        },
      });
    }
    if (documentType !== "all") {
      const label = KYC_DOCUMENT_TYPE_OPTIONS.find((o) => o.value === documentType)?.label ?? documentType;
      list.push({
        key: "documentType",
        label: `Document: ${label}`,
        onClear: () => {
          setDocumentType("all");
          setPageIndex(0);
        },
      });
    }
    if (country !== "all") {
      const label = KYC_COUNTRY_OPTIONS.find((o) => o.value === country)?.label ?? country;
      list.push({
        key: "country",
        label: `Country: ${label}`,
        onClear: () => {
          setCountry("all");
          setPageIndex(0);
        },
      });
    }
    if (reverifyStatus !== "all") {
      const label = REVERIFY_OPTIONS.find((o) => o.value === reverifyStatus)?.label ?? reverifyStatus;
      list.push({
        key: "reverify",
        label: `Reverify: ${label}`,
        onClear: () => {
          setReverifyStatus("all");
          setPageIndex(0);
        },
      });
    }
    if (kycFrom && kycTo) {
      const label = kycPresetLabel ?? `${kycFrom} – ${kycTo}`;
      list.push({
        key: "kyc",
        label: `KYC: ${label}`,
        onClear: () => {
          setKycFrom("");
          setKycTo("");
          setKycPresetLabel(null);
          setPageIndex(0);
        },
      });
    }
    if (lastUpdateFrom && lastUpdateTo) {
      const label = lastUpdatePresetLabel ?? `${lastUpdateFrom} – ${lastUpdateTo}`;
      list.push({
        key: "lastUpdate",
        label: `Last update: ${label}`,
        onClear: () => {
          setLastUpdateFrom("");
          setLastUpdateTo("");
          setLastUpdatePresetLabel(null);
          setPageIndex(0);
        },
      });
    }
    return list;
  }, [
    status,
    documentType,
    country,
    reverifyStatus,
    kycFrom,
    kycTo,
    kycPresetLabel,
    lastUpdateFrom,
    lastUpdateTo,
    lastUpdatePresetLabel,
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
    setPageIndex,
  ]);

  const resetPageIndex = useCallback(() => setPageIndex(0), [setPageIndex]);

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
    statusSelectRef,
    documentTypeSelectRef,
    countrySelectRef,
    reverifySelectRef,
    pageTitleSuffix,
    badges,
    handleResetFilters,
    resetPageIndex,
  };
}
