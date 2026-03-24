import type { FC } from "react";
import { FilterCard, toFilterCardBadges } from "@/shared/ui";
import { TransactionsFiltersGrid } from "./TransactionsFiltersGrid";
import type { TransactionsFiltersGridProps } from "./TransactionsFiltersGrid";

export interface TransactionsFiltersCardProps {
  filtersOpen: boolean;
  setFiltersOpen: (v: boolean | ((prev: boolean) => boolean)) => void;
  badges: Array<{ id: string; badgeKey: string; label: string; onClear: () => void }>;
  handleResetFilters: () => void;
  gridProps: TransactionsFiltersGridProps;
}

/**
 * Transactions-specific filter card wrapper that adapts local badge shape
 * into shared {@link FilterCard} badge contracts.
 */
export const TransactionsFiltersCard: FC<TransactionsFiltersCardProps> = (props) => {
  const { filtersOpen, setFiltersOpen, badges, handleResetFilters, gridProps } = props;

  return (
    <FilterCard
      filtersOpen={filtersOpen}
      setFiltersOpen={setFiltersOpen}
      badges={toFilterCardBadges(badges, (badge) => ({
        id: badge.id,
        badgeKey: badge.badgeKey,
        label: badge.label,
        onClear: badge.onClear,
      }))}
      onReset={handleResetFilters}
    >
      <TransactionsFiltersGrid {...gridProps} />
    </FilterCard>
  );
};
