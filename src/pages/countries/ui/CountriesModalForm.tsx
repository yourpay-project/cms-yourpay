import type { FC } from "react";

import { Button, Input } from "@/shared/ui";

export interface CountriesModalFormProps {
  editing: boolean;
  code: string;
  name: string;
  isActive: boolean;
  errors: {
    code?: string;
    name?: string;
  };
  setCode: (next: string) => void;
  setName: (next: string) => void;
  setIsActive: (next: boolean) => void;
}

/**
 * Form fields inside the Countries create/edit modal.
 */
export const CountriesModalForm: FC<CountriesModalFormProps> = ({
  editing,
  code,
  name,
  isActive,
  errors,
  setCode,
  setName,
  setIsActive,
}) => {
  return (
    <div className="mt-4 flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <Input
          label="Country Code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          disabled={!!editing}
          status={errors.code ? "error" : undefined}
          helperText={errors.code ?? "Letters and numbers allowed (will be converted to uppercase)"}
        />
      </div>
      <div className="flex flex-col gap-1">
        <Input
          label="Country Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          status={errors.name ? "error" : undefined}
          helperText={errors.name}
        />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-muted-foreground">Status</span>
        <div className="inline-flex gap-2 rounded-md bg-muted/40 p-1 text-xs">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-pressed={isActive}
            className={`h-7 px-3 text-xs rounded ${isActive ? "bg-success text-success-foreground" : "bg-transparent"}`}
            onClick={() => setIsActive(true)}
          >
            Active
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-pressed={!isActive}
            className={`h-7 px-3 text-xs rounded ${
              !isActive ? "bg-destructive text-destructive-foreground" : "bg-transparent"
            }`}
            onClick={() => setIsActive(false)}
          >
            Inactive
          </Button>
        </div>
      </div>
    </div>
  );
};

