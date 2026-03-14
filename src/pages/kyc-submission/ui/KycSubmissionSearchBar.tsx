import type { FC } from "react";
import { Search } from "lucide-react";
import { Input } from "@/shared/ui";

interface KycSubmissionSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearchChangeResetPage: () => void;
}

/**
 * Search input for KYC list (name, mobile, document). Resets page index on change.
 */
export const KycSubmissionSearchBar: FC<KycSubmissionSearchBarProps> = ({
  value,
  onChange,
  onSearchChangeResetPage,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-end gap-3">
      <div className="relative w-full shrink-0 sm:w-72">
        <Search
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            onSearchChangeResetPage();
          }}
          placeholder="Search by name, mobile, document..."
          className="h-10 rounded-lg border border-border bg-background pl-10 pr-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>
    </div>
  );
};
