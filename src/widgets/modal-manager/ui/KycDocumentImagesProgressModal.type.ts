import type { BaseModalCallbacks } from "./BaseModalCallbacks.type";

/**
 * Payload for document images progress modal.
 *
 * Currently empty because the modal is just a placeholder.
 */
export type KycDocumentImagesProgressModalData = Record<string, never>;

export type KycDocumentImagesProgressModalProps = KycDocumentImagesProgressModalData &
  BaseModalCallbacks;

