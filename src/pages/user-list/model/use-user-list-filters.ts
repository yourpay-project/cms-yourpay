import { useCallback, useMemo } from "react";
import { useDebouncedValue } from "@/shared/lib";
import type { FilterSelectOption, FilterType } from "@/shared/ui";
import { useUserListStore } from "./user-list-store";
import { useUserListQuery } from "./use-user-list-query";

/** UI-ready dynamic filter descriptor for the User Yourpay page. */
export interface UserListDynamicFilterField {
  key: string;
  label: string;
  type: FilterType;
  options: readonly FilterSelectOption[];
  allValue: string;
}

/** Active filter badge model rendered in the filters card header. */
export interface UserListFilterBadge {
  id: string;
  name: string;
  valueLabel: string;
  onClear: () => void;
}

function formatFilterKeyLabel(key: string): string {
  return key
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

/**
 * Encapsulates filter state, query, and derived values for the User Yourpay list page.
 * State is persisted via {@link useUserListStore} (localStorage key: cms-user-yourpay).
 * Filter controls are dynamically derived from backend-provided `filters` metadata.
 *
 * @returns Filter state, dynamic filter descriptors, badges, and users query state
 */
export function useUserListFilters() {
  const {
    pageIndex,
    pageSize,
    filterValues,
    searchInput,
    filtersOpen,
    setPageIndex,
    setPageSize,
    setFilterValue,
    setSearchInput,
    setFiltersOpen,
    resetFilters,
  } = useUserListStore();

  const debouncedSearch = useDebouncedValue(searchInput, 400);

  const query = useUserListQuery({
    pageIndex,
    pageSize,
    search: debouncedSearch || undefined,
    filters: filterValues,
  });

  const handleResetFilters = useCallback(() => {
    resetFilters();
  }, [resetFilters]);

  const filterFields = useMemo((): UserListDynamicFilterField[] => {
    const filterDefinitions = query.data?.filterDefinitions;
    if (filterDefinitions && filterDefinitions.length > 0) {
      return filterDefinitions.map((definition) => {
        const normalizedOptions: FilterSelectOption[] = definition.options.map((option) => ({
          value: option.value,
          label: option.label,
        }));

        const allValue =
          normalizedOptions.find((option) => option.label.toLowerCase() === "all")?.value ?? "";

        return {
          key: definition.key,
          label: definition.name?.trim() ? definition.name : formatFilterKeyLabel(definition.key),
          type: definition.type,
          options: normalizedOptions,
          allValue,
        };
      });
    }

    const filtersMeta = query.data?.filters;
    if (!filtersMeta || Object.keys(filtersMeta).length === 0) {
      return [];
    }

    return Object.entries(filtersMeta).map(([key, options]) => {
      const normalizedOptions: FilterSelectOption[] = options.map((option) => ({
        value: option.value,
        label: option.label,
      }));

      const allValue =
        normalizedOptions.find((option) => option.label.toLowerCase() === "all")?.value ?? "";

      return {
        key,
        label: formatFilterKeyLabel(key),
        type: "options",
        options: normalizedOptions,
        allValue,
      };
    });
  }, [query.data?.filterDefinitions, query.data?.filters]);

  const controlFilterFields = useMemo(
    () => filterFields.filter((field) => field.type === "control"),
    [filterFields]
  );

  const optionsFilterFields = useMemo(
    () => filterFields.filter((field) => field.type === "options"),
    [filterFields]
  );
  const hasBackendFilters = filterFields.length > 0;

  const selectedFilterValues = useMemo((): Record<string, string> => {
    return filterFields.reduce<Record<string, string>>((accumulator, field) => {
      accumulator[field.key] = filterValues[field.key] ?? field.allValue;
      return accumulator;
    }, {});
  }, [filterFields, filterValues]);

  const badges = useMemo((): UserListFilterBadge[] => {
    const list: UserListFilterBadge[] = [];

    for (const field of filterFields) {
      const selectedValue = selectedFilterValues[field.key];
      if (selectedValue === field.allValue) {
        continue;
      }

      const selectedOption = field.options.find((option) => option.value === selectedValue);
      list.push({
        id: `${field.key}:${selectedValue}`,
        name: field.label,
        valueLabel: selectedOption?.label ?? selectedValue,
        onClear: () => {
          setFilterValue(field.key, field.allValue);
        },
      });
    }

    return list;
  }, [filterFields, selectedFilterValues, setFilterValue]);

  const handleChangeFilter = useCallback(
    (key: string, value: string) => {
      setFilterValue(key, value);
    },
    [setFilterValue]
  );

  const resetPageIndex = useCallback(() => setPageIndex(0), [setPageIndex]);

  const users = query.data?.data ?? [];
  const total = query.data?.total ?? 0;

  return {
    ...query,
    users,
    total,
    pageIndex,
    pageSize,
    setPageIndex,
    setPageSize,
    filterFields,
    controlFilterFields,
    optionsFilterFields,
    hasBackendFilters,
    selectedFilterValues,
    setFilterValue,
    handleChangeFilter,
    searchInput,
    setSearchInput,
    filtersOpen,
    setFiltersOpen,
    badges,
    handleResetFilters,
    resetPageIndex,
  };
}
