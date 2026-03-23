export function normalizeCode(code: string): string {
  return code.trim().toLowerCase();
}

export function formatDateTime(input?: string, includeSeconds = true): string {
  if (!input) return "-";
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return input;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: includeSeconds ? "2-digit" : undefined,
    hour12: false,
  }).format(date);
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
