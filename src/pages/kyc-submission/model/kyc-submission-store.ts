import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getLast30DaysInitial } from "../lib/date-range-presets";

const DEFAULT_PAGE_SIZE = 10;

function getDefaultKycRange() {
  const { from, to, presetLabel } = getLast30DaysInitial();
  return { kycFrom: from, kycTo: to, kycPresetLabel: presetLabel };
}

/**
 * State and actions for the KYC submission list page filters and UI.
 * Persisted to localStorage; do not combine with User Yourpay state.
 */
export interface KycSubmissionStoreState {
  pageIndex: number;
  pageSize: number;
  status: string;
  documentType: string;
  country: string;
  reverifyStatus: string;
  kycFrom: string;
  kycTo: string;
  lastUpdateFrom: string;
  lastUpdateTo: string;
  kycPresetLabel: string | null;
  lastUpdatePresetLabel: string | null;
  searchInput: string;
  filtersOpen: boolean;
  setPageIndex: (v: number) => void;
  setPageSize: (v: number) => void;
  setStatus: (v: string) => void;
  setDocumentType: (v: string) => void;
  setCountry: (v: string) => void;
  setReverifyStatus: (v: string) => void;
  setKycFrom: (v: string) => void;
  setKycTo: (v: string) => void;
  setLastUpdateFrom: (v: string) => void;
  setLastUpdateTo: (v: string) => void;
  setKycPresetLabel: (v: string | null) => void;
  setLastUpdatePresetLabel: (v: string | null) => void;
  setSearchInput: (v: string) => void;
  setFiltersOpen: (v: boolean | ((prev: boolean) => boolean)) => void;
  resetFilters: () => void;
}

const defaultKyc = getDefaultKycRange();

/**
 * Persisted filter and UI state for the KYC submission list page.
 *
 * @remarks
 * Stored in localStorage under key `cms-kyc-submission`. Isolated from User Yourpay;
 * use {@link useUserListStore} for the customers page. Default KYC date range is "Last 30 days".
 */
export const useKycSubmissionStore = create<KycSubmissionStoreState>()(
  persist(
    (set) => ({
      pageIndex: 0,
      pageSize: DEFAULT_PAGE_SIZE,
      status: "all",
      documentType: "all",
      country: "all",
      reverifyStatus: "all",
      kycFrom: defaultKyc.kycFrom,
      kycTo: defaultKyc.kycTo,
      lastUpdateFrom: "",
      lastUpdateTo: "",
      kycPresetLabel: defaultKyc.kycPresetLabel,
      lastUpdatePresetLabel: null,
      searchInput: "",
      filtersOpen: false,
      setPageIndex: (v) => set({ pageIndex: v }),
      setPageSize: (v) => set({ pageSize: v }),
      setStatus: (v) => set({ status: v, pageIndex: 0 }),
      setDocumentType: (v) => set({ documentType: v, pageIndex: 0 }),
      setCountry: (v) => set({ country: v, pageIndex: 0 }),
      setReverifyStatus: (v) => set({ reverifyStatus: v, pageIndex: 0 }),
      setKycFrom: (v) => set({ kycFrom: v, pageIndex: 0 }),
      setKycTo: (v) => set({ kycTo: v, pageIndex: 0 }),
      setLastUpdateFrom: (v) => set({ lastUpdateFrom: v, pageIndex: 0 }),
      setLastUpdateTo: (v) => set({ lastUpdateTo: v, pageIndex: 0 }),
      setKycPresetLabel: (v) => set({ kycPresetLabel: v, pageIndex: 0 }),
      setLastUpdatePresetLabel: (v) => set({ lastUpdatePresetLabel: v, pageIndex: 0 }),
      setSearchInput: (v) => set({ searchInput: v }),
      setFiltersOpen: (v) =>
        set((s) => ({
          filtersOpen: typeof v === "function" ? v(s.filtersOpen) : v,
        })),
      resetFilters: () =>
        set({
          status: "all",
          documentType: "all",
          country: "all",
          reverifyStatus: "all",
          kycFrom: "",
          kycTo: "",
          lastUpdateFrom: "",
          lastUpdateTo: "",
          kycPresetLabel: null,
          lastUpdatePresetLabel: null,
          searchInput: "",
          pageIndex: 0,
        }),
    }),
    { name: "cms-kyc-submission" }
  )
);
