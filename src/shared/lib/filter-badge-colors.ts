/**
 * Returns Tailwind classes for filter badges by key so badges are distinct and colorful.
 * Uses semantic theme colors (success, primary, warning) where possible; fallback to Tailwind palette.
 *
 * @param key - Filter key (e.g. "status", "country", "documentType", "kyc", "gender"). Used to pick a color set.
 * @returns Tailwind class string for the badge (base + border/background/text).
 */
export function getFilterBadgeClassName(key: string): string {
  const base = "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium";
  const colorMap: Record<string, string> = {
    status: "border-success/40 bg-success/15 text-success",
    country: "border-primary/40 bg-primary/15 text-primary",
    documentType: "border-violet-500/40 bg-violet-500/15 text-violet-600 dark:text-violet-400",
    reverify: "border-warning/40 bg-warning/15 text-warning",
    kyc: "border-cyan-500/40 bg-cyan-500/15 text-cyan-600 dark:text-cyan-400",
    lastUpdate: "border-slate-500/40 bg-slate-500/15 text-slate-700 dark:text-slate-300",
    gender: "border-pink-500/40 bg-pink-500/15 text-pink-600 dark:text-pink-400",
  };
  const colors = colorMap[key] ?? "border-border bg-muted/60 text-foreground";
  return `${base} ${colors}`;
}
