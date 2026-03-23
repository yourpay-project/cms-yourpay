import type { FC } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { Button, Card, CardContent, DropdownFieldTrigger } from "@/shared/ui";
import { getFilterBadgeClassName } from "@/shared/lib";
import type { FilterBadge } from "..";
import { KycSubmissionFiltersGrid } from "./KycSubmissionFiltersGrid";

export interface KycSubmissionFiltersCardProps {
  filtersOpen: boolean;
  setFiltersOpen: (v: boolean | ((prev: boolean) => boolean)) => void;
  badges: FilterBadge[];
  handleResetFilters: () => void;
  status: string;
  setStatus: (v: string) => void;
  documentType: string;
  setDocumentType: (v: string) => void;
  country: string;
  setCountry: (v: string) => void;
  reverifyStatus: string;
  setReverifyStatus: (v: string) => void;
  kycFrom: string;
  kycTo: string;
  kycPresetLabel: string | null;
  setKycFrom: (v: string) => void;
  setKycTo: (v: string) => void;
  setKycPresetLabel: (v: string | null) => void;
  lastUpdateFrom: string;
  lastUpdateTo: string;
  lastUpdatePresetLabel: string | null;
  setLastUpdateFrom: (v: string) => void;
  setLastUpdateTo: (v: string) => void;
  setLastUpdatePresetLabel: (v: string | null) => void;
  resetPageIndex: () => void;
}

/**
 * Collapsible filters card for KYC Submissions: header (Filters toggle, badges, Reset) and filter grid when open.
 * Grid includes status, document type, reverify, KYC date range, and last update date range (with presets). Badge colors from {@link getFilterBadgeClassName}.
 *
 * @param props - {@link KycSubmissionFiltersCardProps}
 * @returns Card with toggle, badges, reset, and optional grid
 */
export const KycSubmissionFiltersCard: FC<KycSubmissionFiltersCardProps> = (props) => {
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
          <div className="ml-auto flex flex-wrap items-center justify-end gap-1.5">
            <div className="hidden flex-wrap items-center gap-1.5 sm:flex">
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
            </div>
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
        {filtersOpen && <KycSubmissionFiltersGrid {...props} />}
      </CardContent>
    </Card>
  );
};
