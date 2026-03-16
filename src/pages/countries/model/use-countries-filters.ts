import { useMemo, useState } from "react";

import { useSyncGlobalLoading } from "@/shared/lib";
import { useCountriesQuery, type Country } from "@/entities/country";

export interface CountriesFiltersState {
  search: string;
  setSearch: (value: string) => void;
  sortBy: "name" | "code";
  setSortBy: (value: "name" | "code") => void;
  sortDirection: "asc" | "desc";
  setSortDirection: (value: "asc" | "desc") => void;
  pageIndex: number;
  pageSize: number;
  setPageIndex: (value: number) => void;
  setPageSize: (value: number) => void;
  resetPageIndex: () => void;
  countriesPage: Country[];
  total: number;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: unknown;
}

export function useCountriesFilters(): CountriesFiltersState {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "code">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const query = useCountriesQuery();
  useSyncGlobalLoading(query.isLoading);

  const { countriesPage, total } = useMemo(() => {
    const list = query.data?.data ?? [];

    const filtered = list.filter((country) => {
      if (!search.trim()) return true;
      const keyword = search.trim().toLowerCase();
      const name = country.name.toLowerCase();
      const code = country.code.toLowerCase();
      return name.includes(keyword) || code.includes(keyword);
    });

    const sorted = filtered.slice().sort((a, b) => {
      const dir = sortDirection === "asc" ? 1 : -1;
      if (sortBy === "name") {
        return a.name.localeCompare(b.name) * dir;
      }
      return a.code.localeCompare(b.code) * dir;
    });

    const start = pageIndex * pageSize;
    const end = start + pageSize;
    const paged = sorted.slice(start, end);

    return {
      countriesPage: paged,
      total: filtered.length,
    };
  }, [query.data, search, sortBy, sortDirection, pageIndex, pageSize]);

  const resetPageIndex = () => setPageIndex(0);

  return {
    search,
    setSearch,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    pageIndex,
    pageSize,
    setPageIndex,
    setPageSize,
    resetPageIndex,
    countriesPage,
    total,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
  };
}

