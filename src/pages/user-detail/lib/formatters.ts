/**
 * Normalizes identity access codes for stable comparisons.
 *
 * @param code - Raw identity access code.
 * @returns Lower-cased and trimmed code.
 */
export function normalizeCode(code: string): string {
  return code.trim().toLowerCase();
}

/**
 * Formats an ISO-like date/time string into a readable UK-style timestamp.
 *
 * @param input - Raw date string.
 * @param includeSeconds - Whether to include seconds in output.
 * @returns Formatted datetime or "-" when unavailable.
 */
export function formatDateTime(input?: string, includeSeconds = true): string {
  if (!input) {
    return "-";
  }

  const date = new Date(input);
  if (Number.isNaN(date.getTime())) {
    return input;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: includeSeconds ? "2-digit" : undefined,
    hour12: false,
  }).format(date);
}

/**
 * Builds a display-friendly full name from first and last names.
 *
 * @param firstName - First name.
 * @param lastName - Last name.
 * @returns Full name or "-".
 */
export function getFullName(firstName?: string, lastName?: string): string {
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();
  return fullName || "-";
}

/**
 * Builds a readable device title from brand/model.
 *
 * @param deviceBrand - Device brand.
 * @param deviceModel - Device model.
 * @returns Device title or "Unknown Device".
 */
export function formatDeviceTitle(deviceBrand?: string, deviceModel?: string): string {
  const title = [deviceBrand, deviceModel].filter(Boolean).join(" ").trim();
  return title || "Unknown Device";
}

/**
 * Builds operating system label for device cards.
 *
 * @param osName - OS name.
 * @param osVersion - OS version.
 * @returns Combined OS display label.
 */
export function formatOperatingSystem(osName?: string, osVersion?: string): string {
  const value = [osName?.toUpperCase(), osVersion].filter(Boolean).join(" ").trim();
  return value || "-";
}
