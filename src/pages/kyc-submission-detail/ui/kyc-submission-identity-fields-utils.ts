import { isValid, parseISO } from "date-fns";

/**
 * Parses stored ISO date string (YYYY-MM-DD...) into a `Date` instance.
 */
export function parseStoredDate(iso?: string): Date | undefined {
  if (!iso?.trim()) return undefined;
  const d = parseISO(iso.trim().slice(0, 10));
  return isValid(d) ? d : undefined;
}

