import type { FilterField } from "@/shared/ui";

export type KycSubmissionGridItem =
  | { type: "options"; key: string; field: FilterField }
  | {
      type: "date_range";
      key: string;
      label: string;
      from: string;
      to: string;
      presetLabel: string | null;
      onRangeChange: (from: string, to: string, label: string | null) => void;
    };

interface BuildKycSubmissionFilterGridItemsParams {
  optionsFilterFields: readonly FilterField[];
  createdAtLabel: string;
  updatedAtLabel: string;
  kycFrom: string;
  kycTo: string;
  kycPresetLabel: string | null;
  setKycFrom: (v: string) => void;
  setKycTo: (v: string) => void;
  setKycPresetLabel: (v: string | null) => void;
  lastUpdateFrom: string;
  lastUpdateTo: string;
  lastUpdatePresetLabel: string | null;
  setLastUpdateFrom: (v: string) => void;
  setLastUpdateTo: (v: string) => void;
  setLastUpdatePresetLabel: (v: string | null) => void;
  resetPageIndex: () => void;
}

/**
 * Builds normalized filter grid items for KYC submission filter UI.
 *
 * @param params Filter labels, values, setters, and reset callback.
 * @returns Flat list of option/date-range grid items.
 */
export function buildKycSubmissionFilterGridItems(
  params: BuildKycSubmissionFilterGridItemsParams,
): KycSubmissionGridItem[] {
  return [
    ...params.optionsFilterFields.map((field) => ({
      type: "options" as const,
      key: `options:${field.key}`,
      field,
    })),
    {
      type: "date_range" as const,
      key: "date_range:created_at",
      label: params.createdAtLabel,
      from: params.kycFrom,
      to: params.kycTo,
      presetLabel: params.kycPresetLabel,
      onRangeChange: (from, to, label) => {
        params.setKycFrom(from);
        params.setKycTo(to);
        params.setKycPresetLabel(label);
        params.resetPageIndex();
      },
    },
    {
      type: "date_range" as const,
      key: "date_range:updated_at",
      label: params.updatedAtLabel,
      from: params.lastUpdateFrom,
      to: params.lastUpdateTo,
      presetLabel: params.lastUpdatePresetLabel,
      onRangeChange: (from, to, label) => {
        params.setLastUpdateFrom(from);
        params.setLastUpdateTo(to);
        params.setLastUpdatePresetLabel(label);
        params.resetPageIndex();
      },
    },
  ];
}
