import type { FC } from "react";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";

import { useCreateCountryMutation, useUpdateCountryMutation } from "@/features/country-management";
import type { Country } from "@/entities/country";
import { Button } from "@/shared/ui";

import { CountriesModalForm } from "./CountriesModalForm";
import type { CountriesCreateEditModalProps } from "./CountriesCreateEditModal.type";

const countryFormSchema = z.object({
  code: z.string().min(1, "Code is required"),
  name: z.string().min(1, "Name is required"),
});

type CountryFormErrors = {
  code?: string;
  name?: string;
};

export const CountriesCreateEditModal: FC<CountriesCreateEditModalProps> = ({
  open,
  onClose,
  mode,
  row,
  onAfterChange,
}) => {
  const createMutation = useCreateCountryMutation();
  const updateMutation = useUpdateCountryMutation();

  const isSubmitting = useMemo(
    () => createMutation.isPending || updateMutation.isPending,
    [createMutation.isPending, updateMutation.isPending],
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

  return (
    <div className="space-y-4">
      <div className="space-y-1 pb-1">
        <h3 className="text-base font-semibold text-foreground">
          {mode === "edit" ? "Edit Country" : "Create Country"}
        </h3>
        <p className="text-sm text-muted-foreground">
          {mode === "edit" ? "Update country code, name, or status." : "Create a new country record."}
        </p>
      </div>

      <CountriesModalForm
        editing={!!editing}
        code={code}
        name={name}
        isActive={isActive}
        errors={errors}
        setCode={(next) => setCode(next)}
        setName={(next) => setName(next)}
        setIsActive={(next) => setIsActive(next)}
      />

      <div className="flex items-center justify-end gap-2 pb-5 pt-4">
        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="button" onClick={() => void onSubmit()} disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : mode === "edit" ? "Update" : "Create"}
        </Button>
      </div>
    </div>
  );
};

