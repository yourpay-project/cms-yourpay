import type { FC } from "react";
import { FilterSelectWithClear } from "@/shared/ui";
import { USER_STATUS_OPTIONS, USER_GENDER_OPTIONS } from "../model";

export interface UserListFiltersGridProps {
  status: string;
  setStatus: (v: string) => void;
  statusSelectRef: React.RefObject<HTMLSelectElement>;
  gender: string;
  setGender: (v: string) => void;
  genderSelectRef: React.RefObject<HTMLSelectElement>;
  resetPageIndex: () => void;
}

/**
 * Grid of filter controls (Status, Gender). Country is outside next to search.
 */
export const UserListFiltersGrid: FC<UserListFiltersGridProps> = (props) => {
  const { resetPageIndex } = props;
  return (
    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
      <FilterSelectWithClear
        label="Status"
        value={props.status}
        options={USER_STATUS_OPTIONS}
        selectRef={props.statusSelectRef}
        onChange={(v) => {
          props.setStatus(v);
          resetPageIndex();
        }}
        onClear={() => {
          props.setStatus("all");
          resetPageIndex();
        }}
      />
      <FilterSelectWithClear
        label="Gender"
        value={props.gender}
        options={USER_GENDER_OPTIONS}
        selectRef={props.genderSelectRef}
        onChange={(v) => {
          props.setGender(v);
          resetPageIndex();
        }}
        onClear={() => {
          props.setGender("all");
          resetPageIndex();
        }}
      />
    </div>
  );
};
