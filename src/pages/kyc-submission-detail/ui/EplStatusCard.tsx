import type { FC } from "react";
import { Input, SelectDropdown, type SelectDropdownOption } from "@/shared/ui";
import { Modal } from "@/shared/ui/modal";

import type { EplStatusValue } from "../lib/epl-status-options";
import { EPL_STATUS_EDIT_OPTIONS } from "../lib/epl-status-options";
import type { RejectReasonOption } from "@/features/kyc-submission-verification";

export interface EplStatusCardProps {
  currentStatus: EplStatusValue;
  eplStatusDraft: EplStatusValue;
  hasEplStatusChanged: boolean;
  onChangeEplStatus: (next: EplStatusValue) => void;
  isStatusModalOpen: boolean;
  onCloseStatusModal: () => void;
  rejectReasons: RejectReasonOption[];
  isRejectReasonsLoading: boolean;
  selectedRejectReasonCode: string;
  onChangeRejectReasonCode: (next: string) => void;
  onSave: () => void;
  isSaving: boolean;
}

/**
 * Right-column card for editing the submission "EPL status".
 * Uses the verification submission `status` field as the current backend source of truth.
 */
export const EplStatusCard: FC<EplStatusCardProps> = ({
  currentStatus,
  eplStatusDraft,
  hasEplStatusChanged,
  onChangeEplStatus,
  isStatusModalOpen,
  onCloseStatusModal,
  rejectReasons,
  isRejectReasonsLoading,
  selectedRejectReasonCode,
  onChangeRejectReasonCode,
  onSave,
  isSaving,
}) => {
  const selectedRejectReason = rejectReasons.find((item) => item.code === selectedRejectReasonCode);
  const isRejected = eplStatusDraft === "rejected";
  const statusOptions: SelectDropdownOption[] = EPL_STATUS_EDIT_OPTIONS.map((opt) => ({
    value: opt.value,
    label: opt.label,
  }));
  const rejectReasonOptions: SelectDropdownOption[] = rejectReasons.map((reason) => ({
    value: reason.code,
    label: `${reason.title} - ${reason.code}`,
    description: reason.description,
  }));

  return (
    <Modal
      open={isStatusModalOpen}
      onCancel={onCloseStatusModal}
      onOk={() => {
        if (hasEplStatusChanged) {
          onSave();
        }
      }}
      confirmLoading={isSaving}
      okText={isSaving ? "Saving..." : "Save Changes"}
      cancelText="Cancel"
      title="Update Status"
      width={760}
      centered
    >
      <div className="space-y-4 pb-2">
        <div className="grid gap-3 md:grid-cols-2">
          <Input id="kyc-epl-status" size="md" type="text" label="EPL Status" disabled value={currentStatus.toUpperCase()} />

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
            <label className="text-sm font-medium text-foreground" htmlFor="kyc-rejection-reason">
              Rejection Reason<span className="text-destructive">*</span>
            </label>
            <SelectDropdown
              id="kyc-rejection-reason"
              value={selectedRejectReasonCode}
              onChange={onChangeRejectReasonCode}
              options={rejectReasonOptions}
              isLoading={isRejectReasonsLoading}
              searchable
            />
            {selectedRejectReason?.description ? (
              <p className="text-xs text-muted-foreground">{selectedRejectReason.description}</p>
            ) : null}
          </div>
        ) : null}

        {!hasEplStatusChanged ? (
          <p className="text-xs text-muted-foreground">No status changes yet.</p>
        ) : null}
      </div>
    </Modal>
  );
};

