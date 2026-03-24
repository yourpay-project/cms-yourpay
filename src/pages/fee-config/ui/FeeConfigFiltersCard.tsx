import type { FC } from "react";
import { FilterCard, toFilterCardBadgeLabel, toFilterCardBadges } from "@/shared/ui";
import type { FeeStatusFilter, FeeTypeFilter } from "../model";
import type { FeeConfigFilterBadge } from "../model";
import { FeeConfigFiltersGrid } from "./FeeConfigFiltersGrid";

export interface FeeConfigFiltersCardProps {
  filtersOpen: boolean;
  setFiltersOpen: (v: boolean | ((prev: boolean) => boolean)) => void;
  status: FeeStatusFilter;
  setStatus: (v: FeeStatusFilter) => void;
  feeType: FeeTypeFilter;
  setFeeType: (v: FeeTypeFilter) => void;
  service: string;
  setService: (v: string) => void;
  serviceOptions: readonly { value: string; label: string }[];
  badges: FeeConfigFilterBadge[];
  handleResetFilters: () => void;
}

/**
 * Collapsible filters card for Fee Config page.
 *
 * @param props - {@link FeeConfigFiltersCardProps}
 * @returns Card with Filters toggle, reset action, and optional filter grid
 */
export const FeeConfigFiltersCard: FC<FeeConfigFiltersCardProps> = (props) => {
  const { filtersOpen, setFiltersOpen, badges, handleResetFilters } = props;

  return (
    <FilterCard
      filtersOpen={filtersOpen}
      setFiltersOpen={setFiltersOpen}
      badges={toFilterCardBadges(badges, (badge) => ({
        id: badge.id,
        badgeKey: badge.key,
        label: toFilterCardBadgeLabel(badge.label, badge.valueLabel),
        onClear: badge.onClear,
      }))}
      onReset={handleResetFilters}
    >
      <FeeConfigFiltersGrid
        status={props.status}
        setStatus={props.setStatus}
        feeType={props.feeType}
        setFeeType={props.setFeeType}
        service={props.service}
        setService={props.setService}
        serviceOptions={props.serviceOptions}
      />
    </FilterCard>
  );
};


