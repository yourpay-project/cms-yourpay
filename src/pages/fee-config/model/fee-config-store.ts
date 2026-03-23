import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { FeeCurrencyFilter, FeeStatusFilter, FeeTypeFilter } from "./use-fee-config-filters";

const DEFAULT_PAGE_SIZE = 10;

export interface FeeConfigStoreState {
  search: string;
  status: FeeStatusFilter;
  feeType: FeeTypeFilter;
  service: string;
  currency: FeeCurrencyFilter;
  pageIndex: number;
  pageSize: number;

  setSearch: (v: string) => void;
  setStatus: (v: FeeStatusFilter) => void;
  setFeeType: (v: FeeTypeFilter) => void;
  setService: (v: string) => void;
  setCurrency: (v: FeeCurrencyFilter) => void;
  setPageIndex: (v: number) => void;
  setPageSize: (v: number) => void;

  resetFilters: () => void;
}

export const useFeeConfigStore = create<FeeConfigStoreState>()(
  persist(
    (set) => ({
      search: "",
      status: "all",
      feeType: "all",
      service: "",
      currency: "ALL",
      pageIndex: 0,
      pageSize: DEFAULT_PAGE_SIZE,

      setSearch: (v) => set({ search: v, pageIndex: 0 }),
      setStatus: (v) => set({ status: v, pageIndex: 0 }),
      setFeeType: (v) => set({ feeType: v, pageIndex: 0 }),
      setService: (v) => set({ service: v, pageIndex: 0 }),
      setCurrency: (v) => set({ currency: v, pageIndex: 0 }),
      setPageIndex: (v) => set({ pageIndex: v }),
      setPageSize: (v) => set({ pageSize: v, pageIndex: 0 }),
      resetFilters: () =>
        set({
          search: "",
          status: "all",
          feeType: "all",
          service: "",
          currency: "ALL",
          pageIndex: 0,
          pageSize: DEFAULT_PAGE_SIZE,
        }),
    }),
    { name: "cms-fee-config" },
  ),
);

