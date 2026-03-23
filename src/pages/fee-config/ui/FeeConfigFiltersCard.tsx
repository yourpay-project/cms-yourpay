import type { FC } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";

import { Button, Card, CardContent, DropdownFieldTrigger } from "@/shared/ui";
import type { FeeStatusFilter, FeeTypeFilter } from "../model";
import type { FeeConfigFilterBadge } from "../model";
import { getFilterBadgeClassName } from "@/shared/lib";
import { FeeConfigFiltersGrid } from "./FeeConfigFiltersGrid";

export interface FeeConfigFiltersCardProps {
  filtersOpen: boolean;
  setFiltersOpen: (v: boolean | ((prev: boolean) => boolean)) => void;
  status: FeeStatusFilter;
  setStatus: (v: FeeStatusFilter) => void;
  feeType: FeeTypeFilter;
  setFeeType: (v: FeeTypeFilter) => void;
  service: string;
  setService: (v: string) => void;
  serviceOptions: readonly { value: string; label: string }[];
  badges: FeeConfigFilterBadge[];
  handleResetFilters: () => void;
}

/**
 * Collapsible filters card for Fee Config page.
 *
 * @param props - {@link FeeConfigFiltersCardProps}
 * @returns Card with Filters toggle, reset action, and optional filter grid
 */
export const FeeConfigFiltersCard: FC<FeeConfigFiltersCardProps> = (props) => {
  const { filtersOpen, setFiltersOpen, badges, handleResetFilters } = props;

  return (
    <Card className="border-border bg-card">
      <CardContent className="p-4">
        <div className="flex w-full flex-wrap items-center justify-between gap-2">
          <DropdownFieldTrigger
            label="Filters"
            className="h-auto w-auto shrink-0 rounded-none px-0 py-0 text-sm font-medium hover:bg-transparent hover:opacity-80 focus:ring-0 focus:ring-offset-0"
            onClick={() => setFiltersOpen((v) => !v)}
            aria-expanded={filtersOpen}
            trailing={
              filtersOpen ? (
                <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
              ) : (
                <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
              )
            }
          />
          <div className="ml-auto flex shrink-0 flex-wrap items-center justify-end gap-1.5">
            {badges.map((b) => (
              <span key={b.id} className={getFilterBadgeClassName(b.key)}>
                {b.label}: {b.valueLabel}
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

        {filtersOpen && (
          <FeeConfigFiltersGrid
            status={props.status}
            setStatus={props.setStatus}
            feeType={props.feeType}
            setFeeType={props.setFeeType}
            service={props.service}
            setService={props.setService}
            serviceOptions={props.serviceOptions}
          />
        )}
      </CardContent>
    </Card>
  );
};


