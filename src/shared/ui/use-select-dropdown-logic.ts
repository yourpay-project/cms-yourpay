import { useEffect, useMemo, useState } from "react";

import type { SelectDropdownOption } from "./select-dropdown.type";

export interface UseSelectDropdownLogicParams {
  value: string;
  options: SelectDropdownOption[];
  placeholder: string;
  disabled: boolean;
  isLoading: boolean;
  searchable: boolean;
}

export interface UseSelectDropdownLogicResult {
  open: boolean;
  setOpen: (next: boolean) => void;
  search: string;
  setSearch: (next: string) => void;
  isDisabled: boolean;
  selected?: SelectDropdownOption;
  filteredOptions: SelectDropdownOption[];
  displayText: string;
  handleOpenChange: (nextOpen: boolean) => void;
}

/**
 * Centralizes state + derived filtering for `SelectDropdown`.
 */
export function useSelectDropdownLogic(params: UseSelectDropdownLogicParams): UseSelectDropdownLogicResult {
  const { value, options, placeholder, disabled, isLoading, searchable } = params;

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!open) setSearch("");
  }, [open]);

  const isDisabled = disabled || isLoading;

  const selected = useMemo(() => options.find((option) => option.value === value), [options, value]);

  const filteredOptions = useMemo(() => {
    if (!searchable) return options;

    const query = search.trim().toLowerCase();
    if (!query) return options;

    return options.filter((option) => {
      return (
        option.value.toLowerCase().includes(query) ||
        option.label.toLowerCase().includes(query) ||
        (option.description ?? "").toLowerCase().includes(query)
      );
    });
  }, [options, search, searchable]);

  const displayText = selected?.label ?? (isLoading ? "Loading..." : placeholder);

  const handleOpenChange = (nextOpen: boolean) => {
    if (isDisabled) return;
    setOpen(nextOpen);
  };

  return {
    open,
    setOpen,
    search,
    setSearch,
    isDisabled,
    selected,
    filteredOptions,
    displayText,
    handleOpenChange,
  };
}

