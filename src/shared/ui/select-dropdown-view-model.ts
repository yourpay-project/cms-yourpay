/**
 * Resolves trigger height class by size.
 *
 * @param size - Trigger size variant.
 * @returns Trigger height class name.
 */
export function getTriggerSizeClassName(size: "sm" | "md"): string {
  if (size === "sm") {
    return "h-8";
  }
  return "h-12";
}

/**
 * Resolves clear-button size class by size.
 *
 * @param size - Trigger size variant.
 * @returns Clear button size class name.
 */
export function getClearButtonSizeClassName(size: "sm" | "md"): string {
  if (size === "sm") {
    return "h-8 w-7";
  }
  return "h-12 w-11";
}

/**
 * Checks whether clear action should be displayed.
 *
 * @param allowClear - Whether clear action is enabled.
 * @param value - Current selected value.
 * @returns True when clear action should be shown.
 */
export function shouldShowClearAction(allowClear: boolean, value: string): boolean {
  if (!allowClear) {
    return false;
  }
  if (!value) {
    return false;
  }
  return true;
}

