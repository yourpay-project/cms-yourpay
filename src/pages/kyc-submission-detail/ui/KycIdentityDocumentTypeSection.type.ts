import type { KycLeftEditDraft } from "../model/use-kyc-submission-detail-logic";

/**
 * Props for `KycIdentityDocumentTypeSection`.
 */
export interface KycIdentityDocumentTypeSectionProps {
  draft: KycLeftEditDraft;
  setDraft: (
    next: KycLeftEditDraft | ((prev: KycLeftEditDraft) => KycLeftEditDraft),
  ) => void;
  isEditable: boolean;
  isPassport: boolean;
  locked: boolean;
  documentTypeOptions: Array<{ value: string; label: string }>;
  onDocumentTypeChange: (value: string) => void;
}

