import type { FC } from "react";
import { SearchInput } from "@/shared/ui";

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
      <SearchInput
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
          onSearchChangeResetPage();
        }}
        placeholder="Search by name/phone/ARC number"
        containerClassName="w-full shrink-0 sm:w-72"
        className="h-10 rounded-lg border border-border bg-background pr-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      />
    </div>
  );
};
