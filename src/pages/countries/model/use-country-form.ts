import { useCallback, useState } from "react";

import type { Country } from "@/entities/country";
import {
  useCreateCountryMutation,
  useDeleteCountryMutation,
  useUpdateCountryMutation,
} from "@/features/country-management";

/**
 * Optional configuration for {@link useCountryForm}.
 *
 * @property onAfterChange Callback invoked after a successful create, update, or delete mutation.
 */
interface UseCountryFormOptions {
  onAfterChange?: () => void;
}

/**
 * Page‑level hook that encapsulates all state and mutations for the Countries (API) modal.
 *
 * It centralises the logic for:
 * - opening the dialog in create or edit mode,
 * - managing the form fields (code, name, isActive),
 * - calling the generated Operator Countries mutations,
 * - and closing the dialog plus optional post‑change callbacks.
 *
 * @param options Optional {@link UseCountryFormOptions} to hook into lifecycle events.
 * @returns Stable state and action handlers for the countries form modal.
 */
export function useCountryForm(options?: UseCountryFormOptions) {
  const [editing, setEditing] = useState<Country | null>(null);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const createMutation = useCreateCountryMutation();
  const updateMutation = useUpdateCountryMutation();
  const deleteMutation = useDeleteCountryMutation();

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const resetForm = useCallback(() => {
    setEditing(null);
    setCode("");
    setName("");
    setIsActive(true);
  }, []);

  const openForCreate = useCallback(() => {
    resetForm();
    setIsDialogOpen(true);
  }, [resetForm]);

  const openForEdit = useCallback((country: Country) => {
    setEditing(country);
    setCode(country.code);
    setName(country.name);
    setIsActive(country.isActive);
    setIsDialogOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setIsDialogOpen(false);
    resetForm();
  }, [resetForm]);

  const submit = useCallback(async () => {
    if (!code.trim() || !name.trim()) return;

    if (editing) {
      await updateMutation.mutateAsync({
        code: code.trim(),
        name: name.trim(),
        is_active: isActive,
      });
    } else {
      await createMutation.mutateAsync({
        code: code.trim(),
        name: name.trim(),
        is_active: isActive,
      });
    }

    closeDialog();
    options?.onAfterChange?.();
  }, [editing, updateMutation, createMutation, code, name, isActive, closeDialog, options]);

  const remove = useCallback(
    async (country: Country) => {
      await deleteMutation.mutateAsync({ code: country.code });
      options?.onAfterChange?.();
    },
    [deleteMutation, options],
  );

  return {
    // state
    editing,
    code,
    name,
    isActive,
    isDialogOpen,
    isSubmitting,
    // setters
    setCode,
    setName,
    setIsActive,
    setIsDialogOpen,
    // actions
    openForCreate,
    openForEdit,
    closeDialog,
    submit,
    remove,
  };
}

