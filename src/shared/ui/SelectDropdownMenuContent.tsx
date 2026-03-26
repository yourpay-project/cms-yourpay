import type { FC } from "react";
import { Check } from "lucide-react";
import { DropdownMenuContent, DropdownMenuItem } from "./dropdown-menu";
import { SearchInput } from "./search-input";
import type { SelectDropdownOption } from "./select-dropdown.type";

interface SelectDropdownMenuContentProps {
  searchable: boolean;
  searchPlaceholder: string;
  search: string;
  options: SelectDropdownOption[];
  selectedValue: string;
  isDisabled: boolean;
  onSearchChange: (next: string) => void;
  onSelectOption: (value: string) => void;
}

/**
 * Dropdown content for {@link SelectDropdown} (search + options list).
 *
 * @param props - {@link SelectDropdownMenuContentProps}
 * @returns Menu content section with optional search and options.
 */
export const SelectDropdownMenuContent: FC<SelectDropdownMenuContentProps> = ({
  searchable,
  searchPlaceholder,
  search,
  options,
  selectedValue,
  isDisabled,
  onSearchChange,
  onSelectOption,
}) => {
  let searchNode: React.ReactNode = null;
  if (searchable) {
    searchNode = (
      <div
        className="border-b border-border p-2"
        onPointerDown={(event) => event.preventDefault()}
      >
        <SearchInput
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          onKeyDown={(event) => event.stopPropagation()}
          placeholder={searchPlaceholder}
          autoFocus
          aria-label="Search options"
        />
      </div>
    );
  }

  let optionsNode: React.ReactNode = (
    <div className="px-2 py-3 text-sm text-muted-foreground">No results.</div>
  );
  if (options.length > 0) {
    optionsNode = options.map((option) => {
      const isSelected = option.value === selectedValue;

      let selectedIconNode: React.ReactNode = null;
      if (isSelected) {
        selectedIconNode = <Check className="h-4 w-4 text-primary" aria-hidden />;
      }

      let descriptionNode: React.ReactNode = null;
      if (option.description) {
        descriptionNode = (
          <span className="text-xs leading-snug text-muted-foreground">
            {option.description}
          </span>
        );
      }

      return (
        <DropdownMenuItem
          key={option.value}
          className="cursor-pointer items-start gap-2 py-2"
          onSelect={() => {
            if (isDisabled) {
              return;
            }
            onSelectOption(option.value);
          }}
        >
          <span className="flex w-5 shrink-0 justify-center pt-0.5">{selectedIconNode}</span>
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

  return (
    <DropdownMenuContent
      align="start"
      className="z-50 w-[var(--radix-dropdown-menu-trigger-width)] max-w-[min(100vw-2rem,520px)] min-w-0 p-0"
      onCloseAutoFocus={(event) => event.preventDefault()}
    >
      {searchNode}
      <div className="max-h-64 overflow-y-auto p-1">{optionsNode}</div>
    </DropdownMenuContent>
  );
};

