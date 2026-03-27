import type { FC } from "react";
import type { FilterField } from "@/shared/ui";
import { buildKycSubmissionFilterGridItems } from "../model/build-kyc-submission-filter-grid-items";
import { KycSubmissionFiltersGridItemRow } from "./KycSubmissionFiltersGridItemRow";

export interface KycSubmissionFiltersGridProps {
  optionsFilterFields: readonly FilterField[];
  selectedOptionFilterValues: Record<string, string>;
  handleChangeOptionFilter: (key: string, value: string) => void;
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
 * Grid of KYC filter controls rendered in a single loop + switch pipeline.
 *
 * @param props - {@link KycSubmissionFiltersGridProps}
 * @returns Two-column responsive grid of option and date-range controls.
 */
export const KycSubmissionFiltersGrid: FC<KycSubmissionFiltersGridProps> = (props) => {
  const gridItems = buildKycSubmissionFilterGridItems({
    optionsFilterFields: props.optionsFilterFields,
    createdAtLabel: props.createdAtLabel,
    updatedAtLabel: props.updatedAtLabel,
    kycFrom: props.kycFrom,
    kycTo: props.kycTo,
    kycPresetLabel: props.kycPresetLabel,
    setKycFrom: props.setKycFrom,
    setKycTo: props.setKycTo,
    setKycPresetLabel: props.setKycPresetLabel,
    lastUpdateFrom: props.lastUpdateFrom,
    lastUpdateTo: props.lastUpdateTo,
    lastUpdatePresetLabel: props.lastUpdatePresetLabel,
    setLastUpdateFrom: props.setLastUpdateFrom,
    setLastUpdateTo: props.setLastUpdateTo,
    setLastUpdatePresetLabel: props.setLastUpdatePresetLabel,
    resetPageIndex: props.resetPageIndex,
  });

  return (
    <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
      {gridItems.map((item) => (
        <KycSubmissionFiltersGridItemRow
          key={item.key}
          item={item}
          selectedOptionFilterValues={props.selectedOptionFilterValues}
          handleChangeOptionFilter={props.handleChangeOptionFilter}
          resetPageIndex={props.resetPageIndex}
        />
      ))}
    </div>
  );
};
