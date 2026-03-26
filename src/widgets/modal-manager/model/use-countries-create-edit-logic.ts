import { useEffect, useMemo, useState } from "react";
import { z } from "zod";

import { useCreateCountryMutation, useUpdateCountryMutation } from "@/features/country-management";
import type { Country } from "@/entities/country";

const countryFormSchema = z.object({
  code: z.string().min(1, "Code is required"),
  name: z.string().min(1, "Name is required"),
});

export type CountryFormErrors = {
  code?: string;
  name?: string;
};

export interface UseCountriesCreateEditLogicParams {
  open: boolean;
  mode: "create" | "edit";
  row?: Country;
  onAfterChange?: () => void;
  onClose: () => void;
}

export interface UseCountriesCreateEditLogicResult {
  isSubmitting: boolean;
  editing: Country | null;
  code: string;
  name: string;
  isActive: boolean;
  errors: CountryFormErrors;
  submitButtonLabel: string;
  title: string;
  description: string;
  setCode: (next: string) => void;
  setName: (next: string) => void;
  setIsActive: (next: boolean) => void;
  onSubmit: () => Promise<void>;
}

/**
 * Manages state + submit logic for Countries create/edit modal content.
 *
 * Keeps `ui/` thin and makes the modal easier to test and maintain.
 *
 * @param params - {@link UseCountriesCreateEditLogicParams}
 * @returns Derived state + handlers for the Countries modal.
 */
export function useCountriesCreateEditLogic(
  params: UseCountriesCreateEditLogicParams
): UseCountriesCreateEditLogicResult {
  const { open, mode, row, onAfterChange, onClose } = params;

  const createMutation = useCreateCountryMutation();
  const updateMutation = useUpdateCountryMutation();

  const isSubmitting = useMemo(
    () => createMutation.isPending || updateMutation.isPending,
    [createMutation.isPending, updateMutation.isPending]
  );

  const [editing, setEditing] = useState<Country | null>(null);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [errors, setErrors] = useState<CountryFormErrors>({});

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && row) {
      setEditing(row);
      setCode(row.code);
      setName(row.name);
      setIsActive(row.isActive);
      setErrors({});
      return;
    }

    setEditing(null);
    setCode("");
    setName("");
    setIsActive(true);
    setErrors({});
  }, [mode, open, row]);

  const onSubmit = async (): Promise<void> => {
    const parsed = countryFormSchema.safeParse({
      code: code.trim(),
      name: name.trim(),
    });

    if (!parsed.success) {
      const nextErrors: CountryFormErrors = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (field === "code" || field === "name") {
          nextErrors[field] = issue.message;
        }
      }
      setErrors(nextErrors);
      return;
    }

    setErrors({});

    const payload = {
      code: code.trim(),
      name: name.trim(),
      is_active: isActive,
    };

    if (editing) {
      await updateMutation.mutateAsync(payload);
    } else {
      await createMutation.mutateAsync(payload);
    }

    onAfterChange?.();
    onClose();
  };

  let submitButtonLabel = "Create";
  if (mode === "edit") submitButtonLabel = "Update";
  if (isSubmitting) submitButtonLabel = "Saving...";

  const title = mode === "edit" ? "Edit Country" : "Create Country";
  const description =
    mode === "edit"
      ? "Update country code, name, or status."
      : "Create a new country record.";

  return {
    isSubmitting,
    editing,
    code,
    name,
    isActive,
    errors,
    submitButtonLabel,
    title,
    description,
    setCode,
    setName,
    setIsActive,
    onSubmit,
  };
}

