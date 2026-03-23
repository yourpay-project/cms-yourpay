import type { FC } from "react";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { useModalStore } from "@/shared/lib/modal";
import { Modal } from "@/shared/ui/modal";
import { MODAL_COMPONENT_REGISTRY, MODAL_SHELL_CONFIG } from "../model/modal-registry";
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

  if (!modalType) {
    return null;
  }

  const shellConfig = MODAL_SHELL_CONFIG[modalType as ModalKey];

  const ResolvedModal = MODAL_COMPONENT_REGISTRY[modalType as ModalKey] as FC<
    Record<string, unknown> & { open: boolean; onClose: () => void; onCloseAll: () => void }
  >;
  const resolvedProps = (modalData ?? {}) as Record<string, unknown>;

  return (
    <>
      <Suspense
        fallback={
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        }
      >
        <Modal
          open={isOpen}
          onCancel={close}
          footer={null}
          title={shellConfig.title ?? null}
          description={shellConfig.description}
          centered={shellConfig.centered}
          width={shellConfig.width}
          className={shellConfig.className}
        >
          <ResolvedModal
            {...(resolvedProps as Record<string, unknown>)}
            open={isOpen}
            onClose={close}
            onCloseAll={closeAll}
          />
        </Modal>
      </Suspense>
      <ModalGlobalLoadingOverlay enabled={isOpen} />
    </>
  );
};
