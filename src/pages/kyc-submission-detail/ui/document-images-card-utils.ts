export type DocKey = "id" | "selfie";

export const DOCUMENT_IMAGE_SCALE_MIN = 0.5;
export const DOCUMENT_IMAGE_SCALE_MAX = 3;

export function clampScale(value: number, min: number = DOCUMENT_IMAGE_SCALE_MIN, max: number = DOCUMENT_IMAGE_SCALE_MAX): number {
  return Math.max(min, Math.min(max, value));
}

export function applyScaleDelta(prev: number, delta: number): number {
  const next = Number((prev + delta).toFixed(2));
  return clampScale(next);
}

