import type { KycDocumentImage, KycDocumentVerification } from "@/entities/kyc-submission";

/**
 * Props for `VerificationCheckModal`.
 */
export interface VerificationCheckModalProps {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  onRunChecks: () => Promise<void>;
  isRunning: boolean;

  idDocument?: KycDocumentImage;
  selfieDocument?: KycDocumentImage;
  verification?: KycDocumentVerification;
}

