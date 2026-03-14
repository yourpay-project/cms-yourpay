import { useState, useCallback, useRef, useMemo } from "react";
import { useDebouncedValue } from "@/shared/lib";
import { useUserListQuery } from "./use-user-list-query";
import { USER_STATUS_OPTIONS, USER_GENDER_OPTIONS } from "./constants";

const DEFAULT_PAGE_SIZE = 10;

export interface UserListFilterBadge {
  key: string;
  label: string;
  onClear: () => void;
}

/**
 * Encapsulates filter state, query, and derived values for the User Yourpay list page.
 * Mirrors KYC submission page pattern: collapsible filters, badges, reset. Country is
 * rendered as buttons (All, BN, HK, …) outside the filters card; status/gender live in the card.
 *
 * @returns Filter state, handlers, badges, query result (users, total, isLoading, isError), and refs for selects
 */
export function useUserListFilters() {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [country, setCountry] = useState<string>("ALL");
  const [status, setStatus] = useState<string>("all");
  const [gender, setGender] = useState<string>("all");
  const [searchInput, setSearchInput] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

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
    setCountry("ALL");
    setStatus("all");
    setGender("all");
    setSearchInput("");
    setPageIndex(0);
  }, []);

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
  }, [status, gender]);

  const resetPageIndex = useCallback(() => setPageIndex(0), []);

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
