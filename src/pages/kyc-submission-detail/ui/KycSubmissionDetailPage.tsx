import type { FC } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { ChevronDown, ChevronLeft, Copy } from "lucide-react";
import { toast } from "sonner";
import { ApiClientError } from "@/shared/api";
import { PageSkeleton, Button } from "@/shared/ui";
import { Modal } from "@/shared/ui/modal";

import { useKycSubmissionDetailPageLogic } from "..";
import { EplStatusCard } from "./EplStatusCard";
import { DocumentImagesCard } from "./DocumentImagesCard";
import { KycUserDataCards } from "./KycUserDataCards";
import { VerificationCheckModal } from "./VerificationCheckModal";
import { eplStatusClassByValue } from "../lib/epl-status-options";

/**
 * Route-level content page for `/kyc-submission/$id`.
 *
 * - **Mobile (`<md`)**: single column; natural document height + `overflow-x-hidden`; page scrolls in `AppLayout` `main` (no nested `flex-1` trap).
 * - **Desktop (`md+`)**: title row stays fixed; content row uses one shared scroll area in two-column layout.
 */
const KycSubmissionDetailPage: FC = () => {
  const { id } = useParams({ from: "/kyc-submission/$id" });
  const logic = useKycSubmissionDetailPageLogic({ id });
  const { query, detail } = logic;

  if (query.isLoading) {
    return <PageSkeleton />;
  }

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

  if (!detail) {
    return <p className="text-sm text-muted-foreground">KYC submission detail is unavailable.</p>;
  }

  const canCheckProgress = Boolean(detail.arcNumber && detail.idDocument?.imageUrl && detail.selfieDocument?.imageUrl);

  const copySubmissionId = () => {
    void navigator.clipboard.writeText(detail.id).then(() => {
      toast.success("ID copied to clipboard.");
    });
  };

  return (
    <div className="box-border flex w-full min-w-0 max-w-full flex-col gap-4 md:min-h-0 md:flex-1 md:overflow-hidden">
      <div className="flex w-full min-w-0 max-w-full shrink-0 flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 items-center gap-2">
          <Button asChild variant="ghost" size="icon" type="button" className="h-8 w-8 shrink-0">
            <Link to="/kyc-submission" aria-label="Back to list">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="min-w-0 text-xl font-semibold leading-tight break-words">
            KYC Submission Detail{detail.fullname ? ` (${detail.fullname})` : ""}
          </h2>
        </div>

        <div className="flex w-full min-w-0 flex-col items-stretch gap-1 md:w-auto md:items-end">
          <button
            type="button"
            className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium uppercase ${eplStatusClassByValue[logic.currentStatus]} ${
              logic.currentStatus === "pending" ? "cursor-pointer" : "cursor-default"
            }`}
            onClick={() => {
              if (logic.currentStatus === "pending" && logic.isStatusEditable) {
                logic.setIsStatusModalOpen(true);
              }
            }}
          >
            {`Status: ${logic.currentStatus}`}
            {logic.currentStatus === "pending" ? <ChevronDown className="h-3 w-3" /> : null}
          </button>
          <div className="flex max-w-full items-center justify-end gap-1.5 text-xs text-muted-foreground">
            <span className="truncate font-mono" title={detail.id}>
              ID: {detail.id}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0 text-muted-foreground hover:text-foreground"
              aria-label="Copy submission ID"
              onClick={copySubmissionId}
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex w-full min-w-0 max-w-full flex-col gap-4 overflow-x-hidden md:min-h-0 md:flex-1 md:flex-row md:gap-4 md:overflow-y-auto md:pr-1">
        <div className="w-full min-w-0 max-w-full overflow-x-hidden pr-0 md:min-h-0 md:flex-1">
          <KycUserDataCards
            countryCode={detail.countryCode}
            submissionStatus={logic.currentStatus}
            draft={logic.leftDraft}
            setDraft={logic.setLeftDraft}
            isEditable={!logic.isLeftLocked}
            isSaving={logic.isSavingLeftEdit}
            onOpenEnableEditConfirm={logic.onOpenEnableEditConfirm}
            onUpdateDataFromOcr={logic.onUpdateDataFromOcr}
            onCancelEdit={logic.onCancelLeftEdit}
            onSaveEdit={logic.onSaveLeftEdit}
          />
        </div>

        <div className="w-full min-w-0 max-w-full shrink-0 overflow-x-hidden md:w-96 md:min-h-0 md:shrink-0 md:pl-1">
          <div className="flex flex-col gap-4">
            <EplStatusCard
              currentStatus={logic.currentStatus}
              eplStatusDraft={logic.eplStatusDraft}
              hasEplStatusChanged={logic.hasEplStatusChanged}
              onChangeEplStatus={logic.setEplStatusDraft}
              isStatusModalOpen={logic.isStatusModalOpen}
              onCloseStatusModal={() => logic.setIsStatusModalOpen(false)}
              rejectReasons={logic.rejectReasons}
              isRejectReasonsLoading={logic.isRejectReasonsLoading}
              selectedRejectReasonCode={logic.selectedRejectReasonCode}
              onChangeRejectReasonCode={logic.setSelectedRejectReasonCode}
              onSave={logic.onSaveEplStatus}
              isSaving={logic.isSavingEplStatus}
            />

            <DocumentImagesCard
              idDocument={logic.idDocumentPreview}
              selfieDocument={logic.selfieDocumentPreview}
              canCheckProgress={canCheckProgress}
              idDocumentUploadLabel={
                String(detail.countryCode ?? "").toUpperCase() === "ID" ? "Update KTP Photo" : "Update ID Document Photo"
              }
              onIdDocumentFilesSelected={logic.onIdDocumentFilesSelected}
              onSelfieFilesSelected={logic.onSelfieFilesSelected}
            />
          </div>
        </div>
      </div>

      <VerificationCheckModal
        open={logic.isCheckModalOpen}
        onOpenChange={logic.setIsCheckModalOpen}
        onRunChecks={logic.onRunVerificationChecks}
        isRunning={logic.isRunningVerificationChecks}
        idDocument={logic.idDocumentPreview}
        selfieDocument={logic.selfieDocumentPreview}
        verification={detail.documentVerification}
      />

      <Modal
        open={logic.isEnableEditConfirmOpen}
        onCancel={() => logic.setIsEnableEditConfirmOpen(false)}
        onOk={logic.onConfirmEnableEdit}
        okText="Yes, Enable Editing"
        cancelText="Cancel"
        title="Update User Data"
        description="Are you sure you want to enable editing mode to update this user's KYC documents?"
        centered
      />

      <Modal
        open={logic.isGenerateFromOcrModalOpen}
        onCancel={() => logic.setIsGenerateFromOcrModalOpen(false)}
        onOk={logic.onConfirmGenerateFromOcr}
        okText="Yes, Generate from OCR"
        cancelText="Cancel"
        title="Generate Data from OCR"
        description="This will automatically extract and fill form data from the document image using OCR."
        centered
      />
    </div>
  );
};

export default KycSubmissionDetailPage;

