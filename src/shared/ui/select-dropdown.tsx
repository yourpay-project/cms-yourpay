import type { FC } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { DropdownMenu, DropdownMenuTrigger } from "./dropdown-menu";
import { SelectDropdownClearButton } from "./SelectDropdownClearButton";
import { SelectDropdownMenuContent } from "./SelectDropdownMenuContent";

import type { SelectDropdownProps } from "./select-dropdown.type";
import { useSelectDropdownLogic } from "./use-select-dropdown-logic";
import {
  getClearButtonSizeClassName,
  getTriggerSizeClassName,
  shouldShowClearAction,
} from "./select-dropdown-view-model";

/**
 * Generic dropdown selector with optional searchable mode.
 * Uses consistent hover/focus background for editable state and
 * keeps disabled/read-only style visually static.
 */
export const SelectDropdown: FC<SelectDropdownProps> = ({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  disabled = false,
  isLoading = false,
  searchable = false,
  searchPlaceholder = "Start typing to search...",
  allowClear = true,
  id,
  size = "md",
}) => {
  const logic = useSelectDropdownLogic({
    value,
    options,
    placeholder,
    disabled,
    isLoading,
    searchable,
  });

  const triggerSizeClassName = getTriggerSizeClassName(size);
  const clearButtonSizeClassName = getClearButtonSizeClassName(size);

  let clearButtonNode: React.ReactNode = null;
  const canShowClearAction = shouldShowClearAction(allowClear, value);
  if (canShowClearAction) {
    clearButtonNode = (
      <SelectDropdownClearButton
        isDisabled={logic.isDisabled}
        clearButtonSizeClassName={clearButtonSizeClassName}
        onClear={() => onChange("")}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex w-full min-w-0 max-w-full overflow-hidden rounded-md border border-input bg-background",
        logic.isDisabled && "bg-muted/35",
      )}
    >
      <DropdownMenu open={logic.open} onOpenChange={logic.handleOpenChange}>
        <DropdownMenuTrigger asChild>
          <button
            id={id}
            type="button"
            disabled={logic.isDisabled}
            aria-expanded={logic.open}
            aria-haspopup="listbox"
            className={cn(
              "flex min-w-0 flex-1 items-center justify-between gap-2 border-0 bg-transparent px-3 text-left text-sm text-foreground",
              triggerSizeClassName,
              "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0",
              logic.isDisabled && "cursor-not-allowed text-muted-foreground",
            )}
          >
            <span className="truncate">{logic.displayText}</span>
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
          </button>
        </DropdownMenuTrigger>

        <SelectDropdownMenuContent
          searchable={searchable}
          searchPlaceholder={searchPlaceholder}
          search={logic.search}
          options={logic.filteredOptions}
          selectedValue={value}
          isDisabled={logic.isDisabled}
          onSearchChange={logic.setSearch}
          onSelectOption={(nextValue) => {
            onChange(nextValue);
            logic.setOpen(false);
          }}
        />
      </DropdownMenu>

      {clearButtonNode}
    </div>
  );
};

