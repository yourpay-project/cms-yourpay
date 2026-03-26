import { formatDisplayDateTime } from "./format-display-datetime";

export function normalizeCode(code: string): string {
  return code.trim().toLowerCase();
}

export function formatDateTime(input?: string, includeSeconds = true): string {
  if (!includeSeconds) {
    // Keep the original parameter but standardize the output.
    // This CMS display standard intentionally does not include seconds.
    return formatDisplayDateTime(input);
  }
  return formatDisplayDateTime(input);
}

export function getFullName(firstName?: string, lastName?: string): string {
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();
  return fullName || "-";
}

export function formatDeviceTitle(deviceBrand?: string, deviceModel?: string): string {
  const title = [deviceBrand, deviceModel].filter(Boolean).join(" ").trim();
  return title || "Unknown Device";
}

export function formatOperatingSystem(osName?: string, osVersion?: string): string {
  const value = [osName?.toUpperCase(), osVersion].filter(Boolean).join(" ").trim();
  return value || "-";
}
