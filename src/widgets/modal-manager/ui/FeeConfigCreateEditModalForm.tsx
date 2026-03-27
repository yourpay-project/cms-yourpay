import type { FC } from "react";

import { FormInput } from "@/shared/ui/form/FormInput";

/**
 * Props for fee config modal field grid content.
 */
export interface FeeConfigCreateEditModalFormProps {
  activeStatus: boolean;
  onActiveChange: (next: boolean) => void;
}

/**
 * Fee config modal field set bound to RHF form context.
 *
 * @param props - Active status value and checkbox update handler.
 * @returns Form field grid for creating or editing fee configurations.
 */
export const FeeConfigCreateEditModalForm: FC<FeeConfigCreateEditModalFormProps> = ({
  activeStatus,
  onActiveChange,
}) => {
  const activeCheckboxId = "fee-config-active-status";

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormInput
          name="configurationName"
          label="Configuration Name"
          placeholder="Service Charge"
        />
        <FormInput
          name="service"
          label="Service"
          placeholder="Select a service"
        />
        <FormInput name="provider" label="Provider" disabled />
        <FormInput
          name="currency"
          label="Currency"
          placeholder="Select currency"
        />
        <FormInput
          name="feeType"
          label="Fee type"
          placeholder="fixed / percentage"
        />
        <FormInput
          name="feeMode"
          label="Fee mode"
          placeholder="exclusive / inclusive"
        />
        <FormInput
          name="amount"
          label="Amount"
          placeholder="0.00"
        />
        <label className="flex items-center gap-3" htmlFor={activeCheckboxId}>
          <input
            id={activeCheckboxId}
            name="isActive"
            type="checkbox"
            className="h-4 w-4 rounded border-border"
            checked={activeStatus}
            onChange={(event) => onActiveChange(event.target.checked)}
          />
          <span className="text-sm text-foreground">Active Status</span>
        </label>
      </div>
    </div>
  );
};

