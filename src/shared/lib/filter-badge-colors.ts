/**
 * Returns Tailwind classes for filter badges by key so badges are distinct and colorful.
 * Uses semantic theme colors (success, primary, warning) where possible; fallback to Tailwind palette.
 *
 * @param key - Filter key (e.g. "status", "country", "documentType", "kyc", "gender"). Used to pick a color set.
 * @returns Tailwind class string for the badge (base + border/background/text).
 */
export function getFilterBadgeClassName(key: string): string {
  const base = "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium";
  const normalized = key.trim().toLowerCase().replace(/[^a-z0-9]+/g, "");

  // Normalize label variants to canonical keys used by the color map.
  const derivedKey =
    normalized === "status"
      ? "status"
      : normalized === "gender"
        ? "gender"
        : normalized === "country"
          ? "country"
          : normalized === "documenttype"
            ? "documentType"
            : normalized === "reverifystatus" || normalized === "reverify"
              ? "reverify"
              : normalized === "kyc" || normalized === "kycsubmission" || normalized === "kycsubmissiondetail"
                ? "kyc"
                : normalized === "lastupdate" || normalized === "lastupdatedate"
                  ? "lastUpdate"
                  : normalized === "feetype" || normalized === "feetypefilter"
                    ? "feeType"
                    : normalized === "service"
                      ? "service"
                      : normalized === "currency"
                        ? "currency"
                        : normalized;

  const colorMap: Record<string, string> = {
    status: "border-success/40 bg-success/15 text-success",
    country: "border-primary/40 bg-primary/15 text-primary",
    documentType: "border-violet-500/40 bg-violet-500/15 text-violet-600 dark:text-violet-400",
    reverify: "border-warning/40 bg-warning/15 text-warning",
    kyc: "border-cyan-500/40 bg-cyan-500/15 text-cyan-600 dark:text-cyan-400",
    lastUpdate: "border-slate-500/40 bg-slate-500/15 text-slate-700 dark:text-slate-300",
    gender: "border-pink-500/40 bg-pink-500/15 text-pink-600 dark:text-pink-400",
    feeType: "border-violet-500/40 bg-violet-500/15 text-violet-600 dark:text-violet-400",
    service: "border-primary/40 bg-primary/15 text-primary",
    currency: "border-warning/40 bg-warning/15 text-warning",
  };

  const colors = colorMap[derivedKey] ?? "border-border bg-muted/60 text-foreground";
  return `${base} ${colors}`;
}
