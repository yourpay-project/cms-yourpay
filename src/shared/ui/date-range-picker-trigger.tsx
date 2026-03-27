import type { FC, MouseEvent as ReactMouseEvent, ReactNode } from "react";
import { Calendar as CalendarIcon, X } from "lucide-react";

import {
  DropdownFieldTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/shared/ui";
import { cn } from "@/shared/lib/utils";

import { DateRangePickerDropdownContent } from "./date-range-picker-dropdown-content";
import type { DateRangePickerPreset } from "./date-range-picker.type";

export interface DateRangePickerTriggerProps {
  triggerId: string;
  label: string;
  disabled: boolean;
  open: boolean;
  onOpenChange: (nextOpen: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  displayText: string;
  allowClear: boolean;
  hasValue: boolean;
  onClear: (e: ReactMouseEvent<HTMLButtonElement>) => void;
  presets?: readonly DateRangePickerPreset[];
  defaultMonth: Date;
  selectedRange: { from: Date; to?: Date } | undefined;
  onSelect: (range: { from: Date | undefined; to?: Date | undefined } | undefined) => void;
  onClearCustom: () => void;
  onToday: () => void;
  onCancel: () => void;
  onApplyCustom: () => void;
  onPresetApply: (from: string, to: string, presetLabel: string) => void;
  onPresetCancel: () => void;
  className?: string;
}

/**
 * Dropdown trigger + menu for {@link DateRangePicker}.
 *
 * @param props - {@link DateRangePickerTriggerProps}
 * @returns Trigger row with dropdown content and optional clear button.
 */
export const DateRangePickerTrigger: FC<DateRangePickerTriggerProps> = ({
  triggerId,
  label,
  disabled,
  open,
  onOpenChange,
  triggerRef,
  displayText,
  allowClear,
  hasValue,
  onClear,
  presets,
  defaultMonth,
  selectedRange,
  onSelect,
  onClearCustom,
  onToday,
  onCancel,
  onApplyCustom,
  onPresetApply,
  onPresetCancel,
  className,
}) => {
  const leadingIconNode = (
    <CalendarIcon
      className="h-4 w-4 shrink-0 text-muted-foreground dark:text-muted-foreground"
      aria-hidden
    />
  );

  let clearButtonNode: ReactNode = null;
  if (allowClear && hasValue) {
    clearButtonNode = (
      <button
        type="button"
        onClick={onClear}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-r-md border-l border-border text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
        aria-label={`Clear ${label}`}
        disabled={disabled}
      >
        <X className="h-4 w-4" />
      </button>
    );
  }

  return (
    <div
      className={cn(
        "flex w-full items-center gap-0 rounded-md border border-border bg-background",
        disabled && "bg-muted/35",
        className
      )}
    >
      <DropdownMenu open={open} onOpenChange={onOpenChange}>
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

        <DropdownMenuContent
          align="start"
          sideOffset={4}
          className="w-[min(360px,100vw)] p-3"
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            triggerRef.current?.blur();
          }}
        >
          <DateRangePickerDropdownContent
            presets={presets}
            disabled={disabled}
            defaultMonth={defaultMonth}
            selectedRange={selectedRange}
            onSelect={onSelect}
            onClearCustom={onClearCustom}
            onToday={onToday}
            onCancel={onCancel}
            onApplyCustom={onApplyCustom}
            onPresetApply={onPresetApply}
            onPresetCancel={onPresetCancel}
          />
        </DropdownMenuContent>
      </DropdownMenu>

      {clearButtonNode}
    </div>
  );
};

