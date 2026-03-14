import type { FC } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { Button, Card, CardContent } from "@/shared/ui";
import { getFilterBadgeClassName } from "@/shared/lib";
import type { UserListFilterBadge } from "../model";
import { UserListFiltersGrid } from "./UserListFiltersGrid";

export interface UserListFiltersCardProps {
  filtersOpen: boolean;
  setFiltersOpen: (v: boolean | ((prev: boolean) => boolean)) => void;
  badges: UserListFilterBadge[];
  handleResetFilters: () => void;
  status: string;
  setStatus: (v: string) => void;
  statusSelectRef: React.RefObject<HTMLSelectElement>;
  gender: string;
  setGender: (v: string) => void;
  genderSelectRef: React.RefObject<HTMLSelectElement>;
  resetPageIndex: () => void;
}

/**
 * Collapsible filters card for User Yourpay: header (Filters toggle, badges, Reset) and filter grid when open.
 * Badge colors from {@link getFilterBadgeClassName}; grid uses {@link FilterSelectWithClear} for status/gender.
 *
 * @param props - {@link UserListFiltersCardProps}
 * @returns Card with toggle, badges, reset, and optional grid
 */
export const UserListFiltersCard: FC<UserListFiltersCardProps> = (props) => {
  const { filtersOpen, setFiltersOpen, badges, handleResetFilters } = props;

  return (
    <Card className="border-border bg-card">
      <CardContent className="p-4">
        <div className="flex w-full flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            className="flex shrink-0 items-center gap-2 text-left text-sm font-medium text-foreground hover:opacity-80"
            onClick={() => setFiltersOpen((v) => !v)}
            aria-expanded={filtersOpen}
          >
            Filters
            {filtersOpen ? (
              <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
            ) : (
              <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
            )}
          </button>
          <div className="ml-auto flex shrink-0 flex-wrap items-center justify-end gap-1.5">
            {badges.map((b) => (
              <span key={b.key} className={getFilterBadgeClassName(b.key)}>
                {b.label}
                <button
                  type="button"
                  className="rounded p-0.5 hover:bg-muted hover:text-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    b.onClear();
                  }}
                  aria-label={`Remove ${b.label}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            <Button
              variant="ghost"
              size="sm"
              type="button"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={handleResetFilters}
            >
              Reset
            </Button>
          </div>
        </div>
        {filtersOpen && <UserListFiltersGrid {...props} />}
      </CardContent>
    </Card>
  );
};
