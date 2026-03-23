import type { FC } from "react";
import { useEffect, useMemo, useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { SearchInput } from "./search-input";

/**
 * Single option item used by {@link SelectDropdown}.
 */
export interface SelectDropdownOption {
  value: string;
  label: string;
  description?: string;
}

/**
 * Props for {@link SelectDropdown}.
 */
export interface SelectDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectDropdownOption[];
  placeholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  allowClear?: boolean;
  id?: string;
}

/**
 * Generic dropdown selector with optional searchable mode.
 *
 * When `searchable` is true, a search field is rendered on top of the menu
 * and options are filtered by `label`, `value`, and `description`.
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
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!open) {
      setSearch("");
    }
  }, [open]);

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
  const isDisabled = disabled || isLoading;
  const handleOpenChange = (next: boolean) => {
    if (isDisabled) return;
    setOpen(next);
  };

  return (
    <div
      className={cn(
        "flex w-full min-w-0 max-w-full overflow-hidden rounded-md border border-input bg-background",
        isDisabled && "bg-muted/20",
      )}
    >
      <DropdownMenu open={open} onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger asChild>
          <button
            id={id}
            type="button"
            disabled={isDisabled}
            aria-expanded={open}
            aria-haspopup="listbox"
            className={cn(
              "flex h-12 min-w-0 flex-1 items-center justify-between gap-2 border-0 bg-transparent px-3 text-left text-sm text-foreground",
              "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0",
              isDisabled && "cursor-default text-muted-foreground",
            )}
          >
            <span className="truncate">{displayText}</span>
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="z-50 w-[var(--radix-dropdown-menu-trigger-width)] max-w-[min(100vw-2rem,520px)] min-w-0 p-0"
          onCloseAutoFocus={(event) => event.preventDefault()}
        >
          {searchable ? (
            <div className="border-b border-border p-2" onPointerDown={(event) => event.preventDefault()}>
              <SearchInput
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={(event) => event.stopPropagation()}
                placeholder={searchPlaceholder}
                autoFocus
                aria-label="Search options"
              />
            </div>
          ) : null}

          <div className="max-h-64 overflow-y-auto p-1">
            {filteredOptions.length === 0 ? (
              <div className="px-2 py-3 text-sm text-muted-foreground">No results.</div>
            ) : (
              filteredOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  className="cursor-pointer items-start gap-2 py-2"
                  onSelect={() => {
                    if (isDisabled) return;
                    onChange(option.value);
                    setOpen(false);
                  }}
                >
                  <span className="flex w-5 shrink-0 justify-center pt-0.5">
                    {option.value === value ? <Check className="h-4 w-4 text-primary" aria-hidden /> : null}
                  </span>
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span className="text-sm font-medium leading-tight text-foreground">{option.label}</span>
                    {option.description ? (
                      <span className="text-xs leading-snug text-muted-foreground">{option.description}</span>
                    ) : null}
                  </span>
                </DropdownMenuItem>
              ))
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {allowClear && value ? (
        <button
          type="button"
          className="flex h-12 w-11 shrink-0 items-center justify-center border-l border-input bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0"
          disabled={isDisabled}
          onClick={() => onChange("")}
          aria-label="Clear selected option"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
};

