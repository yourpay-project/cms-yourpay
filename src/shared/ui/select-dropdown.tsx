import type { FC } from "react";
import { Check, ChevronDown, X } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";
import { SearchInput } from "./search-input";

import type { SelectDropdownProps } from "./select-dropdown.type";
import { useSelectDropdownLogic } from "./use-select-dropdown-logic";

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

  let triggerSizeClassName = "h-12";
  if (size === "sm") {
    triggerSizeClassName = "h-8";
  }

  let clearButtonSizeClassName = "h-12 w-11";
  if (size === "sm") {
    clearButtonSizeClassName = "h-8 w-7";
  }

  const searchNode = searchable ? (
    <div
      className="border-b border-border p-2"
      onPointerDown={(event) => event.preventDefault()}
    >
      <SearchInput
        value={logic.search}
        onChange={(event) => logic.setSearch(event.target.value)}
        onKeyDown={(event) => event.stopPropagation()}
        placeholder={searchPlaceholder}
        autoFocus
        aria-label="Search options"
      />
    </div>
  ) : null;

  let optionsNode: React.ReactNode = (
    <div className="px-2 py-3 text-sm text-muted-foreground">No results.</div>
  );
  if (logic.filteredOptions.length > 0) {
    optionsNode = logic.filteredOptions.map((option) => {
      const isSelected = option.value === value;
      const selectedIconNode = isSelected ? (
        <Check className="h-4 w-4 text-primary" aria-hidden />
      ) : null;

      const descriptionNode = option.description ? (
        <span className="text-xs leading-snug text-muted-foreground">
          {option.description}
        </span>
      ) : null;

      return (
        <DropdownMenuItem
          key={option.value}
          className="cursor-pointer items-start gap-2 py-2"
          onSelect={() => {
            if (logic.isDisabled) return;
            onChange(option.value);
            logic.setOpen(false);
          }}
        >
          <span className="flex w-5 shrink-0 justify-center pt-0.5">
            {selectedIconNode}
          </span>
          <span className="flex min-w-0 flex-col gap-0.5">
            <span className="text-sm font-medium leading-tight text-foreground">
              {option.label}
            </span>
            {descriptionNode}
          </span>
        </DropdownMenuItem>
      );
    });
  }

  const shouldShowClear = allowClear && Boolean(value);
  const clearButtonNode = shouldShowClear ? (
    <button
      type="button"
      className={cn(
        "flex shrink-0 items-center justify-center border-l border-input bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0",
        clearButtonSizeClassName,
        logic.isDisabled &&
          "cursor-not-allowed hover:bg-transparent hover:text-muted-foreground"
      )}
      disabled={logic.isDisabled}
      onClick={() => onChange("")}
      aria-label="Clear selected option"
    >
      <X className="h-4 w-4" />
    </button>
  ) : null;

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

        <DropdownMenuContent
          align="start"
          className="z-50 w-[var(--radix-dropdown-menu-trigger-width)] max-w-[min(100vw-2rem,520px)] min-w-0 p-0"
          onCloseAutoFocus={(event) => event.preventDefault()}
        >
          {searchNode}

          <div className="max-h-64 overflow-y-auto p-1">
            {optionsNode}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {clearButtonNode}
    </div>
  );
};

