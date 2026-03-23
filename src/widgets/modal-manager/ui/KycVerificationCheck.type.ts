import type { BaseModalCallbacks } from "./BaseModalCallbacks.type";

/**
 * One check payload in `KycVerificationCheck` verification map.
 */
export interface KycVerificationCheckData {
  status?: string;
  score?: number;
  failedReason?: string;
}

/**
 * Verification map for `KycVerificationCheck`.
 */
export interface KycDocumentVerificationData {
  aml?: KycVerificationCheckData;
  arc_unique?: KycVerificationCheckData;
  ktp_data_feedback?: KycVerificationCheckData;
  ktp_data_valid?: KycVerificationCheckData;
  ktp_unique?: KycVerificationCheckData;
  passport_unique?: KycVerificationCheckData;
  selfie_liveness_valid?: KycVerificationCheckData;
  similar_photo?: KycVerificationCheckData;
}

/**
 * Document image payload for `KycVerificationCheck`.
 */
export interface KycDocumentImageData {
  imageUrl?: string;
}

/**
 * Payload for `KycVerificationCheck` data.
 */
export interface KycVerificationCheckDataPayload {
  onRunChecks?: () => Promise<void>;
  isRunning?: boolean;
  idDocument?: KycDocumentImageData;
  selfieDocument?: KycDocumentImageData;
  verification?: KycDocumentVerificationData;
}

/**
 * Props for `KycVerificationCheck`.
 */
export type KycVerificationCheckProps = KycVerificationCheckDataPayload &
  BaseModalCallbacks;

/**
 * Props for a single rendered verification check item.
 */
export interface CheckItemProps {
  label: string;
  status?: string;
  score?: number;
  failedReason?: string;
}

