export const DOCUMENT_IMAGE_SCALE_MIN = 0.5;
export const DOCUMENT_IMAGE_SCALE_MAX = 3;

/**
 * Clamp a scale value into the supported range for document image previews.
 *
 * @param value - Raw scale value.
 * @param min - Minimum allowed scale.
 * @param max - Maximum allowed scale.
 * @returns Clamped scale value.
 */
export function clampDocumentImageScale(
  value: number,
  min: number = DOCUMENT_IMAGE_SCALE_MIN,
  max: number = DOCUMENT_IMAGE_SCALE_MAX
): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Apply a delta to a scale value and clamp it into the supported range.
 *
 * @param prev - Previous scale value.
 * @param delta - Delta to apply (positive or negative).
 * @returns Next scale value.
 */
export function applyDocumentImageScaleDelta(prev: number, delta: number): number {
  const next = Number((prev + delta).toFixed(2));
  return clampDocumentImageScale(next);
}

/**
 * Resolve an image height percentage based on a zoom scale.
 *
 * @param scale - Current zoom scale.
 * @returns Height percentage as integer (min 25%).
 */
export function toDocumentImageHeightPercent(scale: number): number {
  return Math.max(25, Math.round(scale * 100));
}

