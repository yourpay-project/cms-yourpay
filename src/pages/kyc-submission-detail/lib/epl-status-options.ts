export const EPL_STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
] as const;

export type EplStatusValue = (typeof EPL_STATUS_OPTIONS)[number]["value"];

export const eplStatusClassByValue: Record<EplStatusValue, string> = {
  pending: "bg-warning/15 text-warning border-warning/30",
  approved: "bg-success/15 text-success border-success/30",
  rejected: "bg-destructive/15 text-destructive border-destructive/30",
};

export const EPL_STATUS_EDIT_OPTIONS = [
  { value: "approved", label: "approved" },
  { value: "rejected", label: "rejected" },
] as const;

