import type { FC } from "react";
import { useEffect, useMemo } from "react";
import { z } from "zod";

import { Loader2 } from "lucide-react";

import { useRejectReasonsQuery, useUpdateVerificationStatusMutation } from "@/features/kyc-submission-verification";

import type { RejectReasonOption } from "@/features/kyc-submission-verification";
import type { UpdateStatusVerifSubmissionRequest } from "@/shared/api/generated";
import { Button } from "@/shared/ui";
import { Form } from "@/shared/ui/form/Form";

import type {
  KycEplStatusFormValues,
  KycEplStatusProps,
  EplStatusValue,
} from "./KycEplStatus.type";
import { KycEplStatusModalContent } from "./KycEplStatusModalContent";

const EPL_STATUS_EDIT_OPTIONS: Array<{ value: "approved" | "rejected"; label: string }> = [
  { value: "approved", label: "APPROVED" },
  { value: "rejected", label: "REJECTED" },
];

const kycEplStatusSchema = z
  .object({
    status: z.string().min(1, "Please select the updated status."),
    rejectionCode: z.string().optional().default(""),
  })
  .superRefine((values, context) => {
    if (values.status === "rejected" && !values.rejectionCode) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["rejectionCode"],
        message: "Please select a rejection reason.",
      });
    }
  });

/**
 * Modal workflow for updating KYC EPL status and optional rejection reason.
 *
 * @param props - Modal lifecycle props and submission context.
 * @returns Modal content with status form and action footer.
 */
export const KycEplStatus: FC<KycEplStatusProps> = ({
  open,
  onClose,
  submissionId,
  countryCode,
  currentStatus,
  onSubmitted,
}) => {
  const rejectReasonsQuery = useRejectReasonsQuery(countryCode);
  const refetchRejectReasons = rejectReasonsQuery.refetch;
  const updateMutation = useUpdateVerificationStatusMutation();
  const isLoading = updateMutation.isPending;

  useEffect(() => {
    if (!open) return;
    void refetchRejectReasons();
  }, [open, currentStatus, countryCode, refetchRejectReasons]);

  const submitLabel = isLoading ? "Saving..." : "Save Changes";
  const submitLeadingNode = isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null;

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

  const onSubmit = (values: KycEplStatusFormValues): void => {
    const selectedReason = (rejectReasonsQuery.data ?? []).find(
      (item) => item.code === values.rejectionCode,
    );

    const body: UpdateStatusVerifSubmissionRequest = {};
    if (values.status === "rejected") {
      body.rejection_code = selectedReason?.code ?? "";
      const rejectReasonDescription = selectedReason?.description?.trim();
      if (rejectReasonDescription) {
        body.rejection_notes = rejectReasonDescription;
      } else {
        body.rejection_notes = selectedReason?.title ?? "";
      }
    }

    updateMutation.mutate(
      {
        id: submissionId,
        status: values.status as EplStatusValue,
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
      <Form
        schema={kycEplStatusSchema}
        onSubmit={onSubmit}
        formConfig={{
          defaultValues: {
            status: "",
            rejectionCode: "",
          },
        }}
        className="flex flex-col"
      >
        <KycEplStatusModalContent
          currentStatus={currentStatus}
          statusOptions={statusOptions}
          rejectReasonOptions={rejectReasonOptions}
          isRejectReasonsLoading={rejectReasonsQuery.isLoading}
        />

        <div className="flex items-center justify-end gap-2 pb-5 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {submitLeadingNode}
            {submitLabel}
          </Button>
        </div>
      </Form>
    </div>
  );
};

