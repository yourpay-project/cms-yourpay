import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { animated } from "@react-spring/web";

import { cn } from "@/shared/lib/utils";
import { ModalFooter, ModalFooterProps } from "./ModalFooter";
import { useModalAnimation } from "./useModalAnimation";

export interface ModalProps extends ModalFooterProps {
  /**
   * Controls whether the modal is visible.
   */
  open: boolean;
  /**
   * Called when the user attempts to close the modal
   * via mask click, close icon, or Cancel button.
   */
  onCancel?: () => void;
  /**
   * Modal title content rendered in the header.
   */
  title?: React.ReactNode;
  /**
   * Custom footer node. Use `null` to hide footer entirely.
   * When `undefined`, a default AntD-like footer is rendered.
   */
  footer?: React.ReactNode | null;
  /**
   * Content of the modal body.
   */
  children?: React.ReactNode;
  /**
   * Explicit width (e.g. "520px" or 520).
   * If you prefer Tailwind width classes, pass them
   * through `className` instead.
   */
  width?: string | number;
  /**
   * Whether the modal should be vertically centered.
   */
  centered?: boolean;
  /**
   * Additional className for the modal content container.
   */
  className?: string;
}

/**
 * Controlled Ant Design–style modal built on top of Radix Dialog.
 *
 * This component mimics the core `Modal` API from AntD (open, onCancel, onOk,
 * footer, centered, width, confirmLoading) while using Tailwind CSS and
 * `@react-spring/web` for smooth open/close animations.
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
  footer,
  okText,
  cancelText,
  children,
  width = "520px",
  centered,
  className,
}) => {
  const { visible, handleVisibilityChange, overlayStyles, contentStyles } = useModalAnimation({
    open,
  });

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
        <Dialog.Overlay asChild>
          <animated.div
            style={overlayStyles}
            className="fixed inset-0 z-50 bg-black/45"
          />
        </Dialog.Overlay>
        <div
          className={cn(
            "fixed inset-0 z-50 flex justify-center px-4 py-6",
            centered ? "items-center" : "items-start"
          )}
        >
          <Dialog.Content asChild>
            <animated.div
              style={{ ...contentStyles, width: contentWidth }}
              className={cn(
                "relative max-h-[80vh] rounded-xl bg-background text-foreground shadow-xl shadow-black/15",
                "flex flex-col overflow-hidden",
                className
              )}
            >
              <div className="pt-5 px-6 pb-4">
                <Dialog.Title className="text-base font-semibold">
                  {title}
                </Dialog.Title>
              </div>

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
            </animated.div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

