import { useEffect, useMemo, useState } from "react";

import { normalizeCode } from "@/shared/lib";

interface UseUserEditIdentityAccessLogicParams {
  open: boolean;
  currentIdentityAccesses: Array<{ code: string; isDefault: boolean }>;
  apiOptions: Array<{ code: string; isDefault: boolean }>;
}

interface UseUserEditIdentityAccessLogicResult {
  search: string;
  setSearch: (value: string) => void;
  filteredOptions: Array<{ code: string; isDefault: boolean }>;
  selectedCodeSet: Set<string>;
  isDirty: boolean;
  selectedCodes: string[];
  onToggleCode: (code: string) => void;
}

/**
 * View-model logic for identity access modal selection/filter state.
 *
 * @param params Modal visibility, current access, and fetched options.
 * @returns Search/filter/selection derived state and handlers.
 */
export function useUserEditIdentityAccessLogic({
  open,
  currentIdentityAccesses,
  apiOptions,
}: UseUserEditIdentityAccessLogicParams): UseUserEditIdentityAccessLogicResult {
  const [search, setSearch] = useState("");
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const [initialSelectedCodes, setInitialSelectedCodes] = useState<string[]>([]);

  useEffect(() => {
    if (!open) return;
    const initial = currentIdentityAccesses.map((item) => item.code);
    setSelectedCodes(initial);
    setInitialSelectedCodes(initial);
  }, [currentIdentityAccesses, open]);

  const mergedOptions = useMemo(() => {
    const optionMap = new Map<string, { code: string; isDefault: boolean }>();

    for (const option of apiOptions) {
      optionMap.set(normalizeCode(option.code), option);
    }

    for (const currentAccess of currentIdentityAccesses) {
      const key = normalizeCode(currentAccess.code);
      if (!optionMap.has(key)) {
        optionMap.set(key, {
          code: currentAccess.code,
          isDefault: currentAccess.isDefault,
        });
      }
    }

    return Array.from(optionMap.values()).sort((a, b) => {
      if (a.isDefault !== b.isDefault) {
        return a.isDefault ? -1 : 1;
      }
      return a.code.localeCompare(b.code);
    });
  }, [apiOptions, currentIdentityAccesses]);

  const filteredOptions = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return mergedOptions;
    return mergedOptions.filter((option) => option.code.toLowerCase().includes(keyword));
  }, [mergedOptions, search]);

  const defaultCodes = useMemo(
    () =>
      new Set(
        mergedOptions
          .filter((option) => option.isDefault)
          .map((option) => normalizeCode(option.code)),
      ),
    [mergedOptions],
  );

  const selectedCodeSet = useMemo(
    () => new Set(selectedCodes.map((code) => normalizeCode(code))),
    [selectedCodes],
  );

  const isDirty = useMemo(() => {
    const toNormalizedSorted = (codes: string[]) =>
      codes.map((code) => normalizeCode(code)).sort((a, b) => a.localeCompare(b));
    const a = toNormalizedSorted(selectedCodes);
    const b = toNormalizedSorted(initialSelectedCodes);
    if (a.length !== b.length) return true;
    return !a.every((code, index) => code === b[index]);
  }, [initialSelectedCodes, selectedCodes]);

  const onToggleCode = (code: string): void => {
    const key = normalizeCode(code);
    if (defaultCodes.has(key)) return;

    setSelectedCodes((previous) => {
      const exists = previous.some((item) => normalizeCode(item) === key);
      if (exists) {
        return previous.filter((item) => normalizeCode(item) !== key);
      }
      return [...previous, code];
    });
  };

  return {
    search,
    setSearch,
    filteredOptions,
    selectedCodeSet,
    isDirty,
    selectedCodes,
    onToggleCode,
  };
}
