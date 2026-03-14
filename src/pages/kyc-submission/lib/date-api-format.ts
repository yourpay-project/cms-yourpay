/**
 * API date formatting for KYC submission filters.
 * Converts YYYY-MM-DD to ISO bounds for backend (created_at / updated_at).
 */

/** Format YYYY-MM-DD to ISO start of day UTC for API. */
export function toCreatedAtFrom(dateStr: string): string {
  if (!dateStr) return undefined as unknown as string;
  return `${dateStr}T00:00:00.000Z`;
}

/** Format YYYY-MM-DD to ISO end of day UTC for API. */
export function toCreatedAtTo(dateStr: string): string {
  if (!dateStr) return undefined as unknown as string;
  return `${dateStr}T23:59:59.000Z`;
}
