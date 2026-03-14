import type { FC } from "react";
import { ChevronDown, X } from "lucide-react";

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

  return (
    <div>
      <label className="mb-1 block text-xs text-muted-foreground">{label}</label>
      <div className="relative flex rounded-md border border-border bg-background">
        <select
          ref={selectRef}
          className="w-full flex-1 appearance-none rounded-md border-0 bg-transparent px-3 py-2 pr-9 text-sm text-foreground [&>option]:bg-background [&>option]:text-foreground"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {showClear ? (
          <button
            type="button"
            onClick={onClear}
            className="flex w-9 shrink-0 items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label={`Clear ${label}`}
          >
            <X className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => selectRef.current?.click()}
            className="flex w-9 shrink-0 items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label={`Open ${label}`}
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};
