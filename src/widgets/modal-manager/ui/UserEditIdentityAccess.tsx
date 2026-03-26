import type { FC } from "react";
import { useEffect, useMemo, useState } from "react";

import { toast } from "sonner";
import { Button } from "@/shared/ui";
import { useIdentityAccessOptionsQuery } from "@/entities/user";
import { normalizeCode } from "@/shared/lib";
import { EditIdentityAccessModalBody } from "@/features/identity-access";

import type { UserEditIdentityAccessProps } from "./UserEditIdentityAccess.type";

/**
 * Modal for editing customer identity access selections.
 */
export const UserEditIdentityAccess: FC<UserEditIdentityAccessProps> = ({
  open,
  onClose,
  customerId,
  currentIdentityAccesses,
}) => {
  const [search, setSearch] = useState("");
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const [initialSelectedCodes, setInitialSelectedCodes] = useState<string[]>([]);

  const optionsQuery = useIdentityAccessOptionsQuery();

  useEffect(() => {
    if (!open) return;
    const initial = currentIdentityAccesses.map((item) => item.code);
    setSelectedCodes(initial);
    setInitialSelectedCodes(initial);
  }, [currentIdentityAccesses, open]);

  const mergedOptions = useMemo(() => {
    const apiOptions = optionsQuery.data ?? [];

    const optionMap = new Map<
      string,
      {
        code: string;
        isDefault: boolean;
      }
    >();

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
        if (a.isDefault) {
          return -1;
        }
        return 1;
      }
      return a.code.localeCompare(b.code);
    });
  }, [currentIdentityAccesses, optionsQuery.data]);

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
    for (let i = 0; i < a.length; i += 1) {
      if (a[i] !== b[i]) return true;
    }
    return false;
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

  const onSubmit = (): void => {
    let selectedLabel = selectedCodes.join(", ");
    if (!selectedLabel) {
      selectedLabel = "-";
    }
    toast.info(`TODO: submit identity access update for ${customerId}`, {
      description: `Selected: ${selectedLabel}`,
    });
    onClose();
  };

  return (
    <div className="flex flex-col">
      <EditIdentityAccessModalBody
        search={search}
        onSearchChange={setSearch}
        filteredOptions={filteredOptions}
        selectedCodeSet={selectedCodeSet}
        isLoading={optionsQuery.isLoading}
        isError={optionsQuery.isError}
        onToggleCode={onToggleCode}
      />

      <div className="flex items-center justify-end gap-2 pb-5 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="button" variant="default" onClick={onSubmit} disabled={!isDirty}>
          Submit
        </Button>
      </div>
    </div>
  );
};

