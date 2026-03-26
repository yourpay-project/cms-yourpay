import * as React from "react";

interface UseModalAnimationParams {
  open: boolean;
  onAfterClose?: () => void;
}

interface UseModalAnimationResult {
  visible: boolean;
  handleVisibilityChange: (nextOpen: boolean, onCancel?: () => void) => void;
}

/**
 * Hook to control delayed unmounting for {@link Modal}.
 *
 * In the Framer Motion version, `AnimatePresence` in `Modal.tsx` handles the
 * exit animation. This hook's only responsibility is to keep `visible = true`
 * long enough for the exit animation to complete before React unmounts the
 * portal tree, and to fire `onAfterClose` once the close animation finishes.
 *
 * @param params.open Whether the modal is logically open.
 * @param params.onAfterClose Optional callback fired after the close animation completes.
 * @returns Visibility state and an onChange handler for the Radix Dialog.
 */
export const useModalAnimation = ({
  open,
  onAfterClose,
}: UseModalAnimationParams): UseModalAnimationResult => {
  const [visible, setVisible] = React.useState(open);

  React.useEffect(() => {
    if (open) {
      setVisible(true);
    }
  }, [open]);

  // Called by Framer Motion's `onAnimationComplete` on the exit variant so we
  // only unmount after the animation has fully run.
  React.useEffect(() => {
    if (!open) {
      // Give the exit animation time to complete (matches Modal transition duration).
      const id = setTimeout(() => {
        setVisible(false);
        onAfterClose?.();
      }, 220);
      return () => clearTimeout(id);
    }
  }, [open, onAfterClose]);

  const handleVisibilityChange = (nextOpen: boolean, onCancel?: () => void): void => {
    if (!nextOpen && visible && onCancel) {
      onCancel();
    }
  };

  return {
    visible,
    handleVisibilityChange,
  };
};
