import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/shared/lib/utils";
import { ModalFooter } from "./ModalFooter";
import { useModalAnimation } from "./useModalAnimation";
import type { ModalProps } from "./Modal.type";

/** Framer Motion variants shared between overlay and content for consistency. */
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const contentVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

/** Spring-like transition tuned for 60fps in webview environments (transform + opacity only). */
const springTransition = {
  type: "spring" as const,
  stiffness: 260,
  damping: 24,
  duration: 0.22,
};

/**
 * Controlled, accessible modal dialog component.
 *
 * Uses `AnimatePresence` + `motion.div` for enter/exit animations so the exit
 * animation runs before the portal is unmounted. Only `opacity` and `scale`
 * (transform) are animated — both GPU-composited and 60fps-safe in webviews.
 *
 * @param props {@link ModalProps} controlling visibility, content, and actions.
 * @returns A portal-based modal dialog with header, body, and footer sections.
 */
export const Modal: React.FC<ModalProps> = ({
  open,
  onCancel,
  onOk,
  confirmLoading,
  title,
  description,
  footer,
  okText,
  cancelText,
  children,
  width = "520px",
  centered,
  className,
}) => {
  const { visible, handleVisibilityChange } = useModalAnimation({ open });

  const contentWidth =
    typeof width === "number" ? `${width}px` : width || "520px";

  if (!visible) {
    return null;
  }

  return (
    <Dialog.Root
      open={visible}
      onOpenChange={(nextOpen) => handleVisibilityChange(nextOpen, onCancel)}
    >
      <Dialog.Portal>
        <AnimatePresence>
          {open && (
            <>
              {/* Backdrop */}
              <Dialog.Overlay asChild>
                <motion.div
                  key="modal-overlay"
                  variants={overlayVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  transition={{ duration: 0.18 }}
                  className="fixed inset-0 z-50 bg-black/45"
                />
              </Dialog.Overlay>

              {/* Content wrapper */}
              <div
                className={cn(
                  "fixed inset-0 z-50 flex justify-center px-4 py-6",
                  centered ? "items-center" : "items-start"
                )}
              >
                <Dialog.Content asChild>
                  <motion.div
                    key="modal-content"
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    transition={springTransition}
                    style={{ width: contentWidth }}
                    className={cn(
                      "relative max-h-[80vh] rounded-xl bg-card text-foreground shadow-xl shadow-black/15",
                      "flex flex-col overflow-hidden",
                      className
                    )}
                  >
                    {/*
                     * Keep Radix DialogTitle/DialogDescription as direct children for reliable
                     * accessibility detection in Radix internals.
                     */}
                    <Dialog.Title className="sr-only">{title ?? "Dialog"}</Dialog.Title>
                    <Dialog.Description className="sr-only">
                      {description ?? "Dialog description"}
                    </Dialog.Description>

                    {title != null || description != null ? (
                      <div className="pt-5 px-6 pb-4">
                        {title != null ? <h2 className="text-base font-semibold">{title}</h2> : null}
                        {description != null ? (
                          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                        ) : null}
                      </div>
                    ) : null}

                    <div className="px-6 py-2">{children}</div>

                    {footer === null
                      ? null
                      : footer !== undefined
                        ? (
                          <div className="px-6 pb-5 pt-4">{footer}</div>
                        )
                        : (
                          <ModalFooter
                            okText={okText}
                            cancelText={cancelText}
                            confirmLoading={confirmLoading}
                            onCancel={onCancel}
                            onOk={onOk}
                          />
                        )}

                    <button
                      type="button"
                      onClick={onCancel}
                      className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      aria-label="Close"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </motion.div>
                </Dialog.Content>
              </div>
            </>
          )}
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
