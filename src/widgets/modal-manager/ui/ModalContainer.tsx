import type { FC } from "react";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { useModalStore } from "@/shared/lib/modal";
import { cn } from "@/shared/lib";
import { Modal } from "@/shared/ui/modal";
import { MODAL_COMPONENT_REGISTRY, MODAL_SHELL_CONFIG } from "../model/modal-registry";
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
  const dynamicMaxWidth =
    shellConfig.width == null
      ? undefined
      : typeof shellConfig.width === "number"
        ? `${shellConfig.width}px`
        : shellConfig.width;

  const ResolvedModal = MODAL_COMPONENT_REGISTRY[modalType as ModalKey] as FC<
    Record<string, unknown> & { open: boolean; onClose: () => void; onCloseAll: () => void }
  >;
  const resolvedProps = (modalData ?? {}) as Record<string, unknown>;

  return (
    <>
      <Modal
        open={isOpen}
        onCancel={close}
        footer={null}
        title={shellConfig.title ?? null}
        description={shellConfig.description}
        centered={shellConfig.centered}
        className={cn(!dynamicMaxWidth && "max-w-[520px]", shellConfig.className)}
        style={dynamicMaxWidth ? { width: "100%", maxWidth: dynamicMaxWidth } : undefined}
      >
        <Suspense
          fallback={
            <div className="flex min-h-[200px] w-full items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          }
        >
          <ResolvedModal
            {...(resolvedProps as Record<string, unknown>)}
            open={isOpen}
            onClose={close}
            onCloseAll={closeAll}
          />
        </Suspense>
      </Modal>
    </>
  );
};
