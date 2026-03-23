/**
 * Modal-manager UI types and runtime payload assertions.
 */

/** Props for `ModalGlobalLoadingOverlay`. */
export interface ModalGlobalLoadingOverlayProps { enabled: boolean }

/** Payload for `KycEnableEditConfirmModal` data. */
export interface KycEnableEditConfirmModalData { onConfirm?: () => void }
/** Callbacks injected by modal container for `KycEnableEditConfirmModal`. */
export interface KycEnableEditConfirmModalCallbacks { onClose: () => void; onCloseAll: () => void }
/** Full props for `KycEnableEditConfirmModal`. */
export type KycEnableEditConfirmModalProps = KycEnableEditConfirmModalData & KycEnableEditConfirmModalCallbacks;

/** Runtime assertion for `KYC_ENABLE_EDIT_CONFIRM_MODAL` payloads. @param data - Unknown payload injected by the modal store. @throws Error if payload shape is invalid. */
export function assertKycEnableEditConfirmModalData(data: unknown): asserts data is KycEnableEditConfirmModalData {
  if (data == null) throw new Error("KYC_ENABLE_EDIT_CONFIRM_MODAL data is required.");
  if (typeof data !== "object") throw new Error("KYC_ENABLE_EDIT_CONFIRM_MODAL data must be an object.");
  const record = data as Record<string, unknown>;
  if ("onConfirm" in record && record.onConfirm !== undefined && typeof record.onConfirm !== "function") {
    throw new Error("KYC_ENABLE_EDIT_CONFIRM_MODAL.onConfirm must be a function.");
  }
}

/** Payload for `KycGenerateOcrConfirmModal` data. */
export interface KycGenerateOcrConfirmModalData { onConfirm?: () => void }
/** Callbacks injected by modal container for `KycGenerateOcrConfirmModal`. */
export interface KycGenerateOcrConfirmModalCallbacks { onClose: () => void; onCloseAll: () => void }
/** Full props for `KycGenerateOcrConfirmModal`. */
export type KycGenerateOcrConfirmModalProps = KycGenerateOcrConfirmModalData & KycGenerateOcrConfirmModalCallbacks;

/** Runtime assertion for `KYC_GENERATE_OCR_CONFIRM_MODAL` payloads. @param data - Unknown payload injected by the modal store. @throws Error if payload shape is invalid. */
export function assertKycGenerateOcrConfirmModalData(data: unknown): asserts data is KycGenerateOcrConfirmModalData {
  if (data == null) throw new Error("KYC_GENERATE_OCR_CONFIRM_MODAL data is required.");
  if (typeof data !== "object") throw new Error("KYC_GENERATE_OCR_CONFIRM_MODAL data must be an object.");
  const record = data as Record<string, unknown>;
  if ("onConfirm" in record && record.onConfirm !== undefined && typeof record.onConfirm !== "function") {
    throw new Error("KYC_GENERATE_OCR_CONFIRM_MODAL.onConfirm must be a function.");
  }
}

/** One check payload in `KycVerificationCheckModal` verification map. */
export interface KycVerificationCheckData { status?: string; score?: number; failedReason?: string }
/** Verification map for `KycVerificationCheckModal`. */
export interface KycDocumentVerificationData {
  aml?: KycVerificationCheckData; arc_unique?: KycVerificationCheckData; ktp_data_feedback?: KycVerificationCheckData;
  ktp_data_valid?: KycVerificationCheckData; ktp_unique?: KycVerificationCheckData; passport_unique?: KycVerificationCheckData;
  selfie_liveness_valid?: KycVerificationCheckData; similar_photo?: KycVerificationCheckData;
}
/** Document image payload for `KycVerificationCheckModal`. */
export interface KycDocumentImageModalData { imageUrl?: string }

/** Payload for `KycVerificationCheckModal` data. */
export interface KycVerificationCheckModalData {
  onRunChecks?: () => Promise<void>; isRunning?: boolean; idDocument?: KycDocumentImageModalData;
  selfieDocument?: KycDocumentImageModalData; verification?: KycDocumentVerificationData;
}
/** Callbacks injected by modal container for `KycVerificationCheckModal`. */
export interface KycVerificationCheckModalCallbacks { onClose: () => void; onCloseAll: () => void }
/** Full props for `KycVerificationCheckModal`. */
export type KycVerificationCheckModalProps = KycVerificationCheckModalCallbacks & KycVerificationCheckModalData;

/** Props for a single rendered verification check item. */
export interface CheckItemProps { label: string; status?: string; score?: number; failedReason?: string }

const VERIFICATION_CHECK_DATA_KEYS = ["status", "score", "failedReason"] as const;
type VerificationCheckDataKey = (typeof VERIFICATION_CHECK_DATA_KEYS)[number];
function isObject(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null; }

/** Runtime assertion for `idDocument` / `selfieDocument` payloads. @param data - Unknown nested document payload. @throws Error if payload shape is invalid. */
export function assertKycDocumentImageModalData(data: unknown): asserts data is KycDocumentImageModalData {
  if (!isObject(data)) throw new Error("KYC_VERIFICATION_CHECK_MODAL.idDocument/selfieDocument must be an object.");
  const allowedKeys = new Set(["imageUrl"]);
  for (const key of Object.keys(data)) if (!allowedKeys.has(key)) throw new Error(`KYC_VERIFICATION_CHECK_MODAL document data contains an invalid key: ${key}`);
  if ("imageUrl" in data && (data as Record<string, unknown>).imageUrl !== undefined && typeof (data as Record<string, unknown>).imageUrl !== "string") {
    throw new Error("KYC_VERIFICATION_CHECK_MODAL documentData.imageUrl must be a string.");
  }
}

/** Runtime assertion for a single verification check payload. @param data - Unknown check payload. @throws Error if payload shape is invalid. */
export function assertKycVerificationCheckData(data: unknown): asserts data is KycVerificationCheckData {
  if (!isObject(data)) throw new Error("KYC_VERIFICATION_CHECK_MODAL verification entry must be an object.");
  const allowedKeys = new Set<VerificationCheckDataKey>(VERIFICATION_CHECK_DATA_KEYS);
  for (const key of Object.keys(data)) if (!allowedKeys.has(key as VerificationCheckDataKey)) {
    throw new Error(`KYC_VERIFICATION_CHECK_MODAL verification entry contains an invalid key: ${key}`);
  }
  const record = data as Record<string, unknown>;
  if ("status" in record && record.status !== undefined && typeof record.status !== "string") throw new Error("KYC_VERIFICATION_CHECK_MODAL verification.status must be a string.");
  if ("score" in record && record.score !== undefined && typeof record.score !== "number") throw new Error("KYC_VERIFICATION_CHECK_MODAL verification.score must be a number.");
  if ("failedReason" in record && record.failedReason !== undefined && typeof record.failedReason !== "string") throw new Error("KYC_VERIFICATION_CHECK_MODAL verification.failedReason must be a string.");
}

/** Runtime assertion for the full `verification` payload. @param data - Unknown verification object. @throws Error if payload shape is invalid. */
export function assertKycDocumentVerificationData(data: unknown): asserts data is KycDocumentVerificationData {
  if (!isObject(data)) throw new Error("KYC_VERIFICATION_CHECK_MODAL.verification must be an object.");
  const allowedKeys = new Set(["aml","arc_unique","ktp_data_feedback","ktp_data_valid","ktp_unique","passport_unique","selfie_liveness_valid","similar_photo"]);
  for (const key of Object.keys(data)) if (!allowedKeys.has(key)) throw new Error(`KYC_VERIFICATION_CHECK_MODAL.verification contains an invalid key: ${key}`);
  const record = data as Record<string, unknown>;
  for (const key of Object.keys(record)) { const value = record[key]; if (value === undefined) continue; assertKycVerificationCheckData(value); }
}

/** Runtime assertion for `KYC_VERIFICATION_CHECK_MODAL` payloads. @param data - Unknown payload injected by the modal store. @throws Error if payload shape is invalid. */
export function assertKycVerificationCheckModalData(data: unknown): asserts data is KycVerificationCheckModalData {
  if (!isObject(data)) throw new Error("KYC_VERIFICATION_CHECK_MODAL data must be an object.");
  const allowedKeys = new Set(["onRunChecks","isRunning","idDocument","selfieDocument","verification"]);
  for (const key of Object.keys(data)) if (!allowedKeys.has(key)) throw new Error(`KYC_VERIFICATION_CHECK_MODAL data contains an invalid key: ${key}`);
  const record = data as Record<string, unknown>;
  if ("onRunChecks" in record && record.onRunChecks !== undefined && typeof record.onRunChecks !== "function") throw new Error("KYC_VERIFICATION_CHECK_MODAL.onRunChecks must be a function.");
  if ("isRunning" in record && record.isRunning !== undefined && typeof record.isRunning !== "boolean") throw new Error("KYC_VERIFICATION_CHECK_MODAL.isRunning must be a boolean.");
  if ("idDocument" in record && record.idDocument !== undefined) assertKycDocumentImageModalData(record.idDocument);
  if ("selfieDocument" in record && record.selfieDocument !== undefined) assertKycDocumentImageModalData(record.selfieDocument);
  if ("verification" in record && record.verification !== undefined) assertKycDocumentVerificationData(record.verification);
}

