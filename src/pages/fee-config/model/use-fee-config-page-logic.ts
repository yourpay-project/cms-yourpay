import { useMemo, useRef, useState, type RefObject } from "react";

import type { FeeConfig } from "@/entities/fee-config";
import { deleteFeeConfigById } from "@/shared/api/fee-config";
import type { FeeConfigFiltersState } from "./use-fee-config-filters";

export interface UseFeeConfigPageLogicResult {
  filtersOpen: boolean;
  setFiltersOpen: (v: boolean | ((prev: boolean) => boolean)) => void;

  statusSelectRef: RefObject<HTMLSelectElement>;
  feeTypeSelectRef: RefObject<HTMLSelectElement>;
  serviceSelectRef: RefObject<HTMLSelectElement>;

  serviceOptions: Array<{ value: string; label: string }>;
  canCreateFeeConfig: boolean;
  handleDelete: (row: FeeConfig) => Promise<void>;
}

/**
 * Encapsulates fee-config page state + form handlers.
 */
export function useFeeConfigPageLogic(filters: FeeConfigFiltersState): UseFeeConfigPageLogicResult {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const canCreateFeeConfig = true;

  const statusSelectRef = useRef<HTMLSelectElement>(null as unknown as HTMLSelectElement);
  const feeTypeSelectRef = useRef<HTMLSelectElement>(null as unknown as HTMLSelectElement);
  const serviceSelectRef = useRef<HTMLSelectElement>(null as unknown as HTMLSelectElement);

  const serviceOptions = useMemo(
    () =>
      Array.from(new Set(filters.items.map((item) => item.service)))
        .filter(Boolean)
        .sort()
        .map((service) => ({ value: service, label: service })),
    [filters.items],
  );

  const handleDelete = async (row: FeeConfig) => {
    await deleteFeeConfigById(row.id);
    await filters.refetch();
  };

  return {
    filtersOpen,
    setFiltersOpen,
    statusSelectRef,
    feeTypeSelectRef,
    serviceSelectRef,
    serviceOptions,
    canCreateFeeConfig,
    handleDelete,
  };
}

