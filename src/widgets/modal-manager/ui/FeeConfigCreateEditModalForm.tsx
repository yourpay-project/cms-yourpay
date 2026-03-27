import type { FC } from "react";

import { FormCheckbox } from "@/shared/ui/form/FormCheckbox";
import { FormInput } from "@/shared/ui/form/FormInput";

/**
 * Fee config modal field set bound to RHF form context.
 *
 * @returns Form field grid for creating or editing fee configurations.
 */
export const FeeConfigCreateEditModalForm: FC = () => {
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
        <FormCheckbox name="isActive" label="Active Status" />
      </div>
    </div>
  );
};

