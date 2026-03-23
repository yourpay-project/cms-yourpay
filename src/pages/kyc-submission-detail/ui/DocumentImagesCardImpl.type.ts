import type { KycDocumentImage } from "@/entities/kyc-submission";

/**
 * Props for `DocumentImagesCardImpl` (document thumbnails + dialogs).
 */
export interface DocumentImagesCardProps {
  idDocument?: KycDocumentImage;
  selfieDocument?: KycDocumentImage;
  canCheckProgress: boolean;
  /** Label for the ID document upload zone (e.g. KTP for Indonesia). */
  idDocumentUploadLabel?: string;
  onIdDocumentFilesSelected?: (files: File[]) => void;
  onSelfieFilesSelected?: (files: File[]) => void;
  uploadsDisabled?: boolean;
}

