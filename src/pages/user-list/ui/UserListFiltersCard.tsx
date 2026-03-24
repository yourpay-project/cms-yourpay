import type { FC } from "react";
import { FilterCard, toFilterCardBadgeLabel, toFilterCardBadges } from "@/shared/ui";
import type { UserListDynamicFilterField, UserListFilterBadge } from "..";
import { UserListFiltersGrid } from "./UserListFiltersGrid";

export interface UserListFiltersCardProps {
  filtersOpen: boolean;
  setFiltersOpen: (v: boolean | ((prev: boolean) => boolean)) => void;
  badges: UserListFilterBadge[];
  handleResetFilters: () => void;
  optionFilterFields: readonly UserListDynamicFilterField[];
  selectedFilterValues: Record<string, string>;
  onChangeFilter: (key: string, value: string) => void;
}

/**
 * Collapsible filters card for User Yourpay: header (Filters toggle, badges, Reset)
 * and dynamic filter grid when open.
 *
 * @param props - {@link UserListFiltersCardProps}
 * @returns Card with toggle, badges, reset, and optional grid
 */
export const UserListFiltersCard: FC<UserListFiltersCardProps> = (props) => {
  const { filtersOpen, setFiltersOpen, badges, handleResetFilters } = props;

  return (
    <FilterCard
      filtersOpen={filtersOpen}
      setFiltersOpen={setFiltersOpen}
      badges={toFilterCardBadges(badges, (badge) => ({
        id: badge.id,
        badgeKey: badge.name,
        label: toFilterCardBadgeLabel(badge.name, badge.valueLabel),
        onClear: badge.onClear,
      }))}
      onReset={handleResetFilters}
    >
      <UserListFiltersGrid
        filterFields={props.optionFilterFields}
        selectedFilterValues={props.selectedFilterValues}
        onChangeFilter={props.onChangeFilter}
      />
    </FilterCard>
  );
};
