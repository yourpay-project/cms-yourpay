import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { useSyncGlobalLoading } from "@/shared/lib";
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
  pageIndex: number;
  pageSize: number;
  setPageIndex: (value: number) => void;
  setPageSize: (value: number) => void;
  resetPageIndex: () => void;
  refetch: () => void;
  items: FeeConfig[];
  total: number;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: unknown;
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
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<FeeStatusFilter>("all");
  const [feeType, setFeeType] = useState<FeeTypeFilter>("all");
  const [service, setService] = useState<string>("");
  const [currency, setCurrency] = useState<FeeCurrencyFilter>("ALL");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const query = useQuery({
    queryKey: ["fee-config"],
    queryFn: async ({ signal }) =>
      getV1OperatorsFee({ signal }),
    select: (response) => mapApiResponseToList(response.data),
  });

  useSyncGlobalLoading(query.isLoading);

  const { items, total } = useMemo(() => {
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

    const filteredByService =
      !service.trim() || service === "all"
        ? filteredByFeeType
        : filteredByFeeType.filter((item) => item.service === service);

    const filtered = filteredByService.filter((item) => {
      if (!search.trim()) return true;
      const keyword = search.trim().toLowerCase();

      return (
        item.name.toLowerCase().includes(keyword) ||
        item.service.toLowerCase().includes(keyword) ||
        item.currency.toLowerCase().includes(keyword)
      );
    });

    const start = pageIndex * pageSize;
    const end = start + pageSize;
    const paged = filtered.slice(start, end);

    return {
      items: paged,
      total: filtered.length,
    };
  }, [query.data, currency, status, feeType, service, search, pageIndex, pageSize]);

  const resetPageIndex = () => setPageIndex(0);

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
    pageIndex,
    pageSize,
    setPageIndex,
    setPageSize,
    resetPageIndex,
    items,
    total,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: () => {
      void query.refetch();
    },
  };
}

