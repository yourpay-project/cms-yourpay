import { format, parseISO } from "date-fns";

function toDate(input?: string): Date | null {
  if (!input) return null;
  try {
    const parsed = parseISO(input);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  } catch {
    // ignore
  }

  const fallback = new Date(input);
  if (Number.isNaN(fallback.getTime())) return null;
  return fallback;
}

/**
 * Formats a date string into `MMMM d, yyyy` (e.g. `June 24, 2025`).
 *
 * @param input - ISO/RFC3339 date string.
 * @returns Formatted date or `-` when missing/invalid.
 */
export function formatDisplayDate(input?: string): string {
  const d = toDate(input);
  if (!d) return "-";
  return format(d, "MMMM d, yyyy");
}

/**
 * Formats a datetime string into `MMM dd, yyyy h:mma` (e.g. `Aug 08, 2022 11:53AM`).
 *
 * @param input - ISO/RFC3339 datetime string.
 * @returns Formatted datetime or `-` when missing/invalid.
 */
export function formatDisplayDateTime(input?: string): string {
  const d = toDate(input);
  if (!d) return "-";
  return format(d, "MMM dd, yyyy h:mma");
}

