import type { FC } from "react";
import { useParams } from "@tanstack/react-router";

import { ApiClientError } from "@/shared/api";
import { useModalStore } from "@/widgets/modal-manager";
import { PageSkeleton } from "@/shared/ui";

import { useKycSubmissionDetailPageLogic } from "..";
import { eplStatusClassByValue } from "../lib/epl-status-options";
import { KycUserDataCards } from "./KycUserDataCards";
import { KycSubmissionDetailPageHeader } from "./KycSubmissionDetailPageHeader";
import { KycSubmissionDetailPageRightColumn } from "./KycSubmissionDetailPageRightColumn";

/**
 * Route-level content page for `/kyc-submission/$id`.
 */
const KycSubmissionDetailPage: FC = () => {
  const { id } = useParams({ from: "/kyc-submission/$id" });
  const logic = useKycSubmissionDetailPageLogic({ id });
  const { query, detail } = logic;
  const { open } = useModalStore();

  if (query.isLoading) return <PageSkeleton />;

  if (query.isError) {
    // Helps debugging why the detail fetch fails (mapping/parsing vs HTTP).
    console.error("KYC submission detail load error:", query.error);
    const apiError = query.error instanceof ApiClientError ? query.error : null;
    const message =
      (apiError as ApiClientError | null)?.status === 403
        ? "You do not have permission to view KYC submission details."
        : "Failed to load KYC submission details. Please try again.";
    return <p className="text-sm text-destructive">{message}</p>;
  }

  if (!detail) return <p className="text-sm text-muted-foreground">KYC submission detail is unavailable.</p>;

  const canCheckProgress = Boolean(detail.arcNumber && detail.idDocument?.imageUrl && detail.selfieDocument?.imageUrl);
  const idDocumentUploadLabel =
    String(detail.countryCode ?? "").toUpperCase() === "ID" ? "Update KTP Photo" : "Update ID Document Photo";

  return (
    <div className="box-border flex w-full min-w-0 max-w-full flex-col gap-4 md:min-h-0 md:flex-1 md:overflow-hidden">
      <KycSubmissionDetailPageHeader
        id={detail.id}
        fullname={detail.fullname}
        currentStatus={logic.currentStatus}
        eplStatusClass={eplStatusClassByValue[logic.currentStatus]}
        isStatusEditable={logic.isStatusEditable}
        onOpenStatusModal={() => {
          open("KYC_EPL_STATUS_MODAL", {
            submissionId: detail.id,
            countryCode: detail.countryCode,
            currentStatus: logic.currentStatus,
            onSubmitted: () => {
              void query.refetch();
            },
          });
        }}
      />

      <div className="flex w-full min-w-0 max-w-full flex-col gap-4 overflow-x-hidden md:min-h-0 md:flex-1 md:flex-row md:gap-4 md:overflow-y-auto md:pr-1">
        <div className="w-full min-w-0 max-w-full overflow-x-hidden pr-0 md:min-h-0 md:flex-1">
          <KycUserDataCards
            countryCode={detail.countryCode}
            submissionStatus={logic.currentStatus}
            draft={logic.leftDraft}
            setDraft={logic.setLeftDraft}
            isEditable={!logic.isLeftLocked}
            isSaving={logic.isSavingLeftEdit}
            onOpenEnableEditConfirm={() => {
              open("KYC_ENABLE_EDIT_CONFIRM_MODAL", {
                onConfirm: logic.onConfirmEnableEdit,
              });
            }}
            onUpdateDataFromOcr={() => {
              open("KYC_GENERATE_OCR_CONFIRM_MODAL", {
                onConfirm: logic.onConfirmGenerateFromOcr,
              });
            }}
            onCancelEdit={logic.onCancelLeftEdit}
            onSaveEdit={logic.onSaveLeftEdit}
          />
        </div>

        <KycSubmissionDetailPageRightColumn
          idDocumentPreview={logic.idDocumentPreview}
          selfieDocumentPreview={logic.selfieDocumentPreview}
          canCheckProgress={canCheckProgress}
          idDocumentUploadLabel={idDocumentUploadLabel}
          onIdDocumentFilesSelected={logic.onIdDocumentFilesSelected}
          onSelfieFilesSelected={logic.onSelfieFilesSelected}
        />
      </div>
    </div>
  );
};

export default KycSubmissionDetailPage;

