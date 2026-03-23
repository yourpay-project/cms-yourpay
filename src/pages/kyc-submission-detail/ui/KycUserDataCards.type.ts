import type { KycLeftEditDraft } from "../model/use-kyc-submission-detail-logic";

/**
 * Props for `KycUserDataCards`.
 */
export interface KycUserDataCardsProps {
  countryCode?: string;
  submissionStatus: string;
  draft: KycLeftEditDraft;
  setDraft: (
    next: KycLeftEditDraft | ((prev: KycLeftEditDraft) => KycLeftEditDraft),
  ) => void;
  isEditable: boolean;
  isSaving: boolean;
  onOpenEnableEditConfirm: () => void;
  onUpdateDataFromOcr: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
}

