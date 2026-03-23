import type { KycLeftEditDraft } from "../model/use-kyc-submission-detail-logic";

/**
 * Props for `KycDocumentInformationCard`.
 */
export interface KycDocumentInformationCardProps {
  countryCode?: string;
  draft: KycLeftEditDraft;
  setDraft: (
    next: KycLeftEditDraft | ((prev: KycLeftEditDraft) => KycLeftEditDraft),
  ) => void;
  isEditable: boolean;
}

