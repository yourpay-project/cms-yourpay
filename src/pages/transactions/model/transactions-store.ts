import { create } from "zustand";
import { persist } from "zustand/middleware";

const DEFAULT_PAGE_SIZE = 10;

export interface TransactionDateRangeSlice {
  from: string;
  to: string;
  presetLabel: string | null;
}

/**
 * State and actions for the Transactions list page (SDUI filters from API).
 */
export interface TransactionsStoreState {
  pageIndex: number;
  pageSize: number;
  searchInput: string;
  /** Selected values for `options` / `control` filters keyed by API `key`. */
  filterValues: Record<string, string>;
  /** `date_range` filters keyed by API `key` (e.g. `transaction_date`). */
  dateRanges: Record<string, TransactionDateRangeSlice>;
  filtersOpen: boolean;
  setPageIndex: (v: number) => void;
  setPageSize: (v: number) => void;
  setSearchInput: (v: string) => void;
  setFilterValue: (key: string, value: string) => void;
  setDateRange: (key: string, from: string, to: string, presetLabel?: string | null) => void;
  setFiltersOpen: (v: boolean | ((prev: boolean) => boolean)) => void;
  resetFilters: () => void;
}

export const useTransactionsStore = create<TransactionsStoreState>()(
  persist(
    (set) => ({
      pageIndex: 0,
      pageSize: DEFAULT_PAGE_SIZE,
      searchInput: "",
      filterValues: {},
      dateRanges: {},
      filtersOpen: false,
      setPageIndex: (v) => set({ pageIndex: v }),
      setPageSize: (v) => set({ pageSize: v }),
      setSearchInput: (v) => set({ searchInput: v }),
      setFilterValue: (key, value) =>
        set((state) => ({
          filterValues: { ...state.filterValues, [key]: value },
          pageIndex: 0,
        })),
      setDateRange: (key, from, to, presetLabel = null) =>
        set((state) => {
          if (!from || !to) {
            const next = { ...state.dateRanges };
            delete next[key];
            return { dateRanges: next, pageIndex: 0 };
          }
          return {
            dateRanges: {
              ...state.dateRanges,
              [key]: { from, to, presetLabel },
            },
            pageIndex: 0,
          };
        }),
      setFiltersOpen: (v) =>
        set((state) => ({
          filtersOpen: typeof v === "function" ? v(state.filtersOpen) : v,
        })),
      resetFilters: () =>
        set({
          filterValues: {},
          dateRanges: {},
          searchInput: "",
          pageIndex: 0,
        }),
    }),
    { name: "cms-transactions-api-filters" }
  )
);
