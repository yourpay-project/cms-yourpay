import type { FC, ReactNode } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { getFilterBadgeClassName, cn } from "@/shared/lib";
import { Button } from "./button";
import { Card, CardContent } from "./card";
import { DropdownFieldTrigger } from "./dropdown-field-trigger";

/**
 * Canonical badge model rendered by {@link FilterCard}.
 */
export interface FilterCardBadge {
  id: string;
  badgeKey: string;
  label: string;
  onClear: () => void;
}

/**
 * Shared collapsible filter header/card wrapper used by list pages.
 * It centralizes toggle, badge rendering, and reset action UI.
 */
export interface FilterCardProps {
  filtersOpen: boolean;
  setFiltersOpen: (v: boolean | ((prev: boolean) => boolean)) => void;
  badges: readonly FilterCardBadge[];
  onReset: () => void;
  children?: ReactNode;
  badgesClassName?: string;
}

/**
 * Reusable filter card layout used by Transactions, KYC, Users, and Fee Config pages.
 *
 * @param props - {@link FilterCardProps}
 * @returns Collapsible card with shared header controls and custom body content.
 */
export const FilterCard: FC<FilterCardProps> = ({
  filtersOpen,
  setFiltersOpen,
  badges,
  onReset,
  children,
  badgesClassName,
}) => {
  let toggleIconNode = (
    <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
  );
  if (filtersOpen) {
    toggleIconNode = (
      <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
    );
  }

  let bodyNode: ReactNode = null;
  if (filtersOpen) {
    bodyNode = children;
  }

  return (
    <Card className="border-border bg-card">
      <CardContent className="p-4">
        <div className="flex w-full flex-wrap items-center justify-between gap-2">
          <DropdownFieldTrigger
            label="Filters"
            className="h-auto w-auto shrink-0 rounded-none px-0 py-0 text-sm font-medium hover:bg-transparent hover:opacity-80 focus:bg-transparent focus-visible:bg-transparent aria-[expanded=true]:bg-transparent focus:ring-0 focus:ring-offset-0"
            onClick={() => setFiltersOpen((v) => !v)}
            aria-expanded={filtersOpen}
            trailing={toggleIconNode}
          />
          <div className="ml-auto flex shrink-0 flex-wrap items-center justify-end gap-1.5">
            <div
              className={cn(
                "flex flex-wrap items-center gap-1.5",
                badgesClassName
              )}
            >
              {badges.map((badge) => (
                <span key={badge.id} className={getFilterBadgeClassName(badge.badgeKey)}>
                  {badge.label}
                  <button
                    type="button"
                    className="rounded p-0.5 hover:bg-muted hover:text-foreground"
                    onClick={(event) => {
                      event.stopPropagation();
                      badge.onClear();
                    }}
                    aria-label={`Remove ${badge.label}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              type="button"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={onReset}
            >
              Reset
            </Button>
          </div>
        </div>
        {bodyNode}
      </CardContent>
    </Card>
  );
};
