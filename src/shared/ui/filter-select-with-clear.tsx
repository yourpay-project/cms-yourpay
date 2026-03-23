import type { FC } from "react";
import { useId } from "react";

import { SelectDropdown } from "./select-dropdown";
import type { SelectDropdownOption } from "./select-dropdown.type";

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
  onChange,
  onClear,
  allValue = "all",
}) => {
  // `useId()` contains `:` in React 18, which some a11y engines may fail to match reliably.
  const selectId = useId().replace(/:/g, "");
  const showClear = value !== allValue;
  const selectedOption = options.find((option) => option.value === value);
  const placeholder = selectedOption?.label ?? options[0]?.label ?? "Select an option";
  const dropdownOptions: SelectDropdownOption[] = options.map((o) => ({
    value: o.value,
    label: o.label,
  }));

  return (
    <div>
      <label htmlFor={selectId} className="mb-1 block text-xs text-muted-foreground">
        {label}
      </label>
      <SelectDropdown
        id={selectId}
        value={value}
        onChange={(next) => {
          // `SelectDropdown` clears by emitting `""`.
          if (next === "") {
            onClear();
            return;
          }
          onChange(next);
        }}
        options={dropdownOptions}
        placeholder={placeholder}
        allowClear={showClear}
        size="sm"
        searchable={false}
      />
    </div>
  );
};
