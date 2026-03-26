import type { Row } from "@tanstack/react-table";

/**
 * Returns first right-pinned column id for shadow rendering.
 *
 * @param rows - Visible table rows.
 * @returns First right pinned column id or null.
 */
export function getFirstRightPinnedColumnId<TData>(rows: Row<TData>[]): string | null {
  if (rows.length === 0) {
    return null;
  }
  const firstRow = rows[0];
  const rightPinnedCell = firstRow
    .getVisibleCells()
    .find((cell) => cell.column.getIsPinned() === "right");
  return rightPinnedCell?.column.id ?? null;
}

/**
 * Resolves text alignment class from column align meta.
 *
 * @param align - Column align meta.
 * @returns Tailwind text alignment class.
 */
export function getAlignClassName(align: "left" | "center" | "right" | undefined): string {
  if (align === "center") {
    return "text-center";
  }
  if (align === "right") {
    return "text-right";
  }
  return "text-left";
}

/**
 * Resolves ellipsis behavior from column meta.
 *
 * @param ellipsisOpt - Column ellipsis option.
 * @returns Ellipsis and showTitle flags.
 */
export function resolveEllipsisOptions(
  ellipsisOpt: boolean | { showTitle?: boolean } | undefined,
): { ellipsis: boolean; showTitle: boolean } {
  const ellipsis =
    ellipsisOpt === true || (typeof ellipsisOpt === "object" && ellipsisOpt != null);
  const showTitle = ellipsis && (ellipsisOpt === true || ellipsisOpt?.showTitle !== false);
  return { ellipsis, showTitle };
}

