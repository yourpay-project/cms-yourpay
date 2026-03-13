import * as React from "react";
import type { Column } from "@tanstack/react-table";
import type { CSSProperties } from "react";

/** Default page size options for pagination (AntD-style). */
export const PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50] as const;

/** Default number of skeleton rows shown when loading. */
export const DEFAULT_SKELETON_ROW_COUNT = 5;

/**
 * Maps TanStack Table column pinning state to inline CSS for sticky/freeze columns.
 * Uses `hsl(var(--background))` so pinned cells match the theme.
 *
 * @param column - TanStack Table column (from header or cell).
 * @param isHeader - When true, applies higher z-index so header is not covered by body.
 * @returns CSS style object for position, left/right, zIndex, and backgroundColor.
 */
export function getPinningStyles<TData, TValue>(
  column: Column<TData, TValue>,
  isHeader = false
): CSSProperties {
  const isPinned = column.getIsPinned();

  if (!isPinned) return {};

  return {
    position: "sticky",
    left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
    right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
    zIndex: isPinned ? (isHeader ? 30 : 10) : isHeader ? 20 : 0,
    backgroundColor: "hsl(var(--background))",
  };
}

/** Whether to show left/right scroll shadow on pinned columns. */
export interface ScrollShadowState {
  showLeft: boolean;
  showRight: boolean;
}

/**
 * Detects horizontal scroll position so shadow is shown only when content is hidden.
 * Attach scrollRef to the table wrapper div; use the returned flags to toggle
 * .data-table-shadow-left / .data-table-shadow-right on pinned header and body cells.
 *
 * @param scrollRef - Ref to the scrollable container (the div with overflow-auto).
 * @returns { showLeft, showRight } to apply theme-aware shadow classes.
 */
export function useScrollShadow(scrollRef: React.RefObject<HTMLElement | null>): ScrollShadowState {
  const [state, setState] = React.useState<ScrollShadowState>({ showLeft: false, showRight: false });

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const update = (): void => {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      setState({
        showLeft: scrollLeft > 1,
        showRight: scrollWidth > clientWidth && scrollLeft < scrollWidth - clientWidth - 1,
      });
    };

    update();
    const rafId = requestAnimationFrame(update);
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      cancelAnimationFrame(rafId);
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [scrollRef]);

  return state;
}
