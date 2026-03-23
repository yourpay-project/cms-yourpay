import type { KycDocumentImage } from "@/entities/kyc-submission";

/**
 * Props for `KycSubmissionDetailPageRightColumn`.
 */
export interface KycSubmissionDetailPageRightColumnProps {
  idDocumentPreview?: KycDocumentImage;
  selfieDocumentPreview?: KycDocumentImage;
  canCheckProgress: boolean;
  idDocumentUploadLabel: string;
  onIdDocumentFilesSelected: (files: File[]) => void;
  onSelfieFilesSelected: (files: File[]) => void;
}

