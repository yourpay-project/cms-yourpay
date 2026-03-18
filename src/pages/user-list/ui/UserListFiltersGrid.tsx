import type { FC } from "react";
import { FilterOptionsGrid } from "@/shared/ui";
import type { UserListDynamicFilterField } from "..";

export interface UserListFiltersGridProps {
  filterFields: readonly UserListDynamicFilterField[];
  selectedFilterValues: Record<string, string>;
  onChangeFilter: (key: string, value: string) => void;
}

/**
 * Grid of dynamic filter controls rendered from backend-provided metadata.
 */
export const UserListFiltersGrid: FC<UserListFiltersGridProps> = (props) => {
  return (
    <FilterOptionsGrid
      fields={props.filterFields}
      values={props.selectedFilterValues}
      onChange={props.onChangeFilter}
    />
  );
};
