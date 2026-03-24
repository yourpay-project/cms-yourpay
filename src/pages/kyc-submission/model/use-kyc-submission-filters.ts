import { useCallback, useMemo } from "react";
import { useDebouncedValue } from "@/shared/lib";
import type { FilterField } from "@/shared/ui";
import { toCreatedAtFrom, toCreatedAtTo } from "../lib/date-api-format";
import { useKycSubmissionStore } from "./kyc-submission-store";
import { useKycSubmissionQuery } from "./use-kyc-submission-query";
import { buildKycSubmissionBadges } from "./kyc-submission-filters-badges";
import type { FilterBadge } from "./kyc-submission-filters-badges.type";
import {
  KYC_COUNTRY_OPTIONS,
  KYC_DOCUMENT_TYPE_OPTIONS,
  KYC_STATUS_OPTIONS,
  REVERIFY_OPTIONS,
} from "./constants";

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
    status: status && status !== "all" ? status : undefined,
    country: country && country !== "all" ? country : undefined,
    documentType: documentType && documentType !== "all" ? documentType : undefined,
    createdAtFrom: kycFrom ? toCreatedAtFrom(kycFrom) : undefined,
    createdAtTo: kycTo ? toCreatedAtTo(kycTo) : undefined,
    updatedAtFrom: lastUpdateFrom ? toCreatedAtFrom(lastUpdateFrom) : undefined,
    updatedAtTo: lastUpdateTo ? toCreatedAtTo(lastUpdateTo) : undefined,
    isReverification:
      reverifyStatus && reverifyStatus !== "all" ? reverifyStatus : undefined,
  });

  const filterDefinitions = useMemo(
    () => query.data?.filterDefinitions ?? [],
    [query.data?.filterDefinitions]
  );
  const hasBackendFilters = filterDefinitions.length > 0;
  const optionsFilterFields = useMemo((): FilterField[] => {
    const optionDefinitions = filterDefinitions.filter(
      (definition) => definition.type === "options"
    );
    if (optionDefinitions.length > 0) {
      return optionDefinitions.map((definition) => ({
        key: definition.key,
        label: definition.name?.trim() ? definition.name : definition.key,
        type: "options",
        options: definition.options,
        allValue:
          definition.options.find((option) => option.label.toLowerCase() === "all")?.value ?? "",
      }));
    }

    return [
      {
        key: "status",
        label: "Status",
        type: "options",
        options: KYC_STATUS_OPTIONS,
        allValue: "all",
      },
      {
        key: "document_type",
        label: "Document Type",
        type: "options",
        options: KYC_DOCUMENT_TYPE_OPTIONS,
        allValue: "all",
      },
      {
        key: "country",
        label: "Country",
        type: "options",
        options: KYC_COUNTRY_OPTIONS,
        allValue: "all",
      },
      {
        key: "is_reverification",
        label: "Reverify Status",
        type: "options",
        options: REVERIFY_OPTIONS,
        allValue: "all",
      },
    ];
  }, [filterDefinitions]);

  const createdAtLabel =
    filterDefinitions.find(
      (definition) => definition.type === "date_range" && definition.key === "created_at"
    )?.name ?? "KYC Submission";
  const updatedAtLabel =
    filterDefinitions.find(
      (definition) => definition.type === "date_range" && definition.key === "updated_at"
    )?.name ?? "Last Update";

  const getOptionAllValue = useCallback(
    (key: string, fallback: string) =>
      optionsFilterFields.find((field) => field.key === key)?.allValue ?? fallback,
    [optionsFilterFields]
  );

  const statusLabelsByValue = Object.fromEntries(
    (optionsFilterFields.find((field) => field.key === "status")?.options ?? []).map((option) => [
      option.value,
      option.label,
    ])
  );
  const documentTypeLabelsByValue = Object.fromEntries(
    (optionsFilterFields.find((field) => field.key === "document_type")?.options ?? []).map((option) => [
      option.value,
      option.label,
    ])
  );
  const countryLabelsByValue = Object.fromEntries(
    (optionsFilterFields.find((field) => field.key === "country")?.options ?? []).map((option) => [
      option.value,
      option.label,
    ])
  );
  const reverifyLabelsByValue = Object.fromEntries(
    (optionsFilterFields.find((field) => field.key === "is_reverification")?.options ?? []).map(
      (option) => [option.value, option.label]
    )
  );

  const handleChangeOptionFilter = useCallback(
    (key: string, value: string) => {
      if (key === "status") {
        setStatus(value);
        return;
      }
      if (key === "document_type") {
        setDocumentType(value);
        return;
      }
      if (key === "country") {
        setCountry(value);
        return;
      }
      if (key === "is_reverification") {
        setReverifyStatus(value);
      }
    },
    [setCountry, setDocumentType, setReverifyStatus, setStatus]
  );

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
    statusLabelsByValue,
    setStatus,
    documentType,
    documentTypeLabelsByValue,
    setDocumentType,
    country,
    countryLabelsByValue,
    setCountry,
    reverifyStatus,
    reverifyLabelsByValue,
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

  const selectedOptionFilterValues: Record<string, string> = {
    status: status || getOptionAllValue("status", "all"),
    document_type: documentType || getOptionAllValue("document_type", "all"),
    country: country || getOptionAllValue("country", "all"),
    is_reverification: reverifyStatus || getOptionAllValue("is_reverification", "all"),
  };

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
    optionsFilterFields,
    hasBackendFilters,
    selectedOptionFilterValues,
    handleChangeOptionFilter,
    createdAtLabel,
    updatedAtLabel,
    getOptionAllValue,
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
