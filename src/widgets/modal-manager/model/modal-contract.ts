import type {
  KycEnableEditConfirmModalData,
} from "../ui/KycEnableEditConfirmModal.type";
import type { KycGenerateOcrConfirmModalData } from "../ui/KycGenerateOcrConfirmModal.type";
import type { KycVerificationCheckModalData } from "../ui/KycVerificationCheckModal.type";
import type { UserBlockConfirmModalData } from "../ui/UserBlockConfirmModal.type";
import type { UserCloseConfirmModalData } from "../ui/UserCloseConfirmModal.type";
import type { UserViewDevicesModalData } from "../ui/UserViewDevicesModal.type";
import type { UserViewWalletsModalData } from "../ui/UserViewWalletsModal.type";
import type { UserEditIdentityAccessModalData } from "../ui/UserEditIdentityAccessModal.type";
import type { FeeConfigCreateEditModalData } from "../ui/FeeConfigCreateEditModal.type";
import type { KycEplStatusModalData } from "../ui/KycEplStatusModal.type";
import type { CountriesCreateEditModalData } from "../ui/CountriesCreateEditModal.type";
import type { KycDocumentImagesCompareModalData } from "../ui/KycDocumentImagesCompareModal.type";
import type { KycDocumentImagesProgressModalData } from "../ui/KycDocumentImagesProgressModal.type";
import type { KycDocumentImagesSinglePreviewModalData } from "../ui/KycDocumentImagesSinglePreviewModal.type";

export interface ModalDataMap {
  KYC_ENABLE_EDIT_CONFIRM_MODAL: KycEnableEditConfirmModalData;
  KYC_GENERATE_OCR_CONFIRM_MODAL: KycGenerateOcrConfirmModalData;
  KYC_VERIFICATION_CHECK_MODAL: KycVerificationCheckModalData;
  USER_BLOCK_CONFIRM_MODAL: UserBlockConfirmModalData;
  USER_CLOSE_CONFIRM_MODAL: UserCloseConfirmModalData;
  USER_VIEW_DEVICES_MODAL: UserViewDevicesModalData;
  USER_VIEW_WALLETS_MODAL: UserViewWalletsModalData;
  USER_EDIT_IDENTITY_ACCESS_MODAL: UserEditIdentityAccessModalData;
  FEE_CONFIG_CREATE_EDIT_MODAL: FeeConfigCreateEditModalData;
  KYC_EPL_STATUS_MODAL: KycEplStatusModalData;
  COUNTRIES_CREATE_EDIT_MODAL: CountriesCreateEditModalData;
  KYC_DOCUMENT_IMAGES_PROGRESS_MODAL: KycDocumentImagesProgressModalData;
  KYC_DOCUMENT_IMAGES_SINGLE_PREVIEW_MODAL: KycDocumentImagesSinglePreviewModalData;
  KYC_DOCUMENT_IMAGES_COMPARE_MODAL: KycDocumentImagesCompareModalData;
}

export type ModalKey = keyof ModalDataMap;

export type ModalCommonCallbacks = {
  /**
   * Modal logical visibility state.
   * Used to drive open/close animations without unmounting the modal component.
   */
  open: boolean;
  onClose: () => void;
  onCloseAll: () => void;
};

export type ModalDataByKey<K extends ModalKey> = ModalDataMap[K];
export type ModalPropsByKey<K extends ModalKey> = ModalCommonCallbacks & ModalDataByKey<K>;

