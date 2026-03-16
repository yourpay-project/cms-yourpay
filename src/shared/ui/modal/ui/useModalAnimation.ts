import * as React from "react";
import type { SpringValue } from "@react-spring/web";
import { useSpring } from "@react-spring/web";

interface UseModalAnimationParams {
  open: boolean;
  onAfterClose?: () => void;
}

interface UseModalAnimationResult {
  visible: boolean;
  handleVisibilityChange: (nextOpen: boolean, onCancel?: () => void) => void;
  overlayStyles: {
    opacity: SpringValue<number>;
  };
  contentStyles: {
    opacity: SpringValue<number>;
    transform: SpringValue<string>;
  };
}

/**
 * Hook to control animated mounting and unmounting for {@link Modal}.
 *
 * @param params.open Whether the modal is logically open.
 * @param params.onAfterClose Optional callback fired after the close animation completes.
 * @returns Animated visibility state and styles for overlay and content.
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

  const overlayStyles = useSpring({
    opacity: open ? 1 : 0,
    config: { tension: 260, friction: 24 },
    onRest: (result) => {
      if (!open && result.value.opacity === 0) {
        setVisible(false);
        onAfterClose?.();
      }
    },
  });

  const contentStyles = useSpring({
    opacity: open ? 1 : 0,
    transform: open ? "scale(1)" : "scale(0.95)",
    config: { tension: 260, friction: 24 },
  });

  const handleVisibilityChange = (nextOpen: boolean, onCancel?: () => void): void => {
    if (!nextOpen && visible && onCancel) {
      onCancel();
    }
  };

  return {
    visible,
    handleVisibilityChange,
    overlayStyles,
    contentStyles,
  };
};

