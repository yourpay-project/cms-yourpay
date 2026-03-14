import type { FC } from "react";
import { useMemo } from "react";
import { format, parseISO } from "date-fns";
import { Button, Calendar } from "@/shared/ui";
import { PRESETS } from "../lib/date-range-presets";

interface DateRangePickerDropdownContentProps {
  customFrom: string;
  customTo: string;
  setCustomFrom: (v: string) => void;
  setCustomTo: (v: string) => void;
  onPresetSelect: (from: string, to: string, label: string) => void;
  onApplyCustom: () => void;
  onClose: () => void;
}

function toYYYYMMDD(d: Date): string {
  return format(d, "yyyy-MM-dd");
}

/**
 * Presets grid + Calendar (range, month/year dropdown) + Clear/Today + Cancel/Apply.
 * Uses shadcn-style Calendar with captionLayout="dropdown" for direct month/year selection.
 */
export const DateRangePickerDropdownContent: FC<DateRangePickerDropdownContentProps> = ({
  customFrom,
  customTo,
  setCustomFrom,
  setCustomTo,
  onPresetSelect,
  onApplyCustom,
  onClose,
}) => {
  const selectedRange = useMemo(() => {
    const from = customFrom ? parseISO(customFrom) : undefined;
    const to = customTo ? parseISO(customTo) : undefined;
    if (!from && !to) return undefined;
    return { from, to };
  }, [customFrom, customTo]);

  const defaultMonth = useMemo(() => {
    if (selectedRange?.from) return selectedRange.from;
    return new Date();
  }, [selectedRange?.from]);

  const handleRangeSelect = (range: { from: Date | undefined; to?: Date | undefined } | undefined) => {
    if (range?.from) setCustomFrom(toYYYYMMDD(range.from));
    else setCustomFrom("");
    if (range?.to) setCustomTo(toYYYYMMDD(range.to));
    else setCustomTo("");
  };

  const handleClear = () => {
    setCustomFrom("");
    setCustomTo("");
  };

  const handleToday = () => {
    const t = new Date();
    setCustomFrom(toYYYYMMDD(t));
    setCustomTo(toYYYYMMDD(t));
  };

  return (
    <div className="max-h-[65vh] space-y-3 overflow-y-auto pr-1">
      <p className="text-xs font-medium text-muted-foreground">Presets</p>
      <div className="grid grid-cols-2 gap-1">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            className="rounded-md px-2 py-1.5 text-left text-sm text-foreground hover:bg-muted focus:bg-muted focus:outline-none"
            onClick={() => {
              const { from, to } = p.getRange();
              onPresetSelect(from, to, p.label);
            }}
          >
            {p.label}
          </button>
        ))}
      </div>
      <p className="pt-1 text-xs font-medium text-muted-foreground">Custom</p>
      <Calendar
        mode="range"
        defaultMonth={defaultMonth}
        selected={selectedRange}
        onSelect={handleRangeSelect}
        captionLayout="dropdown"
        numberOfMonths={1}
        className="w-full [--cell-size:1.5rem] text-sm"
      />
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="flex gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={handleClear}>
            Clear
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={handleToday}>
            Today
          </Button>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" size="sm" onClick={onApplyCustom}>
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
};
