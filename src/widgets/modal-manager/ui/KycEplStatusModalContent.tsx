import type { FC } from "react";

import { Input, LabeledSelectField, SelectDropdown, type SelectDropdownOption } from "@/shared/ui";

import type { EplStatusValue } from "./KycEplStatus.type";

export interface KycEplStatusModalContentProps {
  currentStatus: EplStatusValue;
  eplStatusDraft: EplStatusValue;
  onChangeEplStatus: (next: EplStatusValue) => void;
  isRejected: boolean;

  selectedRejectReasonCode: string;
  onChangeRejectReasonCode: (next: string) => void;

  statusOptions: SelectDropdownOption[];
  rejectReasonOptions: SelectDropdownOption[];
  isRejectReasonsLoading: boolean;
  selectedRejectReasonDescription?: string;
}

export const KycEplStatusModalContent: FC<KycEplStatusModalContentProps> = ({
  currentStatus,
  eplStatusDraft,
  onChangeEplStatus,
  isRejected,
  selectedRejectReasonCode,
  onChangeRejectReasonCode,
  statusOptions,
  rejectReasonOptions,
  isRejectReasonsLoading,
  selectedRejectReasonDescription,
}) => {
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
        <SelectDropdown
          id="kyc-status-select"
          value={eplStatusDraft}
          onChange={(value) => onChangeEplStatus(value as EplStatusValue)}
          options={statusOptions}
          searchable={false}
          allowClear={false}
        />
      </div>

      {isRejected ? (
        <div className="space-y-1.5">
          <LabeledSelectField
            id="kyc-rejection-reason"
            label="Rejection Reason"
            required
            labelClassName="text-sm font-medium text-foreground"
            value={selectedRejectReasonCode}
            onChange={onChangeRejectReasonCode}
            options={rejectReasonOptions}
            isLoading={isRejectReasonsLoading}
            searchable
          />
          {selectedRejectReasonDescription ? (
            <p className="text-xs text-muted-foreground">{selectedRejectReasonDescription}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

