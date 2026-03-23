import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { useSyncGlobalLoading } from "@/shared/lib";
import { useFeeConfigStore } from "./fee-config-store";
import {
  feeConfigListResponseSchema,
  feeConfigSchema,
  type FeeConfig,
} from "@/entities/fee-config";
import {
  getV1OperatorsFee,
  type FeeConfigResponseDTO,
  type ListFeeConfigResponse,
} from "@/shared/api/generated";

export type FeeCurrencyFilter = "ALL" | "IDR" | "SGD" | "HKD" | "NTD";

export type FeeStatusFilter = "all" | "active" | "inactive";

export type FeeTypeFilter = "all" | "fixed" | "percentage" | "tiered";

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

function mapApiFeeToEntity(item: FeeConfigResponseDTO): FeeConfig | null {
  const currency = typeof item.currency === "string" ? item.currency : "";

  const feeMode = item.fee_mode === "inclusive" ? "inclusive" : "exclusive";

  const feeType =
    item.fee_type === "percentage" || item.fee_type === "tiered" ? item.fee_type : "fixed";

  const candidate: FeeConfig = {
    id: item.id ?? "",
    name: item.name ?? "",
    nominal: item.fee_value ?? 0,
    service: item.service_name ?? item.service_id ?? "",
    currency,
    feeType,
    feeMode,
    isActive: item.is_active ?? false,
  };

  const parsed = feeConfigSchema.safeParse(candidate);
  if (!parsed.success) {
    return null;
  }

  return parsed.data;
}

function mapApiResponseToList(
  data: ListFeeConfigResponse | undefined,
) {
  const list = data?.data?.list ?? [];
  const mapped = list
    .map(mapApiFeeToEntity)
    .filter((item): item is FeeConfig => item !== null);

  return feeConfigListResponseSchema.parse({
    data: mapped,
    total: mapped.length,
  });
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
    select: (response) => mapApiResponseToList(response.data),
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

    const statusLabel = status === "active" ? "Active" : status === "inactive" ? "Inactive" : "";
    if (status !== "all") {
      list.push({
        id: `status:${status}`,
        key: "status",
        label: "Status",
        valueLabel: statusLabel,
        onClear: () => setStatus("all"),
      });
    }

    const feeTypeLabel =
      feeType === "fixed"
        ? "FIXED"
        : feeType === "percentage"
          ? "PERCENTAGE"
          : feeType === "tiered"
            ? "TIERED"
            : "";
    if (feeType !== "all") {
      list.push({
        id: `feeType:${feeType}`,
        key: "feeType",
        label: "Fee Type",
        valueLabel: feeTypeLabel,
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

