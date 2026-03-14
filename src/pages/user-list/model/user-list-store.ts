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
  country: string;
  status: string;
  gender: string;
  searchInput: string;
  filtersOpen: boolean;
  setPageIndex: (v: number) => void;
  setPageSize: (v: number) => void;
  setCountry: (v: string) => void;
  setStatus: (v: string) => void;
  setGender: (v: string) => void;
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
      country: "ALL",
      status: "all",
      gender: "all",
      searchInput: "",
      filtersOpen: false,
      setPageIndex: (v) => set({ pageIndex: v }),
      setPageSize: (v) => set({ pageSize: v }),
      setCountry: (v) => set({ country: v, pageIndex: 0 }),
      setStatus: (v) => set({ status: v, pageIndex: 0 }),
      setGender: (v) => set({ gender: v, pageIndex: 0 }),
      setSearchInput: (v) => set({ searchInput: v }),
      setFiltersOpen: (v) =>
        set((s) => ({
          filtersOpen: typeof v === "function" ? v(s.filtersOpen) : v,
        })),
      resetFilters: () =>
        set({
          country: "ALL",
          status: "all",
          gender: "all",
          searchInput: "",
          pageIndex: 0,
        }),
    }),
    { name: "cms-user-yourpay" }
  )
);
