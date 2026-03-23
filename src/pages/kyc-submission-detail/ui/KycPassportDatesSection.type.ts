import type { KycLeftEditDraft } from "../model/use-kyc-submission-detail-logic";

/**
 * Props for `KycPassportDatesSection`.
 */
export interface KycPassportDatesSectionProps {
  draft: KycLeftEditDraft;
  setDraft: (
    next: KycLeftEditDraft | ((prev: KycLeftEditDraft) => KycLeftEditDraft),
  ) => void;
  isEditable: boolean;
  locked: boolean;
}

