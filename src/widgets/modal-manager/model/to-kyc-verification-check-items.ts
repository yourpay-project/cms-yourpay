import type {
  CheckItemProps,
  KycDocumentVerificationData,
  KycVerificationCheckData,
} from "../ui/KycVerificationCheck.type";

const VERIFICATION_CHECK_LABELS: Record<string, string> = {
  aml: "AML",
  arc_unique: "ARC Unique",
  ktp_data_feedback: "KTP Data Feedback",
  ktp_data_valid: "KTP Data Valid",
  ktp_unique: "KTP Unique",
  passport_unique: "Passport Unique",
  selfie_liveness_valid: "Selfie Liveness",
  similar_photo: "Photo Similarity",
};

interface VerificationEntry {
  key: string;
  fallbackLabel: string;
  item?: KycVerificationCheckData;
}

function toVerificationEntries(verification: KycDocumentVerificationData): VerificationEntry[] {
  return [
    { key: "aml", fallbackLabel: "AML", item: verification.aml },
    { key: "arc_unique", fallbackLabel: "ARC Unique", item: verification.arc_unique },
    { key: "ktp_data_feedback", fallbackLabel: "KTP Data Feedback", item: verification.ktp_data_feedback },
    { key: "ktp_data_valid", fallbackLabel: "KTP Data Valid", item: verification.ktp_data_valid },
    { key: "ktp_unique", fallbackLabel: "KTP Unique", item: verification.ktp_unique },
    { key: "passport_unique", fallbackLabel: "Passport Unique", item: verification.passport_unique },
    { key: "selfie_liveness_valid", fallbackLabel: "Selfie Liveness", item: verification.selfie_liveness_valid },
    { key: "similar_photo", fallbackLabel: "Photo Similarity", item: verification.similar_photo },
  ];
}

/**
 * Maps verification payload into UI-ready check items.
 *
 * @param verification Verification map payload from modal data.
 * @returns Flat list of renderable check items.
 */
export function toKycVerificationCheckItems(
  verification?: KycDocumentVerificationData,
): Array<CheckItemProps & { key: string }> {
  if (!verification) {
    return [];
  }

  return toVerificationEntries(verification)
    .filter((entry) => Boolean(entry.item))
    .map((entry) => ({
      key: entry.key,
      label: VERIFICATION_CHECK_LABELS[entry.key] ?? entry.fallbackLabel,
      status: entry.item?.status,
      score: entry.item?.score,
      failedReason: entry.item?.failedReason,
    }));
}
