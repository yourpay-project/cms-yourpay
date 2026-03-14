/**
 * Constants for the shared DataTable: default scroll height, viewport height, and size-based cell/header classes.
 *
 * Use {@link TABLE_BODY_VIEWPORT_HEIGHT} when the table body should have a fixed max height (~10 rows)
 * with internal scroll; empty or few rows stay content-sized (no extra space).
 */

/** Default vertical scroll height when scroll.y is not provided. Used by useDataTable. */
export const DEFAULT_SCROLL_HEIGHT = "600px";

/**
 * Fixed viewport height for table body (~10 rows). Content scrolls inside when rows exceed this;
 * when empty or few rows, the area is content-sized. Use with `scroll={{ y: TABLE_BODY_VIEWPORT_HEIGHT }}`.
 */
export const TABLE_BODY_VIEWPORT_HEIGHT = "480px";

/**
 * Cell padding and text size per table size (AntD small | medium | large).
 * Keys: small, medium, large. Values: { header, cell } Tailwind classes.
 */
export const SIZE_CLASSES = {
  small: { header: "px-2 py-2 text-xs", cell: "px-2 py-2 text-xs" },
  medium: { header: "px-4 py-3.5 text-sm", cell: "px-4 py-3 text-sm" },
  large: { header: "px-4 py-4 text-sm", cell: "px-4 py-4 text-sm" },
} as const;
