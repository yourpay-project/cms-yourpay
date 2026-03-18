import { create } from "zustand";
import { persist } from "zustand/middleware";

const DEFAULT_PAGE_SIZE = 10;

/**
 * State and actions for the User Yourpay list page filters and UI.
 * Persisted to localStorage; do not combine with KYC submission state.
 */
export interface UserListStoreState {
  pageIndex: number;
  pageSize: number;
  filterValues: Record<string, string>;
  searchInput: string;
  filtersOpen: boolean;
  setPageIndex: (v: number) => void;
  setPageSize: (v: number) => void;
  setFilterValue: (key: string, value: string) => void;
  setSearchInput: (v: string) => void;
  setFiltersOpen: (v: boolean | ((prev: boolean) => boolean)) => void;
  resetFilters: () => void;
}

/**
 * Persisted filter and UI state for the User Yourpay (customers) list page.
 *
 * @remarks
 * Stored in localStorage under key `cms-user-yourpay`. Isolated from KYC submission;
 * use {@link useKycSubmissionStore} for the KYC page.
 */
export const useUserListStore = create<UserListStoreState>()(
  persist(
    (set) => ({
      pageIndex: 0,
      pageSize: DEFAULT_PAGE_SIZE,
      filterValues: {},
      searchInput: "",
      filtersOpen: false,
      setPageIndex: (v) => set({ pageIndex: v }),
      setPageSize: (v) => set({ pageSize: v }),
      setFilterValue: (key, value) =>
        set((state) => ({
          filterValues: {
            ...state.filterValues,
            [key]: value,
          },
          pageIndex: 0,
        })),
      setSearchInput: (v) => set({ searchInput: v }),
      setFiltersOpen: (v) =>
        set((s) => ({
          filtersOpen: typeof v === "function" ? v(s.filtersOpen) : v,
        })),
      resetFilters: () =>
        set({
          filterValues: {},
          searchInput: "",
          pageIndex: 0,
        }),
    }),
    { name: "cms-user-yourpay" }
  )
);
