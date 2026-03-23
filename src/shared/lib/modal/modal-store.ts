import { create } from "zustand";
import type { ModalType } from "./modal-types";

interface ModalStoreState {
  isOpen: boolean;
  modalType: ModalType | null;
  modalData: unknown;
  open: {
    (key: ModalType): void;
    (key: ModalType, data: unknown): void;
    (args: { key: ModalType; data?: unknown }): void;
  };
  close: () => void;
  closeAll: () => void;
}

export const useModalStore = create<ModalStoreState>((set, get) => ({
  isOpen: false,
  modalType: null,
  modalData: null,
  open: ((typeOrArgs: ModalType | { key: ModalType; data?: unknown }, data?: unknown) => {
    const resolvedKey =
      typeof typeOrArgs === "object" && typeOrArgs != null && "key" in typeOrArgs ? typeOrArgs.key : typeOrArgs;
    const resolvedData =
      typeof typeOrArgs === "object" && typeOrArgs != null && "key" in typeOrArgs ? typeOrArgs.data : data;

    if (get().isOpen) {
      set({
        isOpen: false,
        modalType: null,
        modalData: null,
      });
    }

    set({
      isOpen: true,
      modalType: resolvedKey,
      modalData: resolvedData ?? null,
    });
  }) as ModalStoreState["open"],
  close: () => {
    set({
      isOpen: false,
      modalType: null,
      modalData: null,
    });
  },
  closeAll: () => {
    set({
      isOpen: false,
      modalType: null,
      modalData: null,
    });
  },
}));
