import { useMemo } from "react";

import type { KycDocumentVerification } from "@/entities/kyc-submission";

import { VERIFICATION_CHECK_LABELS } from "../lib/verification-check-labels";

export interface VerificationCheckItem {
  key: string;
  label: string;
  status?: string;
  score?: number;
  failedReason?: string;
}

/**
 * Normalizes `verification` payload into UI-friendly check items.
 */
export function useVerificationCheckItems(verification?: KycDocumentVerification) {
  return useMemo<VerificationCheckItem[]>(() => {
    if (!verification) return [];

    const entries = [
      { key: "aml", fallbackLabel: "AML", item: verification.aml },
      { key: "arc_unique", fallbackLabel: "ARC Unique", item: verification.arc_unique },
      { key: "ktp_data_feedback", fallbackLabel: "KTP Data Feedback", item: verification.ktp_data_feedback },
      { key: "ktp_data_valid", fallbackLabel: "KTP Data Valid", item: verification.ktp_data_valid },
      { key: "ktp_unique", fallbackLabel: "KTP Unique", item: verification.ktp_unique },
      { key: "passport_unique", fallbackLabel: "Passport Unique", item: verification.passport_unique },
      { key: "selfie_liveness_valid", fallbackLabel: "Selfie Liveness", item: verification.selfie_liveness_valid },
      { key: "similar_photo", fallbackLabel: "Photo Similarity", item: verification.similar_photo },
    ];

    return entries
      .filter((entry) => Boolean(entry.item))
      .map((entry) => ({
        key: entry.key,
        label: VERIFICATION_CHECK_LABELS[entry.key] ?? entry.fallbackLabel,
        status: entry.item?.status,
        score: entry.item?.score,
        failedReason: entry.item?.failedReason,
      }));
  }, [verification]);
}

