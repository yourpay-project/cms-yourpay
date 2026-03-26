import type { FC, MouseEvent as ReactMouseEvent } from "react";
import { Calendar, Button, DropdownMenuContent } from "@/shared/ui";

interface DatePickerMenuContentProps {
  disabled: boolean;
  allowClear: boolean;
  hasValue: boolean;
  selectedDate: Date | undefined;
  onSelectDate: (next: Date | undefined) => void;
  onClear: (event: ReactMouseEvent<HTMLButtonElement>) => void;
  onCancel: () => void;
  onApply: () => void;
  onCloseAutoFocus: (event: Event) => void;
}

/**
 * Dropdown content for single-date picker (calendar + footer actions).
 *
 * @param props - {@link DatePickerMenuContentProps}
 * @returns Date picker dropdown content element.
 */
export const DatePickerMenuContent: FC<DatePickerMenuContentProps> = ({
  disabled,
  allowClear,
  hasValue,
  selectedDate,
  onSelectDate,
  onClear,
  onCancel,
  onApply,
  onCloseAutoFocus,
}) => {
  let inlineClearNode: React.ReactNode = null;
  if (allowClear && hasValue) {
    inlineClearNode = (
      <Button type="button" variant="ghost" size="sm" onClick={onClear}>
        Clear
      </Button>
    );
  }

  return (
    <DropdownMenuContent
      align="start"
      sideOffset={4}
      className="w-[min(360px,100vw)] p-3"
      onCloseAutoFocus={onCloseAutoFocus}
    >
      <div className="space-y-2">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onSelectDate}
          captionLayout="label"
          numberOfMonths={1}
          className="w-full [--cell-size:1.5rem] text-sm"
          disabled={disabled}
        />

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex gap-2">{inlineClearNode}</div>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="button" size="sm" onClick={onApply} disabled={disabled}>
              Apply
            </Button>
          </div>
        </div>
      </div>
    </DropdownMenuContent>
  );
};

