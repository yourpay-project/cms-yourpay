import type { ModalKey } from "./modal-contract";
import { MODAL_LOADERS } from "./modal-registry";

export const prefetchModal = (type: ModalKey): void => {
  void MODAL_LOADERS[type]();
};
