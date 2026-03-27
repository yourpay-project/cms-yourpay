import type { SelectDropdownOption } from "@/shared/ui";
import type { verificationdocument_VerificationDocument } from "@/shared/api/generated";

/** Matches backend `gender_Gender`. */
export const KYC_GENDER_OPTIONS: SelectDropdownOption[] = [
  { value: "M", label: "Male" },
  { value: "F", label: "Female" },
];

/** Matches backend `customer_Religion` values. */
export const KYC_RELIGION_OPTIONS: SelectDropdownOption[] = [
  { value: "Islam", label: "Islam" },
  { value: "Kristen", label: "Kristen" },
  { value: "Hindu", label: "Hindu" },
  { value: "Budha", label: "Budha" },
  { value: "Konghucu", label: "Konghucu" },
];

/** Matches backend marriage status values. */
export const KYC_MARRIAGE_STATUS_OPTIONS: SelectDropdownOption[] = [
  { value: "married", label: "Married" },
  { value: "not_married", label: "Not Married" },
];

/** Matches backend nationality values. */
export const KYC_NATIONALITY_OPTIONS: SelectDropdownOption[] = [
  { value: "WNI", label: "WNI" },
  { value: "WNA", label: "WNA" },
  { value: "Indonesia", label: "Indonesia" },
];

/** Indonesia KYC document types from verification document enum. */
export const KYC_INDONESIA_DOCUMENT_TYPE_OPTIONS: SelectDropdownOption[] = [
  { value: "KTP", label: "KTP" },
  { value: "KK", label: "KK" },
  { value: "PASSPORT", label: "PASSPORT" },
];

const ALL_VERIFICATION_DOCUMENT_VALUES: verificationdocument_VerificationDocument[] = [
  "KTP",
  "KK",
  "PASSPORT",
  "SELFIE_PHOTO",
  "HK_ID",
  "Empty",
  "OTHER",
  "SG_WORKING_PERMIT",
  "SG_WORKING_PERMIT_BACK",
  "ARC_FRONT",
  "ARC_BACK",
];

/**
 * Full document type list for non-Indonesia submissions (matches generated enum labels).
 */
export const KYC_ALL_DOCUMENT_TYPE_OPTIONS: SelectDropdownOption[] = ALL_VERIFICATION_DOCUMENT_VALUES.map((v) => ({
  value: v,
  label: v.replace(/_/g, " "),
}));

/**
 * Ensures current draft value appears in options when API returned a legacy/unknown code.
 */
export function mergeDocumentTypeOptions(
  base: SelectDropdownOption[],
  currentType?: string,
): SelectDropdownOption[] {
  if (!currentType) return base;
  if (base.some((o) => o.value === currentType)) return base;
  return [{ value: currentType, label: currentType }, ...base];
}

/**
 * Ensures selected occupation id is present in dropdown options when list loads late or data is legacy.
 */
export function mergeOccupationDropdownOptions(
  base: SelectDropdownOption[],
  occupationId?: string,
  occupationLabel?: string,
): SelectDropdownOption[] {
  if (!occupationId) return base;
  if (base.some((o) => o.value === occupationId)) return base;
  if (!occupationLabel) return base;
  return [{ value: occupationId, label: occupationLabel }, ...base];
}

/** Normalizes API date strings to `yyyy-mm-dd` for `<input type="date" />`. */
export function toDateInputValue(raw?: string): string {
  if (!raw) return "";
  const s = raw.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const sliced = s.slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(sliced)) {
    return sliced;
  }
  return "";
}
