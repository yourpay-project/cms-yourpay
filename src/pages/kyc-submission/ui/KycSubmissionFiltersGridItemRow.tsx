import type { FC } from "react";

import { DateRangePicker, FilterSelectWithClear } from "@/shared/ui";

import { PRESETS } from "../lib/date-range-presets";
import type { KycSubmissionGridItem } from "../model/build-kyc-submission-filter-grid-items";

interface KycSubmissionFiltersGridItemRowProps {
  item: KycSubmissionGridItem;
  selectedOptionFilterValues: Record<string, string>;
  handleChangeOptionFilter: (key: string, value: string) => void;
  resetPageIndex: () => void;
}

/**
 * Renderer for one KYC submission filter grid item.
 *
 * @param props Item payload and filter callbacks.
 * @returns One option or date-range filter control.
 */
export const KycSubmissionFiltersGridItemRow: FC<KycSubmissionFiltersGridItemRowProps> = ({
  item,
  selectedOptionFilterValues,
  handleChangeOptionFilter,
  resetPageIndex,
}) => {
  if (item.type === "options") {
    const { field } = item;
    return (
      <FilterSelectWithClear
        label={field.label}
        value={selectedOptionFilterValues[field.key] ?? field.allValue}
        options={field.options}
        onChange={(value) => {
          handleChangeOptionFilter(field.key, value);
          resetPageIndex();
        }}
        onClear={() => {
          handleChangeOptionFilter(field.key, field.allValue);
          resetPageIndex();
        }}
        allValue={field.allValue}
      />
    );
  }

  return (
    <DateRangePicker
      label={item.label}
      from={item.from}
      to={item.to}
      presetLabel={item.presetLabel}
      presets={PRESETS}
      onRangeChange={(from, to, label) => {
        item.onRangeChange(from, to, label ?? null);
      }}
    />
  );
};
