import type { FC } from "react";
import { useState, useEffect } from "react";
import { Calendar, X } from "lucide-react";
import { DropdownFieldTrigger, DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/shared/ui";
import { cn } from "@/shared/lib/utils";
import { DateRangePickerDropdownContent } from "./DateRangePickerDropdownContent";

interface DateRangePickerWithPresetsProps {
  from: string;
  to: string;
  presetLabel?: string | null;
  onRangeChange: (from: string, to: string, presetLabel?: string) => void;
  label: string;
  className?: string;
}

/**
 * Date range picker with preset shortcuts and custom from/to.
 * Uses DropdownMenu for shadcn-style dropdown.
 */
export const DateRangePickerWithPresets: FC<DateRangePickerWithPresetsProps> = ({
  from,
  to,
  presetLabel,
  onRangeChange,
  label,
  className,
}) => {
  const [open, setOpen] = useState(false);
  const [customFrom, setCustomFrom] = useState(from);
  const [customTo, setCustomTo] = useState(to);

  useEffect(() => {
    if (!open) return;
    setCustomFrom(from);
    setCustomTo(to);
  }, [open, from, to]);

  const displayText =
    presetLabel != null && presetLabel !== ""
      ? presetLabel
      : from && to
        ? `${from} – ${to}`
        : "Select date range";

  const hasValue = !!(from && to);

  const applyCustom = () => {
    if (customFrom && customTo) {
      onRangeChange(customFrom, customTo, undefined);
      setOpen(false);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onRangeChange("", "", undefined);
    setOpen(false);
  };

  const leadingIconNode = (
    <Calendar
      className="h-4 w-4 shrink-0 text-muted-foreground dark:text-muted-foreground"
      aria-hidden
    />
  );

  return (
    <div className={cn("relative", className)}>
      <label className="mb-1 block text-xs text-muted-foreground">{label}</label>
      <div className="flex w-full items-center gap-0 rounded-md border border-border bg-background">
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <DropdownFieldTrigger
              leading={leadingIconNode}
              label={displayText}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" sideOffset={4} className="w-[min(360px,100vw)] p-3">
            <DateRangePickerDropdownContent
              customFrom={customFrom}
              customTo={customTo}
              setCustomFrom={setCustomFrom}
              setCustomTo={setCustomTo}
              onPresetSelect={(f, t, l) => {
                onRangeChange(f, t, l);
                setOpen(false);
              }}
              onApplyCustom={applyCustom}
              onClose={() => setOpen(false)}
            />
          </DropdownMenuContent>
        </DropdownMenu>
        {hasValue ? (
          <button
            type="button"
            onClick={handleClear}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-r-md border-l border-border text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none"
            aria-label="Clear date range"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
};
