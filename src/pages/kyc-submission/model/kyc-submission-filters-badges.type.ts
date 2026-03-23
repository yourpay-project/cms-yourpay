/**
 * Visual badge rendered in the KYC submission filters card header.
 */
export interface FilterBadge {
  key: string;
  label: string;
  onClear: () => void;
}

/**
 * Filter scalar values for KYC filters (e.g. `status`, `documentType`, `country`, `reverifyStatus`).
 * Uses `"all"` as the unset value.
 */
export type KycFilterValue = string;

/**
 * Optional human-readable label for the currently selected date-range preset.
 * Can be `null` when no preset is selected.
 */
export type KycPresetLabel = string | null;

/**
 * Controlled KYC "created date range" values (yyyy-MM-dd).
 */
export interface KycFromToValues {
  kycFrom: string;
  kycTo: string;
}

/**
 * Controlled KYC "last update range" values (yyyy-MM-dd).
 */
export interface LastUpdateFromToValues {
  lastUpdateFrom: string;
  lastUpdateTo: string;
}

