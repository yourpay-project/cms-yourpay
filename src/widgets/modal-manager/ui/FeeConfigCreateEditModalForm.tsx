import type { FC } from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

import { Input } from "@/shared/ui";

import type { FeeConfigFormValues } from "@/pages/fee-config/model";

export interface FeeConfigCreateEditModalFormProps {
  register: UseFormRegister<FeeConfigFormValues>;
  errors: FieldErrors<FeeConfigFormValues>;
  activeStatus: boolean;
  onActiveChange: (next: boolean) => void;
}

export const FeeConfigCreateEditModalForm: FC<FeeConfigCreateEditModalFormProps> = ({
  register,
  errors,
  activeStatus,
  onActiveChange,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          label="Configuration Name"
          placeholder="Service Charge"
          status={errors.configurationName ? "error" : undefined}
          helperText={errors.configurationName?.message}
          {...register("configurationName")}
        />
        <Input
          label="Service"
          placeholder="Select a service"
          status={errors.service ? "error" : undefined}
          helperText={errors.service?.message}
          {...register("service")}
        />
        <Input label="Provider" value="Yourpay" disabled {...register("provider")} />
        <Input
          label="Currency"
          placeholder="Select currency"
          status={errors.currency ? "error" : undefined}
          helperText={errors.currency?.message}
          {...register("currency")}
        />
        <Input
          label="Fee type"
          placeholder="fixed / percentage"
          status={errors.feeType ? "error" : undefined}
          helperText={errors.feeType?.message}
          {...register("feeType")}
        />
        <Input
          label="Fee mode"
          placeholder="exclusive / inclusive"
          status={errors.feeMode ? "error" : undefined}
          helperText={errors.feeMode?.message}
          {...register("feeMode")}
        />
        <Input
          label="Amount"
          placeholder="0.00"
          status={errors.amount ? "error" : undefined}
          helperText={errors.amount?.message}
          {...register("amount")}
        />
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-border"
            checked={activeStatus}
            onChange={(event) => onActiveChange(event.target.checked)}
          />
          <span className="text-sm text-foreground">Active Status</span>
        </div>
      </div>
    </div>
  );
};

