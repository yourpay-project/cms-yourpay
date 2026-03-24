import type { FilterCardBadge } from "./filter-card";

/**
 * Generic badge mapper so each page can adapt local badge models
 * into {@link FilterCardBadge} without duplicating conversion logic.
 *
 * @param badges - Source badges from a page-level model.
 * @param mapper - Adapter function that maps source badge to `FilterCardBadge`.
 * @returns Normalized badges consumable by {@link FilterCard}.
 */
export function toFilterCardBadges<T>(
  badges: readonly T[],
  mapper: (badge: T) => FilterCardBadge
): FilterCardBadge[] {
  return badges.map(mapper);
}

/**
 * Standard label formatter used by filter badges.
 *
 * @param name - Primary badge label (e.g. "Status").
 * @param valueLabel - Optional selected value label.
 * @returns Formatted badge label.
 */
export function toFilterCardBadgeLabel(name: string, valueLabel?: string): string {
  return valueLabel ? `${name}: ${valueLabel}` : name;
}
