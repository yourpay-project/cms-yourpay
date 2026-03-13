/**
 * Constants for the shared DataTable: default scroll height and size-based cell/header classes.
 */

/** Default vertical scroll height when scroll.y is not provided. Used by useDataTable. */
export const DEFAULT_SCROLL_HEIGHT = "600px";

/**
 * Cell padding and text size per table size (AntD small | medium | large).
 * Keys: small, medium, large. Values: { header, cell } Tailwind classes.
 */
export const SIZE_CLASSES = {
  small: { header: "px-2 py-2 text-xs", cell: "px-2 py-2 text-xs" },
  medium: { header: "px-4 py-3.5 text-sm", cell: "px-4 py-3 text-sm" },
  large: { header: "px-4 py-4 text-sm", cell: "px-4 py-4 text-sm" },
} as const;
