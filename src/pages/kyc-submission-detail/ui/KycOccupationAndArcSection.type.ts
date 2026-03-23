import type { KycLeftEditDraft } from "../model/use-kyc-submission-detail-logic";

/**
 * Props for `KycOccupationAndArcSection`.
 */
export interface KycOccupationAndArcSectionProps {
  draft: KycLeftEditDraft;
  setDraft: (
    next: KycLeftEditDraft | ((prev: KycLeftEditDraft) => KycLeftEditDraft),
  ) => void;
  isEditable: boolean;
  locked: boolean;
  isIndonesia: boolean;
  occupationOptions: Array<{ value: string; label: string }>;
  occupationsLoading: boolean;
  onOccupationChange: (value: string) => void;
}

