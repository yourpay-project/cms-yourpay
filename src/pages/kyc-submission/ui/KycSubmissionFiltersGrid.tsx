import type { FC } from "react";
import type { FilterField } from "@/shared/ui";
import { DateRangePicker, FilterSelectWithClear } from "@/shared/ui";
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
 * Render item model for KYC filter grid.
 * Normalizes options and date-range controls into one iterable list.
 */
type KycGridItem =
  | { type: "options"; key: string; field: FilterField }
  | {
      type: "date_range";
      key: string;
      label: string;
      from: string;
      to: string;
      presetLabel: string | null;
      onRangeChange: (from: string, to: string, label: string | null) => void;
    };

/**
 * Grid of KYC filter controls rendered in a single loop + switch pipeline.
 *
 * @param props - {@link KycSubmissionFiltersGridProps}
 * @returns Two-column responsive grid of option and date-range controls.
 */
export const KycSubmissionFiltersGrid: FC<KycSubmissionFiltersGridProps> = (props) => {
  const { resetPageIndex } = props;

  const gridItems: KycGridItem[] = [
    ...props.optionsFilterFields.map((field) => ({
      type: "options" as const,
      key: `options:${field.key}`,
      field,
    })),
    {
      type: "date_range",
      key: "date_range:created_at",
      label: props.createdAtLabel,
      from: props.kycFrom,
      to: props.kycTo,
      presetLabel: props.kycPresetLabel,
      onRangeChange: (from, to, label) => {
        props.setKycFrom(from);
        props.setKycTo(to);
        props.setKycPresetLabel(label);
        resetPageIndex();
      },
    },
    {
      type: "date_range",
      key: "date_range:updated_at",
      label: props.updatedAtLabel,
      from: props.lastUpdateFrom,
      to: props.lastUpdateTo,
      presetLabel: props.lastUpdatePresetLabel,
      onRangeChange: (from, to, label) => {
        props.setLastUpdateFrom(from);
        props.setLastUpdateTo(to);
        props.setLastUpdatePresetLabel(label);
        resetPageIndex();
      },
    },
  ];

  return (
    <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
      {gridItems.map((item) => {
        switch (item.type) {
          case "options": {
            const { field } = item;
            return (
              <FilterSelectWithClear
                key={item.key}
                label={field.label}
                value={props.selectedOptionFilterValues[field.key] ?? field.allValue}
                options={field.options}
                onChange={(value) => {
                  props.handleChangeOptionFilter(field.key, value);
                  resetPageIndex();
                }}
                onClear={() => {
                  props.handleChangeOptionFilter(field.key, field.allValue);
                  resetPageIndex();
                }}
                allValue={field.allValue}
              />
            );
          }
          case "date_range":
            return (
              <DateRangePicker
                key={item.key}
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
          default:
            return null;
        }
      })}
    </div>
  );
};
