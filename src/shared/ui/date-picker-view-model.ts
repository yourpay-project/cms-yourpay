import { parseISO } from "date-fns";

/**
 * Parses controlled date string into Date for calendar selection.
 *
 * @param customDate - Date string in yyyy-MM-dd format.
 * @returns Parsed date or undefined when empty.
 */
export function resolveSelectedDate(customDate: string): Date | undefined {
  if (!customDate) {
    return undefined;
  }
  return parseISO(customDate);
}

/**
 * Resolves whether trailing clear action should be shown.
 *
 * @param allowClear - Clear action enabled flag.
 * @param hasValue - Whether picker currently has a selected value.
 * @returns True when clear action should be displayed.
 */
export function shouldShowClearAction(allowClear: boolean, hasValue: boolean): boolean {
  if (!allowClear) {
    return false;
  }
  if (!hasValue) {
    return false;
  }
  return true;
}

