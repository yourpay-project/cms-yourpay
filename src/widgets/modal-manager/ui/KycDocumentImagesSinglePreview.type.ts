import type { KycDocumentImage } from "@/entities/kyc-submission";

import type { BaseModalCallbacks } from "./BaseModalCallbacks.type";

export type DocumentImagesDocKey = "id" | "selfie";

export interface KycDocumentImagesSinglePreviewData {
  activeDocKey: DocumentImagesDocKey;
  activeTitle: string;
  activeDocument?: KycDocumentImage;
  activeScale: number;
  activeRotation: number;
  onChangeScale: (docKey: DocumentImagesDocKey, delta: number) => void;
  onRotate: (docKey: DocumentImagesDocKey) => void;
  onRotateLeft: (docKey: DocumentImagesDocKey) => void;
  onReset: (docKey: DocumentImagesDocKey) => void;
}

export type KycDocumentImagesSinglePreviewProps = KycDocumentImagesSinglePreviewData &
  BaseModalCallbacks;

