/**
 * Formats an ISO/RFC3339 date string to `MMM d, yyyy`.
 * Returns the original value when parsing fails.
 */
export function formatDateOnly(value: string | undefined): string | undefined {
  if (!value) return undefined;
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return value;
  }
}
