import type { KycDocumentImage } from "@/entities/kyc-submission";

/**
 * Props for `VerificationCheckModalDocumentPreviewCard`.
 */
export interface VerificationCheckModalDocumentPreviewCardProps {
  title: string;
  image?: KycDocumentImage;
  emptyText: string;
}

