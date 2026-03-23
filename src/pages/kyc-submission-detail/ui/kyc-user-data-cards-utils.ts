const COUNTRY_LABELS: Record<string, string> = {
  ID: "Indonesia",
  HK: "Hong Kong",
  SG: "Singapore",
  TW: "Taiwan",
  KR: "Korea",
};

/**
 * Formats the label displayed in the user verification header.
 */
export function getCountryLabel(countryCode?: string): string {
  const normalized = String(countryCode ?? "").toUpperCase();
  return COUNTRY_LABELS[normalized] ?? (countryCode || "Unknown");
}

