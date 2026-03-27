import type { FC, MouseEvent as ReactMouseEvent } from "react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { DropdownFieldTrigger, DropdownMenu, DropdownMenuTrigger } from "@/shared/ui";
import { cn } from "@/shared/lib/utils";

import type { DatePickerProps } from "./date-picker.type";
import { formatDateDisplay, toYYYYMMDD } from "./date-picker.lib";
import { DatePickerMenuContent } from "./date-picker-menu-content";
import { resolveSelectedDate, shouldShowClearAction } from "./date-picker-view-model";

/**
 * Generic single date picker using a dropdown + shadcn-style Calendar.
 * Controlled with `value` (`yyyy-MM-dd`) and emits `""` when cleared.
 * Read-only/disabled state keeps static background and blocks opening.
 * Closing the popup removes trigger focus ring to avoid sticky visual state.
 *
 * @param props - {@link DatePickerProps}
 * @returns Date picker field
 */
export const DatePicker: FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  className,
  placeholder = "Select date",
  allowClear = true,
  disabled = false,
  displayFormat,
}) => {
  const triggerId = useId().replace(/:/g, "");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [customDate, setCustomDate] = useState(value);

  useEffect(() => {
    if (!open) return;
    setCustomDate(value);
  }, [open, value]);

  useEffect(() => {
    if (disabled) {
      setOpen(false);
    }
  }, [disabled]);

  const displayText = useMemo(() => formatDateDisplay({ value, placeholder, displayFormat }), [displayFormat, placeholder, value]);
  const hasValue = Boolean(value);

  const handleClear = (e: ReactMouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    onChange("");
    setOpen(false);
  };

  const handleApply = () => {
    if (!customDate) {
      onChange("");
      setOpen(false);
      return;
    }
    onChange(customDate);
    setOpen(false);
  };

  const selectedDate = useMemo(() => resolveSelectedDate(customDate), [customDate]);

  // `Calendar` is controlled via `selected` and `onSelect`.
  const handleSelect = (next: Date | undefined) => {
    if (!next) {
      setCustomDate("");
      return;
    }
    setCustomDate(toYYYYMMDD(next));
  };

  const leadingIconNode = (
    <CalendarIcon
      className="h-4 w-4 shrink-0 text-muted-foreground dark:text-muted-foreground"
      aria-hidden
    />
  );

  let trailingClearNode: React.ReactNode = null;
  const canShowClearAction = shouldShowClearAction(allowClear, hasValue);
  if (canShowClearAction) {
    trailingClearNode = (
      <button
        type="button"
        onClick={handleClear}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-r-md border-l border-border text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none disabled:cursor-not-allowed"
        aria-label={`Clear ${label}`}
        disabled={disabled}
      >
        <X className="h-4 w-4" aria-hidden />
      </button>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <label htmlFor={triggerId} className="mb-1 block text-xs text-muted-foreground">
        {label}
      </label>

      <div className={cn("flex w-full items-center gap-0 rounded-md border border-border bg-background", disabled && "bg-muted/35")}>
        <DropdownMenu
          open={open}
          onOpenChange={(nextOpen) => {
            if (disabled) return;
            setOpen(nextOpen);
            if (!nextOpen) triggerRef.current?.blur();
          }}
        >
          <DropdownMenuTrigger asChild>
            <DropdownFieldTrigger
              ref={triggerRef}
              id={triggerId}
              leading={leadingIconNode}
              label={displayText}
              aria-label={label}
              disabled={disabled}
              className="h-8"
            />
          </DropdownMenuTrigger>

          <DatePickerMenuContent
            disabled={disabled}
            allowClear={allowClear}
            hasValue={hasValue}
            selectedDate={selectedDate}
            onSelectDate={handleSelect}
            onClear={handleClear}
            onCancel={() => setOpen(false)}
            onApply={handleApply}
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              triggerRef.current?.blur();
            }}
          />
        </DropdownMenu>

        {trailingClearNode}
      </div>
    </div>
  );
};

export type { DatePickerProps };

