import { format } from "date-fns";

/**
 * Formats a Date into `yyyy-MM-dd` (local time).
 */
export function toYYYYMMDD(d: Date): string {
  return format(d, "yyyy-MM-dd");
}

