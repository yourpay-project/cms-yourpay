import type {
  KycEnableEditConfirmModalData,
  KycGenerateOcrConfirmModalData,
  KycVerificationCheckModalData,
} from "../ui/types";
import {
  assertKycEnableEditConfirmModalData,
  assertKycGenerateOcrConfirmModalData,
  assertKycVerificationCheckModalData,
} from "../ui/types";

export interface ModalDataMap {
  KYC_ENABLE_EDIT_CONFIRM_MODAL: KycEnableEditConfirmModalData;
  KYC_GENERATE_OCR_CONFIRM_MODAL: KycGenerateOcrConfirmModalData;
  KYC_VERIFICATION_CHECK_MODAL: KycVerificationCheckModalData;
}

export type ModalKey = keyof ModalDataMap;

export type ModalCommonCallbacks = {
  onClose: () => void;
  onCloseAll: () => void;
};

export type ModalDataByKey<K extends ModalKey> = ModalDataMap[K];
export type ModalPropsByKey<K extends ModalKey> = ModalCommonCallbacks & ModalDataByKey<K>;

export const MODAL_DATA_ASSERTION_MAP: { [K in ModalKey]: (data: unknown) => asserts data is ModalDataMap[K] } = {
  KYC_ENABLE_EDIT_CONFIRM_MODAL: assertKycEnableEditConfirmModalData,
  KYC_GENERATE_OCR_CONFIRM_MODAL: assertKycGenerateOcrConfirmModalData,
  KYC_VERIFICATION_CHECK_MODAL: assertKycVerificationCheckModalData,
};

