import { useModalStore } from "./modal-store";

export const useModalData = (): unknown | null => {
  return useModalStore((state) => state.modalData);
};
