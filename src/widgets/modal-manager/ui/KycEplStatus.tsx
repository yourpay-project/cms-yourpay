import type { FC } from "react";
import { useEffect, useMemo, useState } from "react";

import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { useRejectReasonsQuery, useUpdateVerificationStatusMutation } from "@/features/kyc-submission-verification";

import type { RejectReasonOption } from "@/features/kyc-submission-verification";
import type { UpdateStatusVerifSubmissionRequest } from "@/shared/api/generated";
import { Button } from "@/shared/ui";

import type { KycEplStatusProps, EplStatusValue } from "./KycEplStatus.type";
import { KycEplStatusModalContent } from "./KycEplStatusModalContent";

const EPL_STATUS_EDIT_OPTIONS: Array<{ value: "approved" | "rejected"; label: string }> = [
  { value: "approved", label: "approved" },
  { value: "rejected", label: "rejected" },
];

export const KycEplStatus: FC<KycEplStatusProps> = ({
  open,
  onClose,
  submissionId,
  countryCode,
  currentStatus,
  onSubmitted,
}) => {
  const [eplStatusDraft, setEplStatusDraft] = useState<EplStatusValue>(currentStatus);
  const [selectedRejectReasonCode, setSelectedRejectReasonCode] = useState<string>("");

  const rejectReasonsQuery = useRejectReasonsQuery(countryCode);
  const refetchRejectReasons = rejectReasonsQuery.refetch;
  const updateMutation = useUpdateVerificationStatusMutation();

  useEffect(() => {
    if (!open) return;
    setEplStatusDraft(currentStatus);
    setSelectedRejectReasonCode("");
    // Ensure we have fresh reject reasons when opening the modal.
    void refetchRejectReasons();
  }, [open, currentStatus, countryCode, refetchRejectReasons]);

  useEffect(() => {
    if (eplStatusDraft !== "rejected") {
      setSelectedRejectReasonCode("");
    }
  }, [eplStatusDraft]);

  const hasEplStatusChanged = eplStatusDraft !== currentStatus;
  const isRejected = eplStatusDraft === "rejected";
  let submitLabel = "Save Changes";
  if (updateMutation.isPending) {
    submitLabel = "Saving...";
  }
  let submitLeadingNode: React.ReactNode = null;
  if (updateMutation.isPending) {
    submitLeadingNode = <Loader2 className="h-4 w-4 animate-spin" />;
  }

  const selectedRejectReason = useMemo(() => {
    const reasons = rejectReasonsQuery.data ?? [];
    return reasons.find((item) => item.code === selectedRejectReasonCode);
  }, [rejectReasonsQuery.data, selectedRejectReasonCode]);

  const statusOptions = useMemo(
    () =>
      EPL_STATUS_EDIT_OPTIONS.map((opt) => ({
        value: opt.value,
        label: opt.label,
      })),
    [],
  );

  const rejectReasonOptions = useMemo(() => {
    const reasons: RejectReasonOption[] = rejectReasonsQuery.data ?? [];
    return reasons.map((reason) => ({
      value: reason.code,
      label: `${reason.title} - ${reason.code}`,
      description: reason.description,
    }));
  }, [rejectReasonsQuery.data]);

  const onSubmit = (): void => {
    if (!hasEplStatusChanged) return;

    if (eplStatusDraft === "rejected") {
      const selectedReason = selectedRejectReason;
      if (!selectedReason) {
        toast.error("Please select a rejection reason.");
        return;
      }
    }

    const body: UpdateStatusVerifSubmissionRequest = {};
    if (eplStatusDraft === "rejected") {
      body.rejection_code = selectedRejectReason?.code ?? "";
      const rejectReasonDescription = selectedRejectReason?.description?.trim();
      if (rejectReasonDescription) {
        body.rejection_notes = rejectReasonDescription;
      } else {
        body.rejection_notes = selectedRejectReason?.title ?? "";
      }
    }

    updateMutation.mutate(
      {
        id: submissionId,
        status: eplStatusDraft,
        body,
      },
      {
        onSuccess: () => {
          onSubmitted?.();
          onClose();
        },
      },
    );
  };

  return (
    <div className="flex flex-col">
      <KycEplStatusModalContent
        currentStatus={currentStatus}
        eplStatusDraft={eplStatusDraft}
        onChangeEplStatus={setEplStatusDraft}
        hasEplStatusChanged={hasEplStatusChanged}
        isRejected={isRejected}
        selectedRejectReasonCode={selectedRejectReasonCode}
        onChangeRejectReasonCode={setSelectedRejectReasonCode}
        statusOptions={statusOptions}
        rejectReasonOptions={rejectReasonOptions}
        isRejectReasonsLoading={rejectReasonsQuery.isLoading}
        selectedRejectReasonDescription={selectedRejectReason?.description}
      />

      <div className="flex items-center justify-end gap-2 pb-5 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="button" onClick={onSubmit} disabled={updateMutation.isPending}>
          {submitLeadingNode}
          {submitLabel}
        </Button>
      </div>
    </div>
  );
};

