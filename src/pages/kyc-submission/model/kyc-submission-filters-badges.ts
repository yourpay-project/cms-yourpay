import type { FilterBadge as FilterBadgeType } from "./kyc-submission-filters-badges.type";

import { KYC_STATUS_OPTIONS, KYC_DOCUMENT_TYPE_OPTIONS, KYC_COUNTRY_OPTIONS, REVERIFY_OPTIONS } from "./constants";

import type {
  KycFilterValue,
  KycPresetLabel,
  KycFromToValues,
  LastUpdateFromToValues,
} from "./kyc-submission-filters-badges.type";

/**
 * Builds the header badges for the KYC submission filters card.
 *
 * Badges are derived from the current filter state and provide an `onClear`
 * callback to reset each filter and return to page index `0`.
 */
export function buildKycSubmissionBadges(params: {
  status: KycFilterValue;
  setStatus: (v: KycFilterValue) => void;
  documentType: KycFilterValue;
  setDocumentType: (v: KycFilterValue) => void;
  country: KycFilterValue;
  setCountry: (v: KycFilterValue) => void;
  reverifyStatus: KycFilterValue;
  setReverifyStatus: (v: KycFilterValue) => void;
  kycFromTo: KycFromToValues;
  setKycFrom: (v: string) => void;
  setKycTo: (v: string) => void;
  kycPresetLabel: KycPresetLabel;
  setKycPresetLabel: (v: KycPresetLabel) => void;
  lastUpdateFromTo: LastUpdateFromToValues;
  setLastUpdateFrom: (v: string) => void;
  setLastUpdateTo: (v: string) => void;
  lastUpdatePresetLabel: KycPresetLabel;
  setLastUpdatePresetLabel: (v: KycPresetLabel) => void;
  resetPageIndex: () => void;
}): FilterBadgeType[] {
  const {
    status,
    setStatus,
    documentType,
    setDocumentType,
    country,
    setCountry,
    reverifyStatus,
    setReverifyStatus,
    kycFromTo,
    setKycFrom,
    setKycTo,
    kycPresetLabel,
    setKycPresetLabel,
    lastUpdateFromTo,
    setLastUpdateFrom,
    setLastUpdateTo,
    lastUpdatePresetLabel,
    setLastUpdatePresetLabel,
    resetPageIndex,
  } = params;

  const list: FilterBadgeType[] = [];

  if (status !== "all") {
    const label = KYC_STATUS_OPTIONS.find((o) => o.value === status)?.label ?? status;
    list.push({
      key: "status",
      label: `Status: ${label}`,
      onClear: () => {
        setStatus("all");
        resetPageIndex();
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
        resetPageIndex();
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
        resetPageIndex();
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
        resetPageIndex();
      },
    });
  }

  if (kycFromTo.kycFrom && kycFromTo.kycTo) {
    const label = kycPresetLabel ?? `${kycFromTo.kycFrom} – ${kycFromTo.kycTo}`;
    list.push({
      key: "kyc",
      label: `KYC: ${label}`,
      onClear: () => {
        setKycFrom("");
        setKycTo("");
        setKycPresetLabel(null);
        resetPageIndex();
      },
    });
  }

  if (lastUpdateFromTo.lastUpdateFrom && lastUpdateFromTo.lastUpdateTo) {
    const label =
      lastUpdatePresetLabel ?? `${lastUpdateFromTo.lastUpdateFrom} – ${lastUpdateFromTo.lastUpdateTo}`;
    list.push({
      key: "lastUpdate",
      label: `Last update: ${label}`,
      onClear: () => {
        setLastUpdateFrom("");
        setLastUpdateTo("");
        setLastUpdatePresetLabel(null);
        resetPageIndex();
      },
    });
  }

  return list;
}

