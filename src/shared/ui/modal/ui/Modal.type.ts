import type { ReactNode } from "react";

import type { ModalFooterProps } from "./ModalFooter";

/**
 * Props for {@link Modal}.
 */
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
  title?: ReactNode;
  /**
   * Short description rendered below the title and wired to aria-describedby.
   */
  description?: ReactNode;
  /**
   * Custom footer node. Use `null` to hide the footer entirely.
   * When `undefined`, a default Cancel / OK footer is rendered.
   */
  footer?: ReactNode | null;
  /**
   * Content of the modal body.
   */
  children?: ReactNode;
  /**
   * Explicit width (e.g. "520px" or 520).
   * If you prefer Tailwind width classes, pass them through `className` instead.
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

