import type { FC } from "react";
import { FilterSelectWithClear } from "@/shared/ui";
import type { UserListDynamicFilterField } from "..";

export interface UserListFiltersGridProps {
  filterFields: readonly UserListDynamicFilterField[];
  selectedFilterValues: Record<string, string>;
  onChangeFilter: (key: string, value: string) => void;
}

/**
 * Normalized render item for User Yourpay filter controls.
 */
type UserListGridItem = {
  type: "filter";
  key: string;
  field: UserListDynamicFilterField;
};

/**
 * Grid of User Yourpay filter controls rendered using one loop + switch.
 *
 * @param props - {@link UserListFiltersGridProps}
 * @returns Two-column responsive options filter grid.
 */
export const UserListFiltersGrid: FC<UserListFiltersGridProps> = (props) => {
  const gridItems: UserListGridItem[] = props.filterFields.map((field) => ({
    type: "filter",
    key: `filter:${field.key}`,
    field,
  }));

  return (
    <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
      {gridItems.map((item) => {
        switch (item.type) {
          case "filter": {
            const { field } = item;
            return (
              <FilterSelectWithClear
                key={item.key}
                label={field.label}
                value={props.selectedFilterValues[field.key] ?? field.allValue}
                options={field.options}
                onChange={(value) => props.onChangeFilter(field.key, value)}
                onClear={() => props.onChangeFilter(field.key, field.allValue)}
                allValue={field.allValue}
              />
            );
          }
          default:
            return null;
        }
      })}
    </div>
  );
};
