import { lazy } from "react";
import type { ModalKey } from "./modal-contract";

export const MODAL_LOADERS: Record<ModalKey, () => Promise<unknown>> = {
  KYC_ENABLE_EDIT_CONFIRM_MODAL: () => import("../ui/KycEnableEditConfirmModal"),
  KYC_GENERATE_OCR_CONFIRM_MODAL: () => import("../ui/KycGenerateOcrConfirmModal"),
  KYC_VERIFICATION_CHECK_MODAL: () => import("../ui/KycVerificationCheckModal"),
};

export const MODAL_COMPONENT_REGISTRY = {
  KYC_ENABLE_EDIT_CONFIRM_MODAL: lazy(() =>
    import("../ui/KycEnableEditConfirmModal").then((module) => ({
      default: module.KycEnableEditConfirmModal,
    })),
  ),
  KYC_GENERATE_OCR_CONFIRM_MODAL: lazy(() =>
    import("../ui/KycGenerateOcrConfirmModal").then((module) => ({
      default: module.KycGenerateOcrConfirmModal,
    })),
  ),
  KYC_VERIFICATION_CHECK_MODAL: lazy(() =>
    import("../ui/KycVerificationCheckModal").then((module) => ({
      default: module.KycVerificationCheckModal,
    })),
  ),
} as const;
