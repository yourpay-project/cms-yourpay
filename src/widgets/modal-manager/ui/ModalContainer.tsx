import type { FC } from "react";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { useModalStore } from "@/shared/lib/modal";
import { MODAL_COMPONENT_REGISTRY } from "../model/modal-registry";
import { ModalGlobalLoadingOverlay } from "./ModalGlobalLoadingOverlay";
import type { ModalKey } from "../model/modal-contract";

/**
 * Central modal mount point.
 *
 * Resolves modal component lazily and injects typed modal payload props.
 */
export const ModalContainer: FC = () => {
  const isOpen = useModalStore((state) => state.isOpen);
  const modalType = useModalStore((state) => state.modalType);
  const modalData = useModalStore((state) => state.modalData);
  const close = useModalStore((state) => state.close);
  const closeAll = useModalStore((state) => state.closeAll);

  if (!isOpen || !modalType) {
    return null;
  }

  const ResolvedModal = MODAL_COMPONENT_REGISTRY[modalType as ModalKey];
  const resolvedProps = modalData ?? {};

  return (
    <>
      <Suspense
        fallback={
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        }
      >
        <ResolvedModal
          {...resolvedProps}
          onClose={close}
          onCloseAll={closeAll}
        />
      </Suspense>
      <ModalGlobalLoadingOverlay enabled={isOpen} />
    </>
  );
};
