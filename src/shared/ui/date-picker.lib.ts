import { format, parseISO } from "date-fns";

/**
 * Formats a Date into `yyyy-MM-dd` (local time).
 */
export function toYYYYMMDD(d: Date): string {
  return format(d, "yyyy-MM-dd");
}

/**
 * Returns the trigger display text for a controlled date value.
 */
export function formatDateDisplay(params: {
  value: string;
  placeholder: string;
  displayFormat?: string;
}): string {
  const { value, placeholder, displayFormat } = params;
  if (!value) return placeholder;
  if (!displayFormat) return value;
  try {
    return format(parseISO(value), displayFormat);
  } catch {
    return value;
  }
}

