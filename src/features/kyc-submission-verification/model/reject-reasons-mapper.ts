import type { RejectReasonOption } from "./use-reject-reasons-query";

interface RawRejectReason {
  code?: string;
  label_title?: string;
  label_description?: string;
}

/**
 * Maps raw reject reasons array from API into UI options.
 */
export function mapRejectReasons(rawData: unknown): RejectReasonOption[] {
  const list = Array.isArray(rawData)
    ? rawData
    : Array.isArray((rawData as { list?: unknown[] } | undefined)?.list)
      ? ((rawData as { list?: unknown[] }).list ?? [])
      : [];
  return list
    .filter((item): item is RawRejectReason => Boolean(item))
    .map((item) => ({
      code: item.code ?? "",
      title: item.label_title ?? item.code ?? "Unknown reason",
      description: item.label_description ?? "",
    }))
    .filter((item) => item.code.trim() !== "");
}
