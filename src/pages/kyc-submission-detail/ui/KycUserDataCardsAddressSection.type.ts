import type { KycLeftEditDraft } from "../model/use-kyc-submission-detail-logic";
import type { useKycIndonesiaAddressFields } from "../model/use-kyc-indonesia-address-fields";

/**
 * Props for `KycUserDataCardsAddressSection`.
 */
export interface KycUserDataCardsAddressSectionProps {
  draft: KycLeftEditDraft;
  setDraft: (
    next: KycLeftEditDraft | ((prev: KycLeftEditDraft) => KycLeftEditDraft),
  ) => void;
  isEditable: boolean;
  indonesiaAddress: ReturnType<typeof useKycIndonesiaAddressFields>;
}

