import type { FC } from "react";
import { SearchInput } from "@/shared/ui";

export interface TransactionsSearchBarProps {
  value: string;
  onChange: (nextValue: string) => void;
  onSearchChangeResetPage: () => void;
}

export const TransactionsSearchBar: FC<TransactionsSearchBarProps> = ({
  value,
  onChange,
  onSearchChangeResetPage,
}) => (
  <SearchInput
    value={value}
    onChange={(event) => {
      onChange(event.currentTarget.value);
      onSearchChangeResetPage();
    }}
    placeholder="Search by Transaction ID"
    className="w-full md:w-[260px]"
  />
);
