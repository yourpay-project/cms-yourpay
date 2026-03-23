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
  KYC_ENABLE_EDIT_CONFIRM_MODAL: () => import("../ui/KycEnableEditConfirm"),
  KYC_GENERATE_OCR_CONFIRM_MODAL: () => import("../ui/KycGenerateOcrConfirm"),
  KYC_VERIFICATION_CHECK_MODAL: () => import("../ui/KycVerificationCheck"),
  USER_BLOCK_CONFIRM_MODAL: () => import("../ui/UserBlockConfirm"),
  USER_CLOSE_CONFIRM_MODAL: () => import("../ui/UserCloseConfirm"),
  USER_VIEW_DEVICES_MODAL: () => import("../ui/UserViewDevices"),
  USER_VIEW_WALLETS_MODAL: () => import("../ui/UserViewWallets"),
  USER_EDIT_IDENTITY_ACCESS_MODAL: () => import("../ui/UserEditIdentityAccess"),
  FEE_CONFIG_CREATE_EDIT_MODAL: () => import("../ui/FeeConfigCreateEdit"),
  KYC_EPL_STATUS_MODAL: () => import("../ui/KycEplStatus"),
  COUNTRIES_CREATE_EDIT_MODAL: () => import("../ui/CountriesCreateEdit"),
  KYC_DOCUMENT_IMAGES_PROGRESS_MODAL: () => import("../ui/KycDocumentImagesProgress"),
  KYC_DOCUMENT_IMAGES_SINGLE_PREVIEW_MODAL: () =>
    import("../ui/KycDocumentImagesSinglePreview"),
  KYC_DOCUMENT_IMAGES_COMPARE_MODAL: () => import("../ui/KycDocumentImagesCompare"),
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
    import("../ui/KycEnableEditConfirm").then((module) => ({
      default: module.KycEnableEditConfirm,
    }))),
  KYC_GENERATE_OCR_CONFIRM_MODAL: lazy(() =>
    import("../ui/KycGenerateOcrConfirm").then((module) => ({
      default: module.KycGenerateOcrConfirm,
    }))),
  KYC_VERIFICATION_CHECK_MODAL: lazy(() =>
    import("../ui/KycVerificationCheck").then((module) => ({
      default: module.KycVerificationCheck,
    }))),
  USER_BLOCK_CONFIRM_MODAL: lazy(() =>
    import("../ui/UserBlockConfirm").then((module) => ({
      default: module.UserBlockConfirm,
    }))),
  USER_CLOSE_CONFIRM_MODAL: lazy(() =>
    import("../ui/UserCloseConfirm").then((module) => ({
      default: module.UserCloseConfirm,
    }))),
  USER_VIEW_DEVICES_MODAL: lazy(() =>
    import("../ui/UserViewDevices").then((module) => ({
      default: module.UserViewDevices,
    }))),
  USER_VIEW_WALLETS_MODAL: lazy(() =>
    import("../ui/UserViewWallets").then((module) => ({
      default: module.UserViewWallets,
    }))),
  USER_EDIT_IDENTITY_ACCESS_MODAL: lazy(() =>
    import("../ui/UserEditIdentityAccess").then((module) => ({
      default: module.UserEditIdentityAccess,
    }))),
  FEE_CONFIG_CREATE_EDIT_MODAL: lazy(() =>
    import("../ui/FeeConfigCreateEdit").then((module) => ({
      default: module.FeeConfigCreateEdit,
    }))),
  KYC_EPL_STATUS_MODAL: lazy(() =>
    import("../ui/KycEplStatus").then((module) => ({
      default: module.KycEplStatus,
    }))),
  COUNTRIES_CREATE_EDIT_MODAL: lazy(() =>
    import("../ui/CountriesCreateEdit").then((module) => ({
      default: module.CountriesCreateEdit,
    }))),
  KYC_DOCUMENT_IMAGES_PROGRESS_MODAL: lazy(() =>
    import("../ui/KycDocumentImagesProgress").then((module) => ({
      default: module.KycDocumentImagesProgress,
    }))),
  KYC_DOCUMENT_IMAGES_SINGLE_PREVIEW_MODAL: lazy(() =>
    import("../ui/KycDocumentImagesSinglePreview").then((module) => ({
      default: module.KycDocumentImagesSinglePreview,
    }))),
  KYC_DOCUMENT_IMAGES_COMPARE_MODAL: lazy(() =>
    import("../ui/KycDocumentImagesCompare").then((module) => ({
      default: module.KycDocumentImagesCompare,
    }))),
} as const;
