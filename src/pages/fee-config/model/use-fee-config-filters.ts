import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { useSyncGlobalLoading } from "@/shared/lib";
import { useFeeConfigStore } from "./fee-config-store";
import {
  getV1OperatorsFee,
} from "@/shared/api/generated";
import { type FeeConfig } from "@/entities/fee-config";
import { mapApiResponseToFeeConfigList } from "./fee-config-response-mapper";

export type FeeCurrencyFilter = "ALL" | "IDR" | "SGD" | "HKD" | "NTD";

export type FeeStatusFilter = "all" | "active" | "inactive";

export type FeeTypeFilter = "all" | "fixed" | "percentage" | "tiered";

const FEE_STATUS_LABEL_BY_VALUE: Record<Exclude<FeeStatusFilter, "all">, string> = {
  active: "Active",
  inactive: "Inactive",
};

const FEE_TYPE_LABEL_BY_VALUE: Record<Exclude<FeeTypeFilter, "all">, string> = {
  fixed: "FIXED",
  percentage: "PERCENTAGE",
  tiered: "TIERED",
};

export interface FeeConfigFilterBadge {
  id: string;
  key: "status" | "feeType" | "service" | "currency";
  label: string;
  valueLabel: string;
  onClear: () => void;
}

export interface FeeConfigFiltersState {
  search: string;
  setSearch: (value: string) => void;
  status: FeeStatusFilter;
  setStatus: (value: FeeStatusFilter) => void;
  feeType: FeeTypeFilter;
  setFeeType: (value: FeeTypeFilter) => void;
  service: string;
  setService: (value: string) => void;
  currency: FeeCurrencyFilter;
  setCurrency: (value: FeeCurrencyFilter) => void;
  /** Services available for the dropdown, computed without applying the current `service` filter. */
  serviceOptions: Array<{ value: string; label: string }>;
  pageIndex: number;
  pageSize: number;
  setPageIndex: (value: number) => void;
  setPageSize: (value: number) => void;
  resetPageIndex: () => void;
  handleResetFilters: () => void;
  refetch: () => void;
  items: FeeConfig[];
  total: number;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: unknown;
  badges: FeeConfigFilterBadge[];
}

export function useFeeConfigFilters(): FeeConfigFiltersState {
  const {
    search,
    setSearch,
    status,
    setStatus,
    feeType,
    setFeeType,
    service,
    setService,
    currency,
    setCurrency,
    pageIndex,
    pageSize,
    setPageIndex,
    setPageSize,
    resetFilters,
  } = useFeeConfigStore();

  const query = useQuery({
    queryKey: ["fee-config"],
    queryFn: async ({ signal }) =>
      getV1OperatorsFee({ signal }),
    select: (response) => mapApiResponseToFeeConfigList(response.data),
  });

  useSyncGlobalLoading(query.isLoading);
  const { items, total, serviceOptions } = useMemo(() => {
    const list = query.data?.data ?? [];

    const filteredByCurrency =
      currency === "ALL" ? list : list.filter((item) => item.currency === currency);

    const filteredByStatus =
      status === "all"
        ? filteredByCurrency
        : filteredByCurrency.filter((item) =>
            status === "active" ? item.isActive : !item.isActive,
          );

    const filteredByFeeType =
      feeType === "all"
        ? filteredByStatus
        : filteredByStatus.filter((item) => item.feeType === feeType);

    const keyword = search.trim().toLowerCase();
    const filteredBySearch = !keyword
      ? filteredByFeeType
      : filteredByFeeType.filter((item) => {
          return (
            item.name.toLowerCase().includes(keyword) ||
            item.service.toLowerCase().includes(keyword) ||
            item.currency.toLowerCase().includes(keyword)
          );
        });

    const filteredByService =
      !service.trim() || service === "all"
        ? filteredBySearch
        : filteredBySearch.filter((item) => item.service === service);

    const serviceOptions = Array.from(new Set(filteredBySearch.map((item) => item.service)))
      .filter(Boolean)
      .sort()
      .map((s) => ({ value: s, label: s }));

    const start = pageIndex * pageSize;
    const end = start + pageSize;
    const paged = filteredByService.slice(start, end);
    const total = filteredByService.length;

    return { items: paged, total, serviceOptions };
  }, [query.data, currency, status, feeType, service, search, pageIndex, pageSize]);

  const resetPageIndex = () => setPageIndex(0);

  const badges = useMemo<FeeConfigFilterBadge[]>(() => {
    const list: FeeConfigFilterBadge[] = [];

    if (status !== "all") {
      list.push({
        id: `status:${status}`,
        key: "status",
        label: "Status",
        valueLabel: FEE_STATUS_LABEL_BY_VALUE[status],
        onClear: () => setStatus("all"),
      });
    }

    if (feeType !== "all") {
      list.push({
        id: `feeType:${feeType}`,
        key: "feeType",
        label: "Fee Type",
        valueLabel: FEE_TYPE_LABEL_BY_VALUE[feeType],
        onClear: () => setFeeType("all"),
      });
    }

    if (service.trim()) {
      list.push({
        id: `service:${service}`,
        key: "service",
        label: "Service",
        valueLabel: service,
        onClear: () => setService(""),
      });
    }

    const currencyLabel =
      currency === "ALL"
        ? ""
        : currency; // keep compact; currency buttons already show canonical code
    if (currency !== "ALL") {
      list.push({
        id: `currency:${currency}`,
        key: "currency",
        label: "Currency",
        valueLabel: currencyLabel,
        onClear: () => setCurrency("ALL"),
      });
    }

    return list;
  }, [currency, feeType, service, setCurrency, setFeeType, setService, setStatus, status]);

  return {
    search,
    setSearch,
    status,
    setStatus,
    feeType,
    setFeeType,
    service,
    setService,
    currency,
    setCurrency,
    serviceOptions,
    pageIndex,
    pageSize,
    setPageIndex,
    setPageSize,
    resetPageIndex,
    handleResetFilters: () => resetFilters(),
    items,
    total,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: () => {
      void query.refetch();
    },
    badges,
  };
}

