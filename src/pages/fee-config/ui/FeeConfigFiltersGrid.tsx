import type { FC } from "react";
import { FilterSelectWithClear } from "@/shared/ui";
import type { FeeStatusFilter, FeeTypeFilter } from "../model";

export interface FeeConfigFiltersGridProps {
  status: FeeStatusFilter;
  setStatus: (v: FeeStatusFilter) => void;
  feeType: FeeTypeFilter;
  setFeeType: (v: FeeTypeFilter) => void;
  service: string;
  setService: (v: string) => void;
  serviceOptions: readonly { value: string; label: string }[];
}

/**
 * Render item model for Fee Config filter controls.
 */
type FeeConfigGridItem =
  | { type: "status"; key: string }
  | { type: "fee_type"; key: string }
  | { type: "service"; key: string };

const STATUS_OPTIONS: readonly { value: FeeStatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const FEE_TYPE_OPTIONS: readonly { value: FeeTypeFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "fixed", label: "FIXED" },
  { value: "percentage", label: "PERCENTAGE" },
  { value: "tiered", label: "TIERED" },
];

/**
 * Grid of Fee Config filters rendered via one loop + switch.
 *
 * @param props - {@link FeeConfigFiltersGridProps}
 * @returns Two-column responsive filter grid.
 */
export const FeeConfigFiltersGrid: FC<FeeConfigFiltersGridProps> = (props) => {
  const gridItems: FeeConfigGridItem[] = [
    { type: "status", key: "status" },
    { type: "fee_type", key: "fee_type" },
    { type: "service", key: "service" },
  ];

  return (
    <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
      {gridItems.map((item) => {
        switch (item.type) {
          case "status":
            return (
              <FilterSelectWithClear
                key={item.key}
                label="Status"
                value={props.status}
                options={STATUS_OPTIONS}
                onChange={(v) => {
                  props.setStatus(v as FeeStatusFilter);
                }}
                onClear={() => {
                  props.setStatus("all");
                }}
                allValue="all"
              />
            );
          case "fee_type":
            return (
              <FilterSelectWithClear
                key={item.key}
                label="Fee Type"
                value={props.feeType}
                options={FEE_TYPE_OPTIONS}
                onChange={(v) => {
                  props.setFeeType(v as FeeTypeFilter);
                }}
                onClear={() => {
                  props.setFeeType("all");
                }}
                allValue="all"
              />
            );
          case "service":
            return (
              <FilterSelectWithClear
                key={item.key}
                label="Service"
                value={props.service || "all"}
                options={[{ value: "all", label: "All" }, ...props.serviceOptions]}
                onChange={(v) => {
                  props.setService(v === "all" ? "" : v);
                }}
                onClear={() => {
                  props.setService("");
                }}
                allValue="all"
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
};

