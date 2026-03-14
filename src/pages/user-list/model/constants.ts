import type { FilterSelectOption } from "@/shared/ui";

export const USER_COUNTRY_OPTIONS: readonly FilterSelectOption[] = [
  { value: "ALL", label: "All" },
  { value: "BN", label: "BN" },
  { value: "HK", label: "HK" },
  { value: "ID", label: "ID" },
  { value: "KR", label: "KR" },
  { value: "SG", label: "SG" },
  { value: "TW", label: "TW" },
] as const;

export const USER_STATUS_OPTIONS: readonly FilterSelectOption[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "blocked", label: "Blocked" },
] as const;

export const USER_GENDER_OPTIONS: readonly FilterSelectOption[] = [
  { value: "all", label: "All" },
  { value: "M", label: "Male" },
  { value: "F", label: "Female" },
] as const;
