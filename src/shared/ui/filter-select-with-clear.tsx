import type { FC } from "react";
import { X } from "lucide-react";
import { DropdownFieldTrigger } from "./dropdown-field-trigger";

/** Option for the native select inside {@link FilterSelectWithClear}. */
export interface FilterSelectOption {
  value: string;
  label: string;
}

/** Props for {@link FilterSelectWithClear}. */
export interface FilterSelectWithClearProps {
  label: string;
  value: string;
  options: readonly FilterSelectOption[];
  selectRef: React.RefObject<HTMLSelectElement>;
  onChange: (value: string) => void;
  onClear: () => void;
  /** Value that means "all" / no filter; when equal to `value`, clear button is hidden and chevron shown. */
  allValue?: string;
}

/**
 * Single filter row: native select with optional clear (X) or open (chevron) button.
 * When `value !== allValue` shows X to clear; otherwise shows clickable chevron. Used in KYC and User Yourpay filter cards.
 *
 * @param props - {@link FilterSelectWithClearProps}
 * @returns Filter row (label + select + button)
 */
export const FilterSelectWithClear: FC<FilterSelectWithClearProps> = ({
  label,
  value,
  options,
  selectRef,
  onChange,
  onClear,
  allValue = "all",
}) => {
  const showClear = value !== allValue;
  const selectedOption = options.find((option) => option.value === value);
  const selectedLabel = selectedOption?.label ?? options[0]?.label ?? "";

  return (
    <div>
      <label className="mb-1 block text-xs text-muted-foreground">{label}</label>
      <div className="relative">
        {showClear ? (
          <div className="flex w-full items-center gap-0 rounded-md border border-border bg-background">
            <div className="relative min-w-0 flex-1">
              <DropdownFieldTrigger
                label={selectedLabel}
                className="pointer-events-none rounded-r-none border-0"
                aria-label={`Open ${label}`}
              />
              <select
                ref={selectRef}
                className="absolute inset-0 h-full w-full cursor-pointer appearance-none opacity-0"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                aria-label={label}
              >
                {options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={onClear}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-r-md border-l border-border text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none"
              aria-label={`Clear ${label}`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="relative rounded-md border border-border bg-background">
            <DropdownFieldTrigger
              label={selectedLabel}
              className="pointer-events-none border-0"
              aria-label={`Open ${label}`}
            />
            <select
              ref={selectRef}
              className="absolute inset-0 h-full w-full cursor-pointer appearance-none opacity-0"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              aria-label={label}
            >
              {options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};
