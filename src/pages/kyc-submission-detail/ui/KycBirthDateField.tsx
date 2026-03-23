import type { FC } from "react";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";

import { Calendar, DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, Input } from "@/shared/ui";
import { cn } from "@/shared/lib/utils";

import type { KycBirthDateFieldProps } from "./KycBirthDateField.type";
import { parseStoredDate } from "./kyc-submission-identity-fields-utils";

/**
 * Birth date field (dropdown calendar + clear button).
 */
export const KycBirthDateField: FC<KycBirthDateFieldProps> = ({ value, onChange, locked, isEditable }) => {
  const [open, setOpen] = useState(false);
  const selected = useMemo(() => parseStoredDate(value), [value]);
  const display = useMemo(() => {
    if (!selected) return "";
    return format(selected, "dd/MM/yyyy");
  }, [selected]);
  const hasValue = Boolean(display);

  if (locked) {
    return (
      <Input
        id="kyc-identity-birth-date"
        size="md"
        type="text"
        label="Birth Date"
        readOnly
        allowClear={false}
        value={display || "—"}
      />
    );
  }

  return (
    <div className="flex w-full min-w-0 max-w-full flex-col gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">Birth Date</span>
      <div
        className={cn(
          "flex w-full min-w-0 max-w-full overflow-hidden rounded-md border border-input bg-background",
          !isEditable && "opacity-60",
        )}
      >
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <button
              id="kyc-identity-birth-date"
              type="button"
              disabled={!isEditable}
              className="flex h-12 min-w-0 flex-1 items-center gap-2 px-3 text-left text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed"
              aria-expanded={open}
              aria-haspopup="dialog"
            >
              <CalendarIcon className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
              <span className={cn("truncate", !display && "text-muted-foreground")}>
                {display || "Select date"}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-auto p-2" onCloseAutoFocus={(e) => e.preventDefault()}>
            <Calendar
              mode="single"
              selected={selected}
              onSelect={(d) => {
                if (d) {
                  onChange(format(d, "yyyy-MM-dd"));
                } else {
                  onChange(undefined);
                }
                setOpen(false);
              }}
              defaultMonth={selected ?? new Date()}
              captionLayout="dropdown"
              className="w-full [--cell-size:1.75rem] text-sm"
            />
          </DropdownMenuContent>
        </DropdownMenu>
        {isEditable && hasValue ? (
          <button
            type="button"
            className="flex h-12 w-11 shrink-0 items-center justify-center border-l border-input bg-transparent text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0"
            onClick={() => onChange(undefined)}
            aria-label="Clear birth date"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        ) : null}
      </div>
    </div>
  );
};

