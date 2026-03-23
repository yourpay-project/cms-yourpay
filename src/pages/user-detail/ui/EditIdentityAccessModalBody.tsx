import type { FC, ReactNode } from "react";

import { SearchInput } from "@/shared/ui";
import { normalizeCode } from "../lib";

export interface EditIdentityAccessModalBodyProps {
  search: string;
  onSearchChange: (next: string) => void;
  filteredOptions: Array<{
    code: string;
    isDefault: boolean;
  }>;
  selectedCodeSet: Set<string>;
  isLoading: boolean;
  isError: boolean;
  onToggleCode: (code: string) => void;
  defaultInfoContent?: ReactNode;
}

/**
 * Presentational body for {@link EditIdentityAccessModal}.
 */
export const EditIdentityAccessModalBody: FC<EditIdentityAccessModalBodyProps> = ({
  search,
  onSearchChange,
  filteredOptions,
  selectedCodeSet,
  isLoading,
  isError,
  onToggleCode,
  defaultInfoContent,
}) => {
  const renderEmptyState = (): ReactNode => {
    return <p className="text-sm text-muted-foreground">No identity access found.</p>;
  };

  return (
    <div className="space-y-3 pb-2">
      <div className="rounded-md border border-border/80 bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
        {defaultInfoContent ?? (
          <>
            <p className="font-semibold text-foreground">Default info</p>
            <p className="mt-1">Items marked as (Default) are pre-selected.</p>
          </>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">Identity Access Methods *</p>
        <SearchInput
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Start typing to search..."
        />
      </div>

      <div className="max-h-72 overflow-auto rounded-md border border-border/80 p-3">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading identity access options...</p>
        ) : isError ? (
          <p className="text-sm text-destructive">Failed to load identity access options.</p>
        ) : filteredOptions.length === 0 ? (
          renderEmptyState()
        ) : (
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {filteredOptions.map((option) => {
              const key = normalizeCode(option.code);
              const isChecked = selectedCodeSet.has(key) || option.isDefault;
              const isDisabled = option.isDefault;

              return (
                <label
                  key={option.code}
                  className={`flex items-start gap-2 rounded-md border border-border/70 px-2.5 py-2 ${
                    isDisabled ? "cursor-not-allowed bg-muted/20" : "cursor-pointer hover:bg-muted/30"
                  }`}
                  aria-disabled={isDisabled}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggleCode(option.code)}
                    className={`mt-0.5 h-4 w-4 accent-primary ${
                      isDisabled ? "pointer-events-none opacity-100" : ""
                    }`}
                  />
                  <span className="text-sm text-foreground">
                    {option.code}
                    {option.isDefault ? " (Default)" : ""}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

