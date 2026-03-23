import type { KycDocumentImage } from "@/entities/kyc-submission";

import type { BaseModalCallbacks } from "./BaseModalCallbacks.type";
import type { DocumentImagesDocKey } from "./KycDocumentImagesSinglePreviewModal.type";

export interface KycDocumentImagesCompareItem {
  docKey: DocumentImagesDocKey;
  title: string;
  imageUrl?: KycDocumentImage["imageUrl"];
  scale: number;
  rotation: number;
}

export interface KycDocumentImagesCompareModalData {
  items: KycDocumentImagesCompareItem[];
  onChangeScale: (docKey: DocumentImagesDocKey, delta: number) => void;
  onRotate: (docKey: DocumentImagesDocKey) => void;
  onReset: (docKey: DocumentImagesDocKey) => void;
}

export type KycDocumentImagesCompareModalProps = KycDocumentImagesCompareModalData & BaseModalCallbacks;

