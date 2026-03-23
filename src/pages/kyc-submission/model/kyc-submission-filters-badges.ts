import type { FilterBadge as FilterBadgeType } from "./kyc-submission-filters-badges.type";
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
  statusLabelsByValue: Record<string, string>;
  setStatus: (v: KycFilterValue) => void;
  documentType: KycFilterValue;
  documentTypeLabelsByValue: Record<string, string>;
  setDocumentType: (v: KycFilterValue) => void;
  country: KycFilterValue;
  countryLabelsByValue: Record<string, string>;
  setCountry: (v: KycFilterValue) => void;
  reverifyStatus: KycFilterValue;
  reverifyLabelsByValue: Record<string, string>;
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

  if (status && status !== "all") {
    const label = statusLabelsByValue[status] ?? status;
    list.push({
      key: "status",
      label: `Status: ${label}`,
      onClear: () => {
          setStatus("");
        resetPageIndex();
      },
    });
  }

  if (documentType && documentType !== "all") {
    const label = documentTypeLabelsByValue[documentType] ?? documentType;
    list.push({
      key: "documentType",
      label: `Document: ${label}`,
      onClear: () => {
          setDocumentType("");
        resetPageIndex();
      },
    });
  }

  if (country && country !== "all") {
    const label = countryLabelsByValue[country] ?? country;
    list.push({
      key: "country",
      label: `Country: ${label}`,
      onClear: () => {
          setCountry("");
        resetPageIndex();
      },
    });
  }

  if (reverifyStatus && reverifyStatus !== "all") {
    const label = reverifyLabelsByValue[reverifyStatus] ?? reverifyStatus;
    list.push({
      key: "reverify",
      label: `Reverify: ${label}`,
      onClear: () => {
          setReverifyStatus("");
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

