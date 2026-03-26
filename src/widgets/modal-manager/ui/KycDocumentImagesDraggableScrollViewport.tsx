import type { FC } from "react";
import { useMemo, useRef, useState } from "react";

export interface KycDocumentImagesDraggableScrollViewportProps {
  scale: number;
  className?: string;
  children: React.ReactNode;
}

/**
 * Lightweight drag-to-scroll wrapper.
 *
 * Keeps native scrolling behavior while allowing pointer drag when zoomed.
 */
export const KycDocumentImagesDraggableScrollViewport: FC<KycDocumentImagesDraggableScrollViewportProps> = ({
  scale,
  className,
  children,
}) => {
  const viewportRef = useRef<HTMLDivElement>(null);

  const dragRef = useRef<{
    pointerId: number | null;
    startX: number;
    startY: number;
    startScrollLeft: number;
    startScrollTop: number;
  }>({
    pointerId: null,
    startX: 0,
    startY: 0,
    startScrollLeft: 0,
    startScrollTop: 0,
  });

  const [isDragging, setIsDragging] = useState(false);
  const shouldEnableDrag = useMemo(() => scale > 1, [scale]);

  let cursorClassName = "";
  if (shouldEnableDrag) {
    cursorClassName = isDragging ? "cursor-grabbing" : "cursor-grab";
  }

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!shouldEnableDrag || !viewportRef.current) return;
    const target = event.target as HTMLElement;
    if (target.closest("[data-no-drag='true']")) return;

    dragRef.current.pointerId = event.pointerId;
    dragRef.current.startX = event.clientX;
    dragRef.current.startY = event.clientY;
    dragRef.current.startScrollLeft = viewportRef.current.scrollLeft;
    dragRef.current.startScrollTop = viewportRef.current.scrollTop;
    viewportRef.current.setPointerCapture(event.pointerId);
    setIsDragging(true);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!viewportRef.current || dragRef.current.pointerId !== event.pointerId) return;
    event.preventDefault();

    const deltaX = event.clientX - dragRef.current.startX;
    const deltaY = event.clientY - dragRef.current.startY;
    viewportRef.current.scrollLeft = dragRef.current.startScrollLeft - deltaX;
    viewportRef.current.scrollTop = dragRef.current.startScrollTop - deltaY;
  };

  const onPointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!viewportRef.current || dragRef.current.pointerId !== event.pointerId) return;
    dragRef.current.pointerId = null;
    viewportRef.current.releasePointerCapture(event.pointerId);
    setIsDragging(false);
  };

  return (
    <div
      ref={viewportRef}
      className={[className, cursorClassName].filter(Boolean).join(" ")}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      style={{ touchAction: shouldEnableDrag ? "none" : "auto" }}
    >
      {children}
    </div>
  );
};

