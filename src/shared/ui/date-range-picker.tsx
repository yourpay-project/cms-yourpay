import type { FC, MouseEvent as ReactMouseEvent } from "react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { parseISO } from "date-fns";

import type { DateRangePickerProps } from "./date-range-picker.type";
import type { DateRangeValue, DateRangePickerPreset } from "./date-range-picker.type";
import { toYYYYMMDD } from "./date-range-picker.lib";
import { DateRangePickerTrigger } from "./date-range-picker-trigger";

/**
 * Generic date range picker (optional presets + custom apply).
 * Disabled state mirrors single DatePicker behavior:
 * no interaction, muted background, and no sticky focus ring after close.
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
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [customFrom, setCustomFrom] = useState(from);
  const [customTo, setCustomTo] = useState(to);

  useEffect(() => {
    if (!open) return;
    setCustomFrom(from);
    setCustomTo(to);
  }, [open, from, to]);

  useEffect(() => {
    if (disabled) {
      setOpen(false);
    }
  }, [disabled]);

  let selectedPresetLabel: string | undefined = undefined;
  if (presetLabel != null && presetLabel !== "") {
    selectedPresetLabel = presetLabel;
  }

  let displayText = placeholder;
  if (selectedPresetLabel != null) {
    displayText = selectedPresetLabel;
  } else if (from && to) {
    displayText = `${from} – ${to}`;
  }

  const hasValue = Boolean(from && to);

  const selectedRange = useMemo(() => {
    let fromDate: Date | undefined = undefined;
    if (customFrom) {
      fromDate = parseISO(customFrom);
    }
    let toDate: Date | undefined = undefined;
    if (customTo) {
      toDate = parseISO(customTo);
    }
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
    <div className={className}>
      <label htmlFor={triggerId} className="mb-1 block text-xs text-muted-foreground">
        {label}
      </label>

      <DateRangePickerTrigger
        triggerId={triggerId}
        label={label}
        disabled={disabled}
        open={open}
        onOpenChange={(nextOpen) => {
          if (disabled) return;
          setOpen(nextOpen);
          if (!nextOpen) triggerRef.current?.blur();
        }}
        triggerRef={triggerRef}
        displayText={displayText}
        allowClear={allowClear}
        hasValue={hasValue}
        onClear={handleClearOutside}
        presets={presets}
        defaultMonth={defaultMonth}
        selectedRange={selectedRange}
        onSelect={handleRangeSelect}
        onClearCustom={handleClearCustom}
        onToday={handleToday}
        onCancel={() => setOpen(false)}
        onApplyCustom={handleApplyCustom}
        onPresetApply={(rFrom, rTo, pLabel) => onRangeChange(rFrom, rTo, pLabel)}
        onPresetCancel={() => setOpen(false)}
      />
    </div>
  );
};

export type { DateRangePickerProps, DateRangePickerPreset, DateRangeValue };

