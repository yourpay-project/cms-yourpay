import type { FC } from "react";
import { useFormContext } from "react-hook-form";

import { Input, type SelectDropdownOption } from "@/shared/ui";
import { FormSelect } from "@/shared/ui/form/FormSelect";

import type { EplStatusValue } from "./KycEplStatus.type";
import type { KycEplStatusFormValues } from "./KycEplStatus.type";

/**
 * Props for `KycEplStatusModalContent`.
 */
export interface KycEplStatusModalContentProps {
  currentStatus: EplStatusValue;
  statusOptions: SelectDropdownOption[];
  rejectReasonOptions: SelectDropdownOption[];
  isRejectReasonsLoading: boolean;
}

/**
 * Content section for EPL status update modal form.
 *
 * @param props - Current status and select option sources for status/reason fields.
 * @returns Form-controlled status and rejection reason controls.
 */
export const KycEplStatusModalContent: FC<KycEplStatusModalContentProps> = ({
  currentStatus,
  statusOptions,
  rejectReasonOptions,
  isRejectReasonsLoading,
}) => {
  const { watch } = useFormContext<KycEplStatusFormValues>();
  const statusValue = watch("status");
  const rejectionCode = watch("rejectionCode");
  const isRejected = statusValue === "rejected";
  const selectedRejectReasonDescription = rejectReasonOptions.find(
    (item) => item.value === rejectionCode,
  )?.description;

  return (
    <div className="space-y-4 pb-2">
      <div className="grid gap-3 md:grid-cols-2">
        <Input
          id="kyc-epl-status"
          size="md"
          type="text"
          label="EPL Status"
          disabled
          value={currentStatus.toUpperCase()}
        />
        <FormSelect
          name="status"
          id="kyc-status-select"
          label="Update Status"
          options={statusOptions}
          searchable={false}
          allowClear={false}
          description="Select the new EPL verification status."
        />
      </div>

      {isRejected ? (
        <div className="space-y-1.5">
          <FormSelect
            name="rejectionCode"
            id="kyc-rejection-reason"
            label="Rejection Reason"
            options={rejectReasonOptions}
            isLoading={isRejectReasonsLoading}
            searchable
            allowClear={false}
            description="Choose one rejection reason to continue."
          />
          {selectedRejectReasonDescription ? (
            <p className="text-xs text-muted-foreground">{selectedRejectReasonDescription}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

