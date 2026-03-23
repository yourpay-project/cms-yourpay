import type { BaseModalCallbacks } from "./BaseModalCallbacks.type";

/**
 * Payload for document images progress modal.
 *
 * Currently empty because the modal is just a placeholder.
 */
export type KycDocumentImagesProgressData = Record<string, never>;

export type KycDocumentImagesProgressProps = KycDocumentImagesProgressData &
  BaseModalCallbacks;

