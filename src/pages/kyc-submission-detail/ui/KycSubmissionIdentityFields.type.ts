import type { KycLeftEditDraft } from "../model/use-kyc-submission-detail-logic";

/**
 * Props for `KycSubmissionIdentityFields`.
 */
export interface KycSubmissionIdentityFieldsProps {
  draft: KycLeftEditDraft;
  setDraft: (
    next: KycLeftEditDraft | ((prev: KycLeftEditDraft) => KycLeftEditDraft),
  ) => void;
  isEditable: boolean;
  whatsappHref?: string;
}

