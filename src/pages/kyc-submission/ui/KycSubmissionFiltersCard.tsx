import type { FC } from "react";
import { FilterCard, toFilterCardBadges } from "@/shared/ui";
import type { FilterField } from "@/shared/ui";
import type { FilterBadge } from "..";
import { KycSubmissionFiltersGrid } from "./KycSubmissionFiltersGrid";

export interface KycSubmissionFiltersCardProps {
  filtersOpen: boolean;
  setFiltersOpen: (v: boolean | ((prev: boolean) => boolean)) => void;
  badges: FilterBadge[];
  handleResetFilters: () => void;
  optionsFilterFields: readonly FilterField[];
  selectedOptionFilterValues: Record<string, string>;
  handleChangeOptionFilter: (key: string, value: string) => void;
  createdAtLabel: string;
  updatedAtLabel: string;
  kycFrom: string;
  kycTo: string;
  kycPresetLabel: string | null;
  setKycFrom: (v: string) => void;
  setKycTo: (v: string) => void;
  setKycPresetLabel: (v: string | null) => void;
  lastUpdateFrom: string;
  lastUpdateTo: string;
  lastUpdatePresetLabel: string | null;
  setLastUpdateFrom: (v: string) => void;
  setLastUpdateTo: (v: string) => void;
  setLastUpdatePresetLabel: (v: string | null) => void;
  resetPageIndex: () => void;
}

/**
 * Collapsible filters card for KYC Submissions: header (Filters toggle, badges, Reset) and filter grid when open.
 * Grid includes status, document type, reverify, KYC date range, and last update date range (with presets). Badge colors from {@link getFilterBadgeClassName}.
 *
 * @param props - {@link KycSubmissionFiltersCardProps}
 * @returns Card with toggle, badges, reset, and optional grid
 */
export const KycSubmissionFiltersCard: FC<KycSubmissionFiltersCardProps> = (props) => {
  const { filtersOpen, setFiltersOpen, badges, handleResetFilters } = props;

  return (
    <FilterCard
      filtersOpen={filtersOpen}
      setFiltersOpen={setFiltersOpen}
      badges={toFilterCardBadges(badges, (badge) => ({
        id: badge.key,
        badgeKey: badge.key,
        label: badge.label,
        onClear: badge.onClear,
      }))}
      onReset={handleResetFilters}
      badgesClassName="hidden sm:flex"
    >
      <KycSubmissionFiltersGrid {...props} />
    </FilterCard>
  );
};
