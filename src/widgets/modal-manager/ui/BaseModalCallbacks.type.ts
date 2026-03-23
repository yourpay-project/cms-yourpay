/**
 * Shared callbacks injected by the modal container.
 */
export interface BaseModalCallbacks {
  /**
   * Modal logical visibility state.
   * Used to drive open/close animations without unmounting the modal component.
   */
  open: boolean;
  onClose: () => void;
  onCloseAll: () => void;
}

