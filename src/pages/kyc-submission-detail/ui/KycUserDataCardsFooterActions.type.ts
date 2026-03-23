import type { KycLeftEditDraft } from "../model/use-kyc-submission-detail-logic";

/**
 * Props for `KycUserDataCardsFooterActions`.
 */
export interface KycUserDataCardsFooterActionsProps {
  showRejectionNote: boolean;
  draft: KycLeftEditDraft;
  isEditable: boolean;
  isSaving: boolean;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
}

