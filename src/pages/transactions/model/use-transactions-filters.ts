import { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { useDebouncedValue } from "@/shared/lib";
import type { FilterField } from "@/shared/ui";
import type { TransactionFilterDefinition, TransactionFilterOption } from "@/entities/transaction";
import { useTransactionsStore } from "./transactions-store";
import { useTransactionsQuery } from "./use-transactions-query";

function allValueFromOptions(options: readonly TransactionFilterOption[]): string {
  const hit = options.find(
    (o) => o.label.trim().toLowerCase() === "all" || o.value === ""
  );
  return hit?.value ?? "";
}

function transactionDateRangeQueryValue(from: string, to: string): string {
  return `${from}T00:00:00.000Z|${to}T23:59:59.999Z`;
}

function toFilterField(def: TransactionFilterDefinition): FilterField {
  return {
    key: def.key,
    label: def.name?.trim() ? def.name : def.key,
    type: def.type === "control" ? "control" : "options",
    options: def.options,
    allValue: allValueFromOptions(def.options),
  };
}

function buildDynamicFilters(
  definitions: readonly TransactionFilterDefinition[] | undefined,
  filterValues: Record<string, string>,
  dateRanges: Record<string, { from: string; to: string; presetLabel: string | null }>
): Record<string, string> {
  const out: Record<string, string> = {};

  if (!definitions || definitions.length === 0) {
    for (const [key, value] of Object.entries(filterValues)) {
      if (value && value.trim() !== "") {
        out[key] = value.trim();
      }
    }
    for (const [key, slice] of Object.entries(dateRanges)) {
      if (slice.from && slice.to) {
        out[key] = transactionDateRangeQueryValue(slice.from, slice.to);
      }
    }
    return out;
  }

  for (const def of definitions) {
    if (def.type === "options" || def.type === "control") {
      const selected = filterValues[def.key];
      const allV = allValueFromOptions(def.options);
      if (selected != null && selected !== allV && selected.trim() !== "") {
        out[def.key] = selected.trim();
      }
    }
    if (def.type === "date_range") {
      const slice = dateRanges[def.key];
      if (slice?.from && slice?.to) {
        out[def.key] = transactionDateRangeQueryValue(slice.from, slice.to);
      }
    }
  }

  return out;
}

/**
 * Transactions list filters driven by SDUI metadata from the transactions list API (`filterDefinitions`).
 */
export function useTransactionsFilters() {
  const store = useTransactionsStore();
  const debouncedSearch = useDebouncedValue(store.searchInput, 400);

  const [filterDefs, setFilterDefs] = useState<TransactionFilterDefinition[] | undefined>(undefined);

  const dynamicFilters = useMemo(
    () => buildDynamicFilters(filterDefs, store.filterValues, store.dateRanges),
    [filterDefs, store.filterValues, store.dateRanges]
  );

  const query = useTransactionsQuery({
    pageIndex: store.pageIndex,
    pageSize: store.pageSize,
    keyword: debouncedSearch || undefined,
    dynamicFilters,
  });

  useLayoutEffect(() => {
    const next = query.data?.filterDefinitions;
    if (next) {
      setFilterDefs(next);
    }
  }, [query.data?.filterDefinitions]);

  const resolvedDefinitions = useMemo(
    () => query.data?.filterDefinitions ?? filterDefs ?? [],
    [query.data?.filterDefinitions, filterDefs]
  );

  const controlFilterFields = useMemo((): FilterField[] => {
    return resolvedDefinitions.filter((d) => d.type === "control").map(toFilterField);
  }, [resolvedDefinitions]);

  const optionsFilterFields = useMemo((): FilterField[] => {
    return resolvedDefinitions.filter((d) => d.type === "options").map(toFilterField);
  }, [resolvedDefinitions]);

  const dateRangeDefinitions = useMemo(
    () => resolvedDefinitions.filter((d) => d.type === "date_range"),
    [resolvedDefinitions]
  );
  const hasBackendFilters = resolvedDefinitions.length > 0;

  const selectedFilterValues = useMemo(() => {
    const out: Record<string, string> = {};
    for (const def of resolvedDefinitions) {
      if (def.type !== "options" && def.type !== "control") continue;
      const allV = allValueFromOptions(def.options);
      out[def.key] = store.filterValues[def.key] ?? allV;
    }
    return out;
  }, [resolvedDefinitions, store.filterValues]);

  const resetPageIndex = useCallback(() => store.setPageIndex(0), [store]);

  const handleChangeFilter = useCallback(
    (key: string, value: string) => {
      store.setFilterValue(key, value);
    },
    [store]
  );

  const badges = useMemo(() => {
    const list: Array<{ id: string; badgeKey: string; label: string; onClear: () => void }> = [];

    for (const def of resolvedDefinitions) {
      if (def.type === "options" || def.type === "control") {
        const allV = allValueFromOptions(def.options);
        const selected = store.filterValues[def.key] ?? allV;
        if (selected === allV || selected.trim() === "") continue;
        const optLabel = def.options.find((o) => o.value === selected)?.label ?? selected;
        const title = def.name?.trim() ? def.name : def.key;
        list.push({
          id: `${def.key}:${selected}`,
          badgeKey: title,
          label: `${title}: ${optLabel}`,
          onClear: () => {
            store.setFilterValue(def.key, allV);
          },
        });
      }
      if (def.type === "date_range") {
        const slice = store.dateRanges[def.key];
        if (!slice?.from || !slice?.to) continue;
        const title = def.name?.trim() ? def.name : def.key;
        const rangeLabel = slice.presetLabel ?? `${slice.from} – ${slice.to}`;
        list.push({
          id: `${def.key}:range`,
          badgeKey: title,
          label: `${title}: ${rangeLabel}`,
          onClear: () => {
            store.setDateRange(def.key, "", "", null);
          },
        });
      }
    }

    return list;
  }, [resolvedDefinitions, store]);

  return {
    ...query,
    transactions: query.data?.data ?? [],
    total: query.data?.total ?? 0,
    controlFilterFields,
    optionsFilterFields,
    dateRangeDefinitions,
    hasBackendFilters,
    selectedFilterValues,
    handleChangeFilter,
    badges,
    resetPageIndex,
    handleResetFilters: store.resetFilters,
    ...store,
  };
}
