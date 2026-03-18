import type { FC } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import { Button, Card, CardContent, DropdownFieldTrigger } from "@/shared/ui";
import type { FeeStatusFilter, FeeTypeFilter } from "../model";
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
  statusSelectRef: React.RefObject<HTMLSelectElement>;
  feeTypeSelectRef: React.RefObject<HTMLSelectElement>;
  serviceSelectRef: React.RefObject<HTMLSelectElement>;
  serviceOptions: readonly { value: string; label: string }[];
  resetPageIndex: () => void;
}

/**
 * Collapsible filters card for Fee Config page.
 *
 * @param props - {@link FeeConfigFiltersCardProps}
 * @returns Card with Filters toggle, reset action, and optional filter grid
 */
export const FeeConfigFiltersCard: FC<FeeConfigFiltersCardProps> = (props) => {
  const { filtersOpen, setFiltersOpen } = props;

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
            <Button
              variant="ghost"
              size="sm"
              type="button"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => {
                props.setStatus("all");
                props.setFeeType("all");
                props.setService("");
                props.resetPageIndex();
              }}
            >
              Reset
            </Button>
          </div>
        </div>

        {filtersOpen && (
          <FeeConfigFiltersGrid
            status={props.status}
            setStatus={props.setStatus}
            statusSelectRef={props.statusSelectRef}
            feeType={props.feeType}
            setFeeType={props.setFeeType}
            feeTypeSelectRef={props.feeTypeSelectRef}
            service={props.service}
            setService={props.setService}
            serviceSelectRef={props.serviceSelectRef}
            serviceOptions={props.serviceOptions}
            resetPageIndex={props.resetPageIndex}
          />
        )}
      </CardContent>
    </Card>
  );
};


