import type { FC } from "react";
import { Button, Calendar } from "@/shared/ui";
import type { DateRange } from "@/shared/ui";
import { cn } from "@/shared/lib/utils";
import type { DateRangePickerPreset } from "./date-range-picker.type";

/**
 * Props for {@link DateRangePickerDropdownContent}.
 * Extracted so {@link DateRangePicker} stays small and readable.
 */
export interface DateRangePickerDropdownContentProps {
  presets?: readonly DateRangePickerPreset[];
  disabled: boolean;
  defaultMonth: Date;
  selectedRange: DateRange | undefined;
  onSelect: (range: { from: Date | undefined; to?: Date | undefined } | undefined) => void;
  onClearCustom: () => void;
  onToday: () => void;
  onCancel: () => void;
  onApplyCustom: () => void;
  onPresetApply: (from: string, to: string, presetLabel: string) => void;
  onPresetCancel: () => void;
}

/**
 * Dropdown menu content for {@link DateRangePicker}.
 * Kept as a separate component to keep the main picker file small.
 */
export const DateRangePickerDropdownContent: FC<DateRangePickerDropdownContentProps> = (props) => {
  const {
    presets,
    disabled,
    defaultMonth,
    selectedRange,
    onSelect,
    onClearCustom,
    onToday,
    onCancel,
    onApplyCustom,
    onPresetApply,
    onPresetCancel,
  } = props;

  return (
    <div className="space-y-3 pr-1">
      {presets && presets.length > 0 ? (
        <>
          <p className="text-xs font-medium text-muted-foreground">Presets</p>
          <div className="grid grid-cols-2 gap-1">
            {presets.map((p) => (
              <button
                key={p.label}
                type="button"
                className="rounded-md px-2 py-1.5 text-left text-sm text-foreground hover:bg-muted focus:bg-muted focus:outline-none"
                onClick={() => {
                  const r = p.getRange();
                  onPresetApply(r.from, r.to, p.label);
                  onPresetCancel();
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </>
      ) : null}

      <p className={cn("pt-1 text-xs font-medium text-muted-foreground", !presets?.length && "pt-0")}>
        Custom
      </p>

      <Calendar
        mode="range"
        defaultMonth={defaultMonth}
        selected={selectedRange}
        onSelect={onSelect}
        captionLayout="label"
        numberOfMonths={1}
        className="w-full [--cell-size:1.5rem] text-sm"
        disabled={disabled}
      />

      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="flex gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={onClearCustom} disabled={disabled}>
            Clear
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={onToday} disabled={disabled}>
            Today
          </Button>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="button" size="sm" onClick={onApplyCustom} disabled={disabled}>
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
};

