import type { FC } from "react";

import { Button } from "@/shared/ui";
import { useCountriesCreateEditLogic } from "@/widgets/modal-manager";

import { CountriesModalForm } from "./CountriesModalForm";
import type { CountriesCreateEditProps } from "./CountriesCreateEdit.type";

export const CountriesCreateEdit: FC<CountriesCreateEditProps> = ({
  open,
  onClose,
  mode,
  row,
  onAfterChange,
}) => {
  const logic = useCountriesCreateEditLogic({
    open,
    mode,
    row,
    onAfterChange,
    onClose,
  });

  return (
    <div className="space-y-4">
      <div className="space-y-1 pb-1">
        <h3 className="text-base font-semibold text-foreground">
          {logic.title}
        </h3>
        <p className="text-sm text-muted-foreground">
          {logic.description}
        </p>
      </div>

      <CountriesModalForm
        editing={Boolean(logic.editing)}
        code={logic.code}
        name={logic.name}
        isActive={logic.isActive}
        errors={logic.errors}
        setCode={logic.setCode}
        setName={logic.setName}
        setIsActive={logic.setIsActive}
      />

      <div className="flex items-center justify-end gap-2 pb-5 pt-4">
        <Button type="button" variant="outline" onClick={onClose} disabled={logic.isSubmitting}>
          Cancel
        </Button>
        <Button type="button" onClick={() => void logic.onSubmit()} disabled={logic.isSubmitting}>
          {logic.submitButtonLabel}
        </Button>
      </div>
    </div>
  );
};

