/**
 * Filter option values for KYC submission list.
 * Aligned with Laravel KYC list filters and backend enum/options.
 */

export const KYC_STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
] as const;

export const REVERIFY_OPTIONS = [
  { value: "all", label: "All" },
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
] as const;

/** Country codes for filter dropdown (match old CMS). */
export const KYC_COUNTRY_OPTIONS = [
  { value: "all", label: "All" },
  { value: "ID", label: "Indonesia" },
  { value: "SG", label: "Singapore" },
  { value: "HK", label: "Hong Kong" },
  { value: "KR", label: "Korea Selatan" },
  { value: "TW", label: "Taiwan" },
] as const;

/** Document types for filter dropdown. */
export const KYC_DOCUMENT_TYPE_OPTIONS = [
  { value: "all", label: "All" },
  { value: "KTP", label: "KTP" },
  { value: "KK", label: "KK" },
  { value: "PASSPORT", label: "PASSPORT" },
  { value: "HK_ID", label: "HK_ID" },
  { value: "ARC", label: "ARC" },
  { value: "SG Working Permit", label: "SG Working Permit" },
] as const;
