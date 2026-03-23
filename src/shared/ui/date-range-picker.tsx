import type { FC, MouseEvent as ReactMouseEvent } from "react";
import { useEffect, useId, useMemo, useState } from "react";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { parseISO } from "date-fns";

import { DropdownFieldTrigger, DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/shared/ui";
import { cn } from "@/shared/lib/utils";

import type { DateRangePickerProps } from "./date-range-picker.type";
import type { DateRangeValue, DateRangePickerPreset } from "./date-range-picker.type";
import { toYYYYMMDD } from "./date-range-picker.lib";
import { DateRangePickerDropdownContent } from "./date-range-picker-dropdown-content";

/**
 * Generic date range picker (optional presets + custom apply).
 */
export const DateRangePicker: FC<DateRangePickerProps> = ({
  label,
  from,
  to,
  presetLabel,
  presets,
  onRangeChange,
  className,
  placeholder = "Select date range",
  allowClear = true,
  disabled = false,
}) => {
  const triggerId = useId().replace(/:/g, "");
  const [open, setOpen] = useState(false);
  const [customFrom, setCustomFrom] = useState(from);
  const [customTo, setCustomTo] = useState(to);

  useEffect(() => {
    if (!open) return;
    setCustomFrom(from);
    setCustomTo(to);
  }, [open, from, to]);

  const selectedPresetLabel = presetLabel != null && presetLabel !== "" ? presetLabel : undefined;
  const displayText =
    selectedPresetLabel != null
      ? selectedPresetLabel
      : from && to
        ? `${from} – ${to}`
        : placeholder;

  const hasValue = Boolean(from && to);

  const selectedRange = useMemo(() => {
    const fromDate = customFrom ? parseISO(customFrom) : undefined;
    const toDate = customTo ? parseISO(customTo) : undefined;
    if (!fromDate) return undefined;
    return { from: fromDate, to: toDate };
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

  const handleApplyCustom = () => {
    if (!customFrom || !customTo) return;
    onRangeChange(customFrom, customTo, undefined);
    setOpen(false);
  };

  const handleClearCustom = () => {
    setCustomFrom("");
    setCustomTo("");
  };

  const handleToday = () => {
    const t = new Date();
    setCustomFrom(toYYYYMMDD(t));
    setCustomTo(toYYYYMMDD(t));
  };

  const handleClearOutside = (e: ReactMouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    onRangeChange("", "", undefined);
    setOpen(false);
  };

  return (
    <div className={cn("relative", className)}>
      <label htmlFor={triggerId} className="mb-1 block text-xs text-muted-foreground">
        {label}
      </label>

      <div className="flex w-full items-center gap-0 rounded-md border border-border bg-background">
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <DropdownFieldTrigger
              id={triggerId}
              leading={
                <CalendarIcon
                  className="h-4 w-4 shrink-0 text-muted-foreground dark:text-muted-foreground"
                  aria-hidden
                />
              }
              label={displayText}
              aria-label={label}
              disabled={disabled}
              className="h-8"
            />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" sideOffset={4} className="w-[min(360px,100vw)] p-3">
            <DateRangePickerDropdownContent
              presets={presets}
              disabled={disabled}
              defaultMonth={defaultMonth}
              selectedRange={selectedRange}
              onSelect={handleRangeSelect}
              onClearCustom={handleClearCustom}
              onToday={handleToday}
              onCancel={() => setOpen(false)}
              onApplyCustom={handleApplyCustom}
              onPresetApply={(rFrom, rTo, presetLabel) => onRangeChange(rFrom, rTo, presetLabel)}
              onPresetCancel={() => setOpen(false)}
            />
          </DropdownMenuContent>
        </DropdownMenu>

        {allowClear && hasValue ? (
          <button
            type="button"
            onClick={handleClearOutside}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-r-md border-l border-border text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none"
            aria-label={`Clear ${label}`}
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
};

export type { DateRangePickerProps, DateRangePickerPreset, DateRangeValue };

