import type { FC } from "react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { SearchInput } from "@/shared/ui";
import { Modal } from "@/shared/ui/modal";
import { useIdentityAccessOptionsQuery } from "../model";
import { normalizeCode } from "../lib";

interface EditIdentityAccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerId: string;
  currentIdentityAccesses: Array<{
    code: string;
    isDefault: boolean;
  }>;
}

/**
 * Modal for editing customer identity access selections.
 *
 * @param props - Component props.
 * @returns Identity access edit modal.
 */
const EditIdentityAccessDialog: FC<EditIdentityAccessDialogProps> = ({
  open,
  onOpenChange,
  customerId,
  currentIdentityAccesses,
}) => {
  const [search, setSearch] = useState("");
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const optionsQuery = useIdentityAccessOptionsQuery();

  useEffect(() => {
    if (!open) {
      return;
    }
    setSelectedCodes(currentIdentityAccesses.map((item) => item.code));
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
        return a.isDefault ? -1 : 1;
      }
      return a.code.localeCompare(b.code);
    });
  }, [currentIdentityAccesses, optionsQuery.data]);

  const filteredOptions = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) {
      return mergedOptions;
    }
    return mergedOptions.filter((option) => option.code.toLowerCase().includes(keyword));
  }, [mergedOptions, search]);

  const defaultCodes = useMemo(
    () => new Set(mergedOptions.filter((option) => option.isDefault).map((option) => normalizeCode(option.code))),
    [mergedOptions]
  );

  const onToggleCode = (code: string) => {
    const key = normalizeCode(code);
    if (defaultCodes.has(key)) {
      return;
    }
    setSelectedCodes((previous) => {
      const exists = previous.some((item) => normalizeCode(item) === key);
      if (exists) {
        return previous.filter((item) => normalizeCode(item) !== key);
      }
      return [...previous, code];
    });
  };

  const onSubmit = () => {
    toast.info(`TODO: submit identity access update for ${customerId}`, {
      description: `Selected: ${selectedCodes.join(", ") || "-"}`,
    });
    onOpenChange(false);
  };

  return (
    <Modal
      open={open}
      onCancel={() => onOpenChange(false)}
      onOk={onSubmit}
      okText="Submit"
      cancelText="Cancel"
      title="Edit Identity Access Methods"
      description="Update the identity access methods available for this customer."
      centered
      width={760}
      className="max-h-[85vh]"
    >
      <div className="space-y-3 pb-2">
        <div className="rounded-md border border-border/80 bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
          <p className="font-semibold text-foreground">Default info</p>
          <p className="mt-1">Items marked as (Default) are pre-selected.</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Identity Access Methods *</p>
          <SearchInput
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Start typing to search..."
          />
        </div>

        <div className="max-h-72 overflow-auto rounded-md border border-border/80 p-3">
          {optionsQuery.isLoading ? (
            <p className="text-sm text-muted-foreground">Loading identity access options...</p>
          ) : optionsQuery.isError ? (
            <p className="text-sm text-destructive">Failed to load identity access options.</p>
          ) : filteredOptions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No identity access found.</p>
          ) : (
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {filteredOptions.map((option) => {
                const key = normalizeCode(option.code);
                const isChecked = selectedCodes.some((item) => normalizeCode(item) === key) || option.isDefault;
                const isDisabled = option.isDefault;
                return (
                  <label
                    key={option.code}
                    className={`flex items-start gap-2 rounded-md border border-border/70 px-2.5 py-2 ${
                      isDisabled ? "cursor-not-allowed bg-muted/20" : "cursor-pointer hover:bg-muted/30"
                    }`}
                    aria-disabled={isDisabled}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onToggleCode(option.code)}
                      className={`mt-0.5 h-4 w-4 accent-primary ${
                        isDisabled ? "pointer-events-none opacity-100" : ""
                      }`}
                    />
                    <span className="text-sm text-foreground">
                      {option.code}
                      {option.isDefault ? " (Default)" : ""}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default EditIdentityAccessDialog;
