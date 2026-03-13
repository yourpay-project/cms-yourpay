import type { FC } from "react";
import { useState } from "react";
import { Search } from "lucide-react";

import { Button, Input, PageSkeleton } from "@/shared/ui";
import { ApiClientError } from "@/shared/api";
import { useDebouncedValue } from "@/shared/lib";
import { UserTable } from "@/widgets/user-table";
import { useUserListQuery } from "../model";

const DEFAULT_PAGE_SIZE = 10;

const COUNTRY_FILTERS = ["ALL", "BN", "HK", "ID", "KR", "SG", "TW"] as const;

type CountryFilter = (typeof COUNTRY_FILTERS)[number];

type StatusFilter = "all" | "active" | "inactive" | "blocked";
type GenderFilter = "all" | "M" | "F";

type UserListPageProps = Record<string, never>;

/** Page at `/customers`: lists YourPay users with pagination, search, and filters. */
const UserListPage: FC<UserListPageProps> = () => {
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [country, setCountry] = useState<CountryFilter>("ALL");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [gender, setGender] = useState<GenderFilter>("all");
  const [searchInput, setSearchInput] = useState<string>("");

  const debouncedSearch = useDebouncedValue(searchInput, 400);

  const { data, isLoading, isFetching, isError, error } = useUserListQuery({
    pageIndex,
    pageSize,
    country,
    status,
    gender,
    search: debouncedSearch,
  });

  if (isLoading) {
    return <PageSkeleton />;
  }

  if (isError) {
    const apiError = error instanceof ApiClientError ? error : null;
    const message =
      apiError?.status === 403
        ? "You do not have permission to view YourPay customers. Please check your CMS role/permissions."
        : "Failed to load customers. Please try again.";

    return (
      <p className="text-sm text-destructive">
        {message}
      </p>
    );
  }

  const users = data?.data ?? [];
  const total = data?.total ?? 0;

  const handleResetFilters = () => {
    setCountry("ALL");
    setStatus("all");
    setGender("all");
    setSearchInput("");
    setPageIndex(0);
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="sticky top-0 z-40 flex flex-col justify-between gap-3 bg-background pb-4 pt-1 md:flex-row md:items-center">
        <div>
          <h2 className="text-xl font-semibold">Customers</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage YourPay customers with server-side pagination, search, and filters.
          </p>
        </div>

        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <div className="relative w-full md:w-64">
            <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchInput}
              onChange={(event) => {
                setSearchInput(event.target.value);
                setPageIndex(0);
              }}
              placeholder="Search by name, phone, ID..."
              className="pl-8"
            />
          </div>

          <div className="flex items-center gap-2 text-xs md:text-sm">
            <label className="text-muted-foreground">
              Status
              <select
                className="ml-1 rounded-md border border-border bg-background px-2 py-1 text-foreground"
                value={status}
                onChange={(event) => {
                  setStatus(event.target.value as StatusFilter);
                  setPageIndex(0);
                }}
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="blocked">Blocked</option>
              </select>
            </label>

            <label className="text-muted-foreground">
              Gender
              <select
                className="ml-1 rounded-md border border-border bg-background px-2 py-1 text-foreground"
                value={gender}
                onChange={(event) => {
                  setGender(event.target.value as GenderFilter);
                  setPageIndex(0);
                }}
              >
                <option value="all">All</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
            </label>

            <Button variant="ghost" size="sm" type="button" onClick={handleResetFilters}>
              Reset
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {COUNTRY_FILTERS.map((value) => (
          <Button
            key={value}
            type="button"
            size="sm"
            variant={country === value ? "default" : "outline"}
            onClick={() => {
              setCountry(value);
              setPageIndex(0);
            }}
          >
            {value === "ALL" ? "All" : value}
          </Button>
        ))}
      </div>

      <div className="flex-1 min-h-0">
        <UserTable
          data={users}
          total={total}
          pageIndex={pageIndex}
          pageSize={pageSize}
          isRefetching={isFetching && !isLoading}
          onPageChange={(nextPageIndex: number, nextPageSize: number) => {
            setPageIndex(nextPageIndex);
            setPageSize(nextPageSize);
          }}
        />
      </div>
    </div>
  );
};

export default UserListPage;

