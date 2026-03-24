import * as React from "react";

export interface ScrollEdgeShadowState {
  showTop: boolean;
  showBottom: boolean;
  showLeft: boolean;
  showRight: boolean;
}

/**
 * Detects whether a scroll container has hidden overflow on each side.
 * Useful to render directional edge shadows (top/right/bottom/left).
 */
export function useScrollEdgeShadow(
  scrollRef: React.RefObject<HTMLElement | null>,
): ScrollEdgeShadowState {
  const [state, setState] = React.useState<ScrollEdgeShadowState>({
    showTop: false,
    showBottom: false,
    showLeft: false,
    showRight: false,
  });

  React.useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    const update = () => {
      const { scrollTop, scrollHeight, clientHeight, scrollLeft, scrollWidth, clientWidth } = element;

      const verticalOverflow = scrollHeight > clientHeight + 1;
      const horizontalOverflow = scrollWidth > clientWidth + 1;

      setState({
        showTop: verticalOverflow && scrollTop > 1,
        showBottom: verticalOverflow && scrollTop < scrollHeight - clientHeight - 1,
        showLeft: horizontalOverflow && scrollLeft > 1,
        showRight: horizontalOverflow && scrollLeft < scrollWidth - clientWidth - 1,
      });
    };

    update();
    const rafId = requestAnimationFrame(update);
    element.addEventListener("scroll", update, { passive: true });
    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(element);

    return () => {
      cancelAnimationFrame(rafId);
      element.removeEventListener("scroll", update);
      resizeObserver.disconnect();
    };
  }, [scrollRef]);

  return state;
}

