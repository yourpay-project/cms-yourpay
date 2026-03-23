import type { FC } from "react";
import type { FilterField } from "@/shared/ui";
import { DateRangePicker, FilterOptionsGrid } from "@/shared/ui";
import { PRESETS } from "../lib/date-range-presets";

export interface KycSubmissionFiltersGridProps {
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
 * Grid of filter controls (Status, Document Type, Country, date ranges, Reverify).
 */
export const KycSubmissionFiltersGrid: FC<KycSubmissionFiltersGridProps> = (props) => {
  const { resetPageIndex } = props;
  return (
    <div>
      <FilterOptionsGrid
        fields={props.optionsFilterFields}
        values={props.selectedOptionFilterValues}
        onChange={(key, value) => {
          props.handleChangeOptionFilter(key, value);
          resetPageIndex();
        }}
      />
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
      <DateRangePicker
        label={props.createdAtLabel}
        from={props.kycFrom}
        to={props.kycTo}
        presetLabel={props.kycPresetLabel}
        presets={PRESETS}
        onRangeChange={(from, to, label) => {
          props.setKycFrom(from);
          props.setKycTo(to);
          props.setKycPresetLabel(label ?? null);
          resetPageIndex();
        }}
      />
      <DateRangePicker
        label={props.updatedAtLabel}
        from={props.lastUpdateFrom}
        to={props.lastUpdateTo}
        presetLabel={props.lastUpdatePresetLabel}
        presets={PRESETS}
        onRangeChange={(from, to, label) => {
          props.setLastUpdateFrom(from);
          props.setLastUpdateTo(to);
          props.setLastUpdatePresetLabel(label ?? null);
          resetPageIndex();
        }}
      />
      </div>
    </div>
  );
};
