import { parseISO } from "date-fns";

interface DisplayTextParams {
  presetLabel?: string;
  from: string;
  to: string;
  placeholder: string;
}

/**
 * Resolves selected preset label value.
 *
 * @param presetLabel - Raw preset label from controlled value.
 * @returns Normalized preset label or undefined.
 */
export function resolveSelectedPresetLabel(presetLabel?: string): string | undefined {
  if (presetLabel != null && presetLabel !== "") {
    return presetLabel;
  }
  return undefined;
}

/**
 * Resolves date range trigger text.
 *
 * @param params - {@link DisplayTextParams}
 * @returns Display text for trigger label.
 */
export function resolveDateRangeDisplayText(params: DisplayTextParams): string {
  const { presetLabel, from, to, placeholder } = params;
  const selectedPresetLabel = resolveSelectedPresetLabel(presetLabel);
  if (selectedPresetLabel != null) {
    return selectedPresetLabel;
  }
  if (from && to) {
    return `${from} – ${to}`;
  }
  return placeholder;
}

/**
 * Parses range strings into DateRange for calendar.
 *
 * @param customFrom - Start date string.
 * @param customTo - End date string.
 * @returns Parsed date range or undefined when start is missing.
 */
export function resolveSelectedRange(
  customFrom: string,
  customTo: string,
): { from: Date; to?: Date } | undefined {
  let fromDate: Date | undefined = undefined;
  if (customFrom) {
    fromDate = parseISO(customFrom);
  }

  let toDate: Date | undefined = undefined;
  if (customTo) {
    toDate = parseISO(customTo);
  }

  if (!fromDate) {
    return undefined;
  }
  return { from: fromDate, to: toDate };
}

/**
 * Resolves calendar default month.
 *
 * @param selectedRange - Parsed selected range.
 * @returns Month date for calendar initial rendering.
 */
export function resolveDefaultMonth(
  selectedRange: { from: Date; to?: Date } | undefined,
): Date {
  if (selectedRange?.from) {
    return selectedRange.from;
  }
  return new Date();
}

