import type {
  KycEnableEditConfirmData,
} from "../ui/KycEnableEditConfirm.type";
import type { KycGenerateOcrConfirmData } from "../ui/KycGenerateOcrConfirm.type";
import type { KycVerificationCheckDataPayload } from "../ui/KycVerificationCheck.type";
import type { UserBlockConfirmData } from "../ui/UserBlockConfirm.type";
import type { UserCloseConfirmData } from "../ui/UserCloseConfirm.type";
import type { UserViewDevicesData } from "../ui/UserViewDevices.type";
import type { UserViewWalletsData } from "../ui/UserViewWallets.type";
import type { UserEditIdentityAccessData } from "../ui/UserEditIdentityAccess.type";
import type { FeeConfigCreateEditData } from "../ui/FeeConfigCreateEdit.type";
import type { KycEplStatusData } from "../ui/KycEplStatus.type";
import type { CountriesCreateEditData } from "../ui/CountriesCreateEdit.type";
import type { KycDocumentImagesCompareData } from "../ui/KycDocumentImagesCompare.type";
import type { KycDocumentImagesProgressData } from "../ui/KycDocumentImagesProgress.type";
import type { KycDocumentImagesSinglePreviewData } from "../ui/KycDocumentImagesSinglePreview.type";

export interface ModalDataMap {
  KYC_ENABLE_EDIT_CONFIRM_MODAL: KycEnableEditConfirmData;
  KYC_GENERATE_OCR_CONFIRM_MODAL: KycGenerateOcrConfirmData;
  KYC_VERIFICATION_CHECK_MODAL: KycVerificationCheckDataPayload;
  USER_BLOCK_CONFIRM_MODAL: UserBlockConfirmData;
  USER_CLOSE_CONFIRM_MODAL: UserCloseConfirmData;
  USER_VIEW_DEVICES_MODAL: UserViewDevicesData;
  USER_VIEW_WALLETS_MODAL: UserViewWalletsData;
  USER_EDIT_IDENTITY_ACCESS_MODAL: UserEditIdentityAccessData;
  FEE_CONFIG_CREATE_EDIT_MODAL: FeeConfigCreateEditData;
  KYC_EPL_STATUS_MODAL: KycEplStatusData;
  COUNTRIES_CREATE_EDIT_MODAL: CountriesCreateEditData;
  KYC_DOCUMENT_IMAGES_PROGRESS_MODAL: KycDocumentImagesProgressData;
  KYC_DOCUMENT_IMAGES_SINGLE_PREVIEW_MODAL: KycDocumentImagesSinglePreviewData;
  KYC_DOCUMENT_IMAGES_COMPARE_MODAL: KycDocumentImagesCompareData;
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

