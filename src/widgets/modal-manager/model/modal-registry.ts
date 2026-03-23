import { lazy } from "react";
import type { ReactNode } from "react";
import type { ModalKey } from "./modal-contract";

export type ModalShellConfig = {
  width?: number | string;
  centered?: boolean;
  className?: string;
  title?: ReactNode;
  description?: ReactNode;
};

export const MODAL_LOADERS: Record<ModalKey, () => Promise<unknown>> = {
  KYC_ENABLE_EDIT_CONFIRM_MODAL: () => import("../ui/KycEnableEditConfirmModal"),
  KYC_GENERATE_OCR_CONFIRM_MODAL: () => import("../ui/KycGenerateOcrConfirmModal"),
  KYC_VERIFICATION_CHECK_MODAL: () => import("../ui/KycVerificationCheckModal"),
  USER_BLOCK_CONFIRM_MODAL: () => import("../ui/UserBlockConfirmModal"),
  USER_CLOSE_CONFIRM_MODAL: () => import("../ui/UserCloseConfirmModal"),
  USER_VIEW_DEVICES_MODAL: () => import("../ui/UserViewDevicesModal"),
  USER_VIEW_WALLETS_MODAL: () => import("../ui/UserViewWalletsModal"),
  USER_EDIT_IDENTITY_ACCESS_MODAL: () => import("../ui/UserEditIdentityAccessModal"),
  FEE_CONFIG_CREATE_EDIT_MODAL: () => import("../ui/FeeConfigCreateEditModal"),
  KYC_EPL_STATUS_MODAL: () => import("../ui/KycEplStatusModal"),
  COUNTRIES_CREATE_EDIT_MODAL: () => import("../ui/CountriesCreateEditModal"),
  KYC_DOCUMENT_IMAGES_PROGRESS_MODAL: () => import("../ui/KycDocumentImagesProgressModal"),
  KYC_DOCUMENT_IMAGES_SINGLE_PREVIEW_MODAL: () =>
    import("../ui/KycDocumentImagesSinglePreviewModal"),
  KYC_DOCUMENT_IMAGES_COMPARE_MODAL: () => import("../ui/KycDocumentImagesCompareModal"),
};

export const MODAL_SHELL_CONFIG: Record<ModalKey, ModalShellConfig> = {
  KYC_ENABLE_EDIT_CONFIRM_MODAL: {
    centered: true,
    title: "Update User Data",
    description: "Are you sure you want to enable editing mode to update this user's KYC documents?",
  },
  KYC_GENERATE_OCR_CONFIRM_MODAL: {
    centered: true,
    title: "Generate Data from OCR",
    description: "This will automatically extract and fill form data from the document image using OCR.",
  },
  KYC_VERIFICATION_CHECK_MODAL: {
    width: 860,
    className: "max-h-[80vh]",
    title: "Document Verification Checks",
    description: "Preview the documents and trigger verification checks.",
  },
  USER_BLOCK_CONFIRM_MODAL: {
    width: 440,
    centered: true,
    className: "max-h-[85vh]",
    title: null,
  },
  USER_CLOSE_CONFIRM_MODAL: {
    width: 460,
    centered: true,
    className: "max-h-[90vh]",
    title: null,
  },
  USER_VIEW_DEVICES_MODAL: {
    width: 920,
    centered: true,
    className: "max-h-[85vh]",
    title: "Registered Devices",
  },
  USER_VIEW_WALLETS_MODAL: {
    width: 960,
    centered: true,
    className: "max-h-[85vh]",
    title: "Customer Wallets",
  },
  USER_EDIT_IDENTITY_ACCESS_MODAL: {
    width: 760,
    centered: true,
    className: "max-h-[85vh]",
    title: "Edit Identity Access Methods",
    description: "Update the identity access methods available for this customer.",
  },
  FEE_CONFIG_CREATE_EDIT_MODAL: {
    centered: true,
    // Title is dynamic (create vs edit) -> modal content renders its own heading.
    title: null,
  },
  KYC_EPL_STATUS_MODAL: {
    width: 760,
    centered: true,
    title: "Update Status",
  },
  COUNTRIES_CREATE_EDIT_MODAL: {
    width: 760,
    centered: true,
    title: null,
    className: "max-h-[90vh]",
  },
  KYC_DOCUMENT_IMAGES_PROGRESS_MODAL: {
    width: 760,
    centered: true,
    title: "Document Progress",
    className: "max-h-[90vh]",
  },
  KYC_DOCUMENT_IMAGES_SINGLE_PREVIEW_MODAL: {
    width: 1040,
    centered: true,
    title: null,
    className: "max-h-[90vh]",
  },
  KYC_DOCUMENT_IMAGES_COMPARE_MODAL: {
    width: 1240,
    centered: true,
    title: null,
    className: "max-h-[90vh]",
  },
};

export const MODAL_COMPONENT_REGISTRY = {
  KYC_ENABLE_EDIT_CONFIRM_MODAL: lazy(() =>
    import("../ui/KycEnableEditConfirmModal").then((module) => ({
      default: module.KycEnableEditConfirmModal,
    }))),
  KYC_GENERATE_OCR_CONFIRM_MODAL: lazy(() =>
    import("../ui/KycGenerateOcrConfirmModal").then((module) => ({
      default: module.KycGenerateOcrConfirmModal,
    }))),
  KYC_VERIFICATION_CHECK_MODAL: lazy(() =>
    import("../ui/KycVerificationCheckModal").then((module) => ({
      default: module.KycVerificationCheckModal,
    }))),
  USER_BLOCK_CONFIRM_MODAL: lazy(() =>
    import("../ui/UserBlockConfirmModal").then((module) => ({
      default: module.UserBlockConfirmModal,
    }))),
  USER_CLOSE_CONFIRM_MODAL: lazy(() =>
    import("../ui/UserCloseConfirmModal").then((module) => ({
      default: module.UserCloseConfirmModal,
    }))),
  USER_VIEW_DEVICES_MODAL: lazy(() =>
    import("../ui/UserViewDevicesModal").then((module) => ({
      default: module.UserViewDevicesModal,
    }))),
  USER_VIEW_WALLETS_MODAL: lazy(() =>
    import("../ui/UserViewWalletsModal").then((module) => ({
      default: module.UserViewWalletsModal,
    }))),
  USER_EDIT_IDENTITY_ACCESS_MODAL: lazy(() =>
    import("../ui/UserEditIdentityAccessModal").then((module) => ({
      default: module.UserEditIdentityAccessModal,
    }))),
  FEE_CONFIG_CREATE_EDIT_MODAL: lazy(() =>
    import("../ui/FeeConfigCreateEditModal").then((module) => ({
      default: module.FeeConfigCreateEditModal,
    }))),
  KYC_EPL_STATUS_MODAL: lazy(() =>
    import("../ui/KycEplStatusModal").then((module) => ({
      default: module.KycEplStatusModal,
    }))),
  COUNTRIES_CREATE_EDIT_MODAL: lazy(() =>
    import("../ui/CountriesCreateEditModal").then((module) => ({
      default: module.CountriesCreateEditModal,
    }))),
  KYC_DOCUMENT_IMAGES_PROGRESS_MODAL: lazy(() =>
    import("../ui/KycDocumentImagesProgressModal").then((module) => ({
      default: module.KycDocumentImagesProgressModal,
    }))),
  KYC_DOCUMENT_IMAGES_SINGLE_PREVIEW_MODAL: lazy(() =>
    import("../ui/KycDocumentImagesSinglePreviewModal").then((module) => ({
      default: module.KycDocumentImagesSinglePreviewModal,
    }))),
  KYC_DOCUMENT_IMAGES_COMPARE_MODAL: lazy(() =>
    import("../ui/KycDocumentImagesCompareModal").then((module) => ({
      default: module.KycDocumentImagesCompareModal,
    }))),
} as const;
