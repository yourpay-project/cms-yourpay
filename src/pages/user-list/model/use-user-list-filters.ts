import { useCallback, useMemo, useRef } from "react";
import { useDebouncedValue } from "@/shared/lib";
import { useUserListStore } from "./user-list-store";
import { useUserListQuery } from "./use-user-list-query";
import { USER_STATUS_OPTIONS, USER_GENDER_OPTIONS } from "./constants";

export interface UserListFilterBadge {
  key: string;
  label: string;
  onClear: () => void;
}

/**
 * Encapsulates filter state, query, and derived values for the User Yourpay list page.
 * State is persisted via {@link useUserListStore} (localStorage key: cms-user-yourpay).
 * Country is rendered as buttons (All, BN, HK, …) outside the filters card; status/gender live in the card.
 *
 * @returns Filter state, handlers, badges, query result (users, total, isLoading, isError), and refs for selects
 */
export function useUserListFilters() {
  const {
    pageIndex,
    pageSize,
    country,
    status,
    gender,
    searchInput,
    filtersOpen,
    setPageIndex,
    setPageSize,
    setCountry,
    setStatus,
    setGender,
    setSearchInput,
    setFiltersOpen,
    resetFilters,
  } = useUserListStore();

  const countrySelectRef = useRef<HTMLSelectElement>(null);
  const statusSelectRef = useRef<HTMLSelectElement>(null);
  const genderSelectRef = useRef<HTMLSelectElement>(null);

  const debouncedSearch = useDebouncedValue(searchInput, 400);

  const query = useUserListQuery({
    pageIndex,
    pageSize,
    search: debouncedSearch || undefined,
    status: status !== "all" ? status : undefined,
    gender: gender !== "all" ? gender : undefined,
    country: country !== "ALL" ? country : undefined,
  });

  const handleResetFilters = useCallback(() => {
    resetFilters();
  }, [resetFilters]);

  const badges = useMemo((): UserListFilterBadge[] => {
    const list: UserListFilterBadge[] = [];
    if (status !== "all") {
      const label = USER_STATUS_OPTIONS.find((o) => o.value === status)?.label ?? status;
      list.push({
        key: "status",
        label: `Status: ${label}`,
        onClear: () => {
          setStatus("all");
          setPageIndex(0);
        },
      });
    }
    if (gender !== "all") {
      const label = USER_GENDER_OPTIONS.find((o) => o.value === gender)?.label ?? gender;
      list.push({
        key: "gender",
        label: `Gender: ${label}`,
        onClear: () => {
          setGender("all");
          setPageIndex(0);
        },
      });
    }
    return list;
  }, [status, gender, setStatus, setGender, setPageIndex]);

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
    country,
    setCountry,
    status,
    setStatus,
    gender,
    setGender,
    searchInput,
    setSearchInput,
    filtersOpen,
    setFiltersOpen,
    countrySelectRef,
    statusSelectRef,
    genderSelectRef,
    badges,
    handleResetFilters,
    resetPageIndex,
  };
}
