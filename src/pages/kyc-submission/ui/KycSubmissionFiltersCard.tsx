import type { FC } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { Button, Card, CardContent } from "@/shared/ui";
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
  statusSelectRef: React.RefObject<HTMLSelectElement>;
  documentType: string;
  setDocumentType: (v: string) => void;
  documentTypeSelectRef: React.RefObject<HTMLSelectElement>;
  country: string;
  setCountry: (v: string) => void;
  countrySelectRef: React.RefObject<HTMLSelectElement>;
  reverifyStatus: string;
  setReverifyStatus: (v: string) => void;
  reverifySelectRef: React.RefObject<HTMLSelectElement>;
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
